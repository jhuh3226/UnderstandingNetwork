console.log("Page loaded, hello");

// fetch reference
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

const btnFetch = document.getElementById("btnFetch");
const log = document.getElementById("log");
var dateControl = document.querySelector('input[type="date"]');

let submittedTime = null;
var submittedTimeStamp = null;

let start = null;
let end = null;

let centerData, kitchenData, codingLabData = [];
let wdCenterData, wdKitchenData, wdCodingLabData = [];      // for whole day
let daokiCenter, daokiKitchen, daokiCodingLab = [];
let wdDaokiCenter, wdDaokiKitchen, wdDaokiCodingLab = [];      // for whole day
// let soundCenter, soundKitchen, soundCodingLab = [];
// convert daoki decibel number to note
let centerNotes, kitchenNotes, codingLabNotes = [];
let wdCenterNotes, wdKitchenNotes, wdCodingLabNotes = [];      // for whole day

let centerDataIndex, kitchenDataIndex, codingLabDataIndex = 0;
let wdCenterDataIndex, wdKitchenDataIndex, wdCodingLabDataIndex = 0;        // index for whole day
let index = 0;
let wdIndex = 0;      // for whole day
let i, j, k = 0;
let wdI, wdJ, wdK = 0;      // for whole day
let timeIncre = 0;

let playOn = false;
let stillPlaying = true;
let userRequestPlayOn = false;
// let hourlyChimeOn = false;

let major = [0, 2, 4, 5, 7, 9, 11, 12];
let soundArray = [6, 6, 2, 6, 6, 3, 3, 4, 4, 1, 2, 2, 4, 4, 4, 1, 3, 4, 7, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 2, 2, 2, 3, 2, 0, 2, 4, 0, 2, 4, 7, 4, 2, 0, 2, 4, 1, 3, 5, 7, 7, 6, 4, 3, 2, 5, 2, 7, 6, 7, 6, 5, 4, 2, 1, 7, 0, 0, 2, 3, 3, 4, 3, 3, 2, 0, 0, 2, 2, 3, 4, 4, 5, 7, 0, 0, 1, 2, 0, 0, 3, 2, 2, 4, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 2, 1, 0, 0, 0, 1, 2, 1, 2, 1, 7, 6, 2, 1, 4, 3, 1, 2, 6, 7, 0, 7, 6, 2, 1, 0, 4, 4, 5, 5, 3, 3, 4, 4, 3, 3, 3, 3, 1, 1, 5, 5, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0, 1, 3, 1, 1, 4, 4, 6, 6, 3, 3, 2, 2, 4, 4, 4, 4, 6, 6];
let root = 0;
let wdRoot = 0;      // for whole day
let scale = major;
let pos = 0;
let wdPos = 0;      // for whole day
let octave = 2;

// create a synth and connect it to the main output (your speakers)
// https://tonejs.github.io/docs/14.7.77/PolySynth.html
const synth = new Tone.PolySynth().toDestination();

//play a middle 'C' for the duration of an 8th note
const now = Tone.now()

const firebaseLink = "https://us-central1-understandingnetwork-90aa1.cloudfunctions.net/app"

btnFetch.addEventListener('click', () => {
    console.log(centerData.length);
    console.log(centerData);
    console.log(daokiCenter);
    log.innerHTML = daokiCenter;
    // getCenterData();
});

let isPlaying = false;

submitTime.addEventListener('click', () => {
    console.log("User submited time");
    submittedTime = dateControl.value;
    submittedTimeStamp = new Date(submittedTime).getTime();

    // submittedTimeStamp is in GMT times, so we have to add 5 hours to be EST 00:00 and add 13 hours to be EST 08:00
    // so, it should add 13 hours (46800 epoc) for the start
    // 13 + 16 = 29 to reach 12:00 AM, and subtract 1 seconds
    // and 86,399 for the ending


    // userRequestPlayOn = true;
    hourlyChimeSpecificDate(submittedTimeStamp);

    console.log(submittedTimeStamp / 1000);   // delete last three 0s
    console.log(submittedTimeStamp / 1000 + 46800);   // starting at EST 8:00
    console.log(submittedTimeStamp / 1000 + 104340);        // ending at EST 23:59:59
});

// on clicking the ___btn, start the tone.js
function startAudio() {
    Tone.start();
    console.log("Songs can now be played");
    isPlaying = true;
}

function stopAudio() {
    isPlaying = false;
}

Tone.Transport.scheduleOnce(playHourlyNote, 0);
Tone.Transport.scheduleOnce(playClosingSong, 0);

// Second Mark
let counterTime = 0
setInterval(() => {
    if (counterTime % 360 === 0) {
        console.log("m") // sound to play (once)
    }
    // else if (counterTime % 1 === 0) {
    //     console.log("s") // sound to play (once)
    // }
    counterTime += 1
}, 1000)


setInterval(function () {
    //code goes here that will be run every 1 seconds.    
    realTime();
}, 1000);


setInterval(function () {
    hourlyChime();
}, 1000);

setInterval(function () {
}, 1000);

/* ------------------------------------------------------------------------------------------ */
var date, yer, month, day, hour, minuites, seconds, millis = 0;

// iso8601string to timeStamp
function convert(iso8601string) {
    return "/Date(" + (new Date(iso8601string)).getTime();
}

// get the realtime
function realTime() {
    // everything is being recorded Local time(EST)
    date = new Date();
    year = date.getFullYear();
    month = ("0" + (date.getMonth() + 1)).substr(-2);
    day = ("0" + date.getDate()).substr(-2);
    hour = ("0" + date.getHours()).substr(-2);
    minutes = ("0" + date.getMinutes()).substr(-2);
    seconds = ("0" + date.getSeconds()).substr(-2);
    millis = ("0" + date.getMilliseconds()).substr(-2);
    // console.log(`${year}-${month}-${day} ${hour}:${minutes}:${seconds}`);
    toTimestamp(year, month, day, hour, minutes, seconds, millis);

    return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
}

// (move this to server.js)
// get the current year, month, day, hour, minute to timestamp
// referenced https://www.hashbangcode.com/article/convert-date-timestamp-javascript
// https://www.epochconverter.com/
function toTimestamp(year, month, day, hour, minute, second) {
    var datum = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    // console.log(datum.getTime() / 1000);
    return datum.getTime() / 1000;
}

/* ------------------------------------------------------------------------------------------ */
// (move this to server.js)
// At every hour, GET the query data
// but for now test it console
function hourlyChime() {
    // minutes == testMin.toString() 
    // minutes == "00"
    // (seconds == "00" || seconds == "30") && hour != "00"
    // minutes == "00" && hour != "00"

    if (minutes == "00" && hour != "00") {
        console.log("It is sharp hour");
        // reset all the index and list
        resetData();

        // from current timestamp - 3600 (hour ago) to current timestamp - 60 (one minute ago)
        var queryStartTime = parseInt(toTimestamp(year, month, day, hour, minutes, "00")) - 3600;
        var queryEndTime = parseInt(toTimestamp(year, month, day, hour, minutes, "00")) - 60;
        console.log(`${queryStartTime}, ${queryEndTime}`);

        // GET the data in query
        getAllData(queryStartTime, queryEndTime).then(
            function () {
                sortAllDaokiVal().then(
                    function () {
                        convertToNote().then(
                            function () {
                            }
                        );
                    }
                );
            }
        );
    }

    // if it is 12 AM at night play the sound of the previous day (lasts for 360 seconds (6 minutes))
    if (hour == "00" && minutes == "00") {
    }
}

function hourlyChimeSpecificDate(submittedTimeStamp) {
    console.log("Play user set date ending song");

    // reset all the index and list
    resetWholdDayData();
    // userRequestPlayOn = false;

    var queryStartTime = submittedTimeStamp / 1000 + 46800;    // starting at EST 8:00
    var queryEndTime = submittedTimeStamp / 1000 + 104340;     // ending at EST 23:59:59

    // // GET the data in query
    getWholeDayData(queryStartTime, queryEndTime).then(
        function () {
            sortWholeDayDaokiVal().then(
                function () {
                    convertWholeDayToNote().then(
                    );
                }
            );
        }
    );
}


// c d e f g a b c d e f g a b c (8 or 15)
/* STRUCTRUE */
// get the data from firebase
// count how many are in the list (to equalize the song length)
// distribute time according to it (to equalize the song length)

/* ------------------------------------------------------------------------------------------ */
// GET API to fetch data with range from all CENTER, KITCHEN, CODING LAB
// for HOURLY CHIME
async function getAllData(start, end) {
    const responseCenter = await fetch(firebaseLink + "/api/read/centerdecibel/range/" + start + "/" + end);
    const rawCenter = await responseCenter.json();
    centerData = await rawCenter;    // push the raw data to data list

    const responseKitchen = await fetch(firebaseLink + "/api/read/kitchendecibel/range/" + start + "/" + end);
    const rawKitchen = await responseKitchen.json();
    kitchenData = await rawKitchen;    // push the raw data to data list

    const responseCodingLab = await fetch(firebaseLink + "/api/read/codinglabdecibel/range/" + start + "/" + end);
    const rawCodingLab = await responseCodingLab.json();
    codingLabData = await rawCodingLab;    // push the raw data to data list

    console.log("store data between two timestamp to centerData");
    // console.log(centerData);
    // console.log(kitchenData);
    // console.log(codingLabData);
    return "store data between two timestamp to each of the list";
}

// for CLOSING SONG
async function getWholeDayData(start, end) {
    const responseCenter = await fetch(firebaseLink + "/api/read/centerdecibel/range/" + start + "/" + end);
    const rawCenter = await responseCenter.json();
    wdCenterData = await rawCenter;    // push the raw data to data list

    const responseKitchen = await fetch(firebaseLink + "/api/read/kitchendecibel/range/" + start + "/" + end);
    const rawKitchen = await responseKitchen.json();
    wdKitchenData = await rawKitchen;    // push the raw data to data list

    const responseCodingLab = await fetch(firebaseLink + "/api/read/codinglabdecibel/range/" + start + "/" + end);
    const rawCodingLab = await responseCodingLab.json();
    wdCodingLabData = await rawCodingLab;    // push the raw data to data list

    console.log("store data between two timestamp to centerData");
    console.log(wdCenterData);
    console.log(wdKitchenData);
    console.log(wdCodingLabData);
    return "store data between two timestamp to each of the list";
}

// GET API to fetch data with range from CENTER
async function getCenterData(start, end) {
    const response = await fetch(firebaseLink + "/api/read/centerdecibel/range/" + start + "/" + end);
    const data = await response.json();

    // push the data to centerData
    centerData = await data;

    console.log("store data between two timestamp to centerData");
    console.log(centerData);
    return "store data between two timestamp to centerData";
}

// GET API to fetch data with range from KITCHEN
async function getKitchenData(start, end) {
    const response = await fetch(firebaseLink + "/api/read/kitchendecibel/range/" + start + "/" + end);
    // const response = await fetch("")
    const data = await response.json();
    const stringData = JSON.stringify(data)
    // log.innerHTML = stringData;
    console.log(data);
}

// GET API to fetch data with range from CODING LAB
async function getCodingLabData(start, end) {
    const response = await fetch(firebaseLink + "/api/read/codinglabdecibel/range/" + start + "/" + end);
    // const response = await fetch("")
    const data = await response.json();
    const stringData = JSON.stringify(data)
    // log.innerHTML = stringData;
    console.log(data);
}

/* ------------------------------------------------------------------------------------------ */
// for HOURLY CHIME
async function sortAllDaokiVal() {
    centerData.forEach(sortCenterDaokiValLoop);
    kitchenData.forEach(sortKitchenDaokiValLoop);
    codingLabData.forEach(sortCodingLabDaokiValLoop);
    // console.log(daokiCenter);
    // console.log(daokiKitchen);
    // console.log(daokiCodingLab);
    return "isolated daoki value from all data";
}

async function sortCenterDaokiVal() {
    centerData.forEach(sortCenterDaokiValLoop);
    console.log(daokiCenter);
    return "isolated daoki value from centerData";
}

async function sortCenterDaokiValLoop() {
    daokiCenter.push((centerData[centerDataIndex].daoki));
    centerDataIndex++;
    return "visted all the loops";
}

async function sortKitchenDaokiVal() {
    kitchenData.forEach(sortKitchenDaokiValLoop);
    console.log(daokiKitchen);
    return "isolated daoki value from kitchenData";
}

async function sortKitchenDaokiValLoop() {
    daokiKitchen.push((kitchenData[kitchenDataIndex].daoki));
    kitchenDataIndex++;
    return "visted all the loops";
}

async function sortCodingLabDaokiVal() {
    codingLabData.forEach(sortCodingLabDaokiValLoop);
    console.log(daokiCodingLab);
    return "isolated daoki value from codingLabData";
}

async function sortCodingLabDaokiValLoop() {
    daokiCodingLab.push((codingLabData[codingLabDataIndex].daoki));
    codingLabDataIndex++;
    return "visted all the loops";
}

// Convert to note
async function convertToNote() {
    daokiCenter.forEach(convertCenterToNoteLoop);
    daokiKitchen.forEach(convertKitchenToNoteLoop);
    daokiCodingLab.forEach(convertCodingLabToNoteLoop);
    console.log(centerNotes);
    console.log(kitchenNotes);
    console.log(codingLabNotes);
    // playOn = true;
    return "converted all to note"
}

async function convertCenterToNoteLoop() {
    if (daokiCenter[i] >= 20 && daokiCenter[i] < 40) centerNotes[i] = "C4"
    else if (daokiCenter[i] >= 40 && daokiCenter[i] < 60) centerNotes[i] = "D4"
    else if (daokiCenter[i] >= 60 && daokiCenter[i] < 80) centerNotes[i] = "E4"
    else if (daokiCenter[i] >= 80 && daokiCenter[i] < 100) centerNotes[i] = "F4"
    else if (daokiCenter[i] >= 100 && daokiCenter[i] < 120) centerNotes[i] = "G4"
    else if (daokiCenter[i] >= 120 && daokiCenter[i] < 140) centerNotes[i] = "A4"
    else if (daokiCenter[i] >= 140 && daokiCenter[i] < 160) centerNotes[i] = "B4"
    else if (daokiCenter[i] >= 160 && daokiCenter[i] < 180) centerNotes[i] = "C5"
    else if (daokiCenter[i] >= 180 && daokiCenter[i] < 200) centerNotes[i] = "D5"
    else if (daokiCenter[i] >= 200 && daokiCenter[i] < 220) centerNotes[i] = "E5"
    else if (daokiCenter[i] >= 220 && daokiCenter[i] < 240) centerNotes[i] = "F5"
    else if (daokiCenter[i] >= 240 && daokiCenter[i] < 260) centerNotes[i] = "G5"
    else if (daokiCenter[i] >= 260 && daokiCenter[i] < 280) centerNotes[i] = "A5"
    else if (daokiCenter[i] >= 280 && daokiCenter[i] < 300) centerNotes[i] = "B5"
    else centerNotes[i] = "C6";
    i++;
    return "visted all the loops";
}

async function convertKitchenToNoteLoop() {
    if (daokiKitchen[j] >= 20 && daokiKitchen[j] < 40) kitchenNotes[j] = "C4"
    else if (daokiKitchen[j] >= 40 && daokiKitchen[j] < 60) kitchenNotes[j] = "D4"
    else if (daokiKitchen[j] >= 60 && daokiKitchen[j] < 80) kitchenNotes[j] = "E4"
    else if (daokiKitchen[j] >= 80 && daokiKitchen[j] < 100) kitchenNotes[j] = "F4"
    else if (daokiKitchen[j] >= 100 && daokiKitchen[j] < 120) kitchenNotes[j] = "G4"
    else if (daokiKitchen[j] >= 120 && daokiKitchen[j] < 140) kitchenNotes[j] = "A4"
    else if (daokiKitchen[j] >= 140 && daokiKitchen[j] < 160) kitchenNotes[j] = "B4"
    else if (daokiKitchen[j] >= 160 && daokiKitchen[j] < 180) kitchenNotes[j] = "C5"
    else if (daokiKitchen[j] >= 180 && daokiKitchen[j] < 200) kitchenNotes[j] = "D5"
    else if (daokiKitchen[j] >= 200 && daokiKitchen[j] < 220) kitchenNotes[j] = "E5"
    else if (daokiKitchen[j] >= 220 && daokiKitchen[j] < 240) kitchenNotes[j] = "F5"
    else if (daokiKitchen[j] >= 240 && daokiKitchen[j] < 260) kitchenNotes[j] = "G5"
    else if (daokiKitchen[j] >= 260 && daokiKitchen[j] < 280) kitchenNotes[j] = "A5"
    else if (daokiKitchen[j] >= 280 && daokiKitchen[j] < 300) kitchenNotes[j] = "B5"
    else kitchenNotes[j] = "C6";
    j++;
    return "visted all the loops";
}

async function convertCodingLabToNoteLoop() {
    if (daokiCodingLab[k] >= 20 && daokiCodingLab[k] < 40) codingLabNotes[k] = "C4"
    else if (daokiCodingLab[k] >= 40 && daokiCodingLab[k] < 60) codingLabNotes[k] = "D4"
    else if (daokiCodingLab[k] >= 60 && daokiCodingLab[k] < 80) codingLabNotes[k] = "E4"
    else if (daokiCodingLab[k] >= 80 && daokiCodingLab[k] < 100) codingLabNotes[k] = "F4"
    else if (daokiCodingLab[k] >= 100 && daokiCodingLab[k] < 120) codingLabNotes[k] = "G4"
    else if (daokiCodingLab[k] >= 120 && daokiCodingLab[k] < 140) codingLabNotes[k] = "A4"
    else if (daokiCodingLab[k] >= 140 && daokiCodingLab[k] < 160) codingLabNotes[k] = "B4"
    else if (daokiCodingLab[k] >= 160 && daokiCodingLab[k] < 180) codingLabNotes[k] = "C5"
    else if (daokiCodingLab[k] >= 180 && daokiCodingLab[k] < 200) codingLabNotes[k] = "D5"
    else if (daokiCodingLab[k] >= 200 && daokiCodingLab[k] < 220) codingLabNotes[k] = "E5"
    else if (daokiCodingLab[k] >= 220 && daokiCodingLab[k] < 240) codingLabNotes[k] = "F5"
    else if (daokiCodingLab[k] >= 240 && daokiCodingLab[k] < 260) codingLabNotes[k] = "G5"
    else if (daokiCodingLab[k] >= 260 && daokiCodingLab[k] < 280) codingLabNotes[k] = "A5"
    else if (daokiCodingLab[k] >= 280 && daokiCodingLab[k] < 300) codingLabNotes[k] = "B5"
    else daokiCodingLab[k] = "C6";
    k++;
    return "visted all the loops";
}

/* ------------------------------------------ */
// for CLOSING SONG
async function sortWholeDayDaokiVal() {
    console.log("sort Whole Day Daoki Val")
    wdCenterData.forEach(sortWholeDayCenterDaokiValLoop);
    wdKitchenData.forEach(sortWholeDayKitchenDaokiValLoop);
    wdCodingLabData.forEach(sortWholeDayCodingLabDaokiValLoop);
    // console.log(wdDaokiCenter);
    // console.log(wdDaokiKitchen);
    // console.log(wdDaokiCodingLab);
    return "isolated daoki value from all data";
}

async function sortWholeDayCenterDaokiValLoop() {
    wdDaokiCenter.push((wdCenterData[wdCenterDataIndex].daoki));
    wdCenterDataIndex++;
    return "visted all the loops";
}

async function sortWholeDayKitchenDaokiValLoop() {
    wdDaokiKitchen.push((wdKitchenData[wdKitchenDataIndex].daoki));
    wdKitchenDataIndex++;
    return "visted all the loops";
}

async function sortWholeDayCodingLabDaokiValLoop() {
    wdDaokiCodingLab.push((wdCodingLabData[wdCodingLabDataIndex].daoki));
    wdCodingLabDataIndex++;
    return "visted all the loops";
}

async function convertWholeDayToNote() {
    wdDaokiCenter.forEach(convertWholdDayCenterToNoteLoop);
    // wdDaokiKitchen.forEach(convertWholdDayKitchenToNoteLoop);
    // wdDaokiCodingLab.forEach(convertWholdDayCodingLabToNoteLoop);
    console.log(wdCenterNotes);
    // console.log(kitchenNotes);
    // console.log(codingLabNotes);
    return "converted all to note"
}

async function convertWholdDayCenterToNoteLoop() {
    if (wdDaokiCenter[wdI] >= 20 && wdDaokiCenter[wdI] < 40) wdCenterNotes[wdI] = "C4"
    else if (wdDaokiCenter[wdI] >= 40 && wdDaokiCenter[wdI] < 60) wdCenterNotes[wdI] = "D4"
    else if (wdDaokiCenter[wdI] >= 60 && wdDaokiCenter[wdI] < 80) wdCenterNotes[wdI] = "E4"
    else if (wdDaokiCenter[wdI] >= 80 && wdDaokiCenter[wdI] < 100) wdCenterNotes[wdI] = "F4"
    else if (wdDaokiCenter[wdI] >= 100 && wdDaokiCenter[wdI] < 120) wdCenterNotes[wdI] = "G4"
    else if (wdDaokiCenter[wdI] >= 120 && wdDaokiCenter[wdI] < 140) wdCenterNotes[wdI] = "A4"
    else if (wdDaokiCenter[wdI] >= 140 && wdDaokiCenter[wdI] < 160) wdCenterNotes[wdI] = "B4"
    else if (wdDaokiCenter[wdI] >= 160 && wdDaokiCenter[wdI] < 180) wdCenterNotes[wdI] = "C5"
    else if (wdDaokiCenter[wdI] >= 180 && wdDaokiCenter[wdI] < 200) wdCenterNotes[wdI] = "D5"
    else if (wdDaokiCenter[wdI] >= 200 && wdDaokiCenter[wdI] < 220) wdCenterNotes[wdI] = "E5"
    else if (wdDaokiCenter[wdI] >= 220 && wdDaokiCenter[wdI] < 240) wdCenterNotes[wdI] = "F5"
    else if (wdDaokiCenter[wdI] >= 240 && wdDaokiCenter[wdI] < 260) wdCenterNotes[wdI] = "G5"
    else if (wdDaokiCenter[wdI] >= 260 && wdDaokiCenter[wdI] < 280) wdCenterNotes[wdI] = "A5"
    else if (wdDaokiCenter[wdI] >= 280 && wdDaokiCenter[wdI] < 300) wdCenterNotes[wdI] = "B5"
    else wdCenterNotes[wdI] = "C6";
    wdI++;
    return "visted all the loops";
}

async function convertWholdDayKitchenToNoteLoop() {
    if (daokiKitchen[j] >= 20 && daokiKitchen[j] < 40) kitchenNotes[j] = "C4"
    else if (daokiKitchen[j] >= 40 && daokiKitchen[j] < 60) kitchenNotes[j] = "D4"
    else if (daokiKitchen[j] >= 60 && daokiKitchen[j] < 80) kitchenNotes[j] = "E4"
    else if (daokiKitchen[j] >= 80 && daokiKitchen[j] < 100) kitchenNotes[j] = "F4"
    else if (daokiKitchen[j] >= 100 && daokiKitchen[j] < 120) kitchenNotes[j] = "G4"
    else if (daokiKitchen[j] >= 120 && daokiKitchen[j] < 140) kitchenNotes[j] = "A4"
    else if (daokiKitchen[j] >= 140 && daokiKitchen[j] < 160) kitchenNotes[j] = "B4"
    else if (daokiKitchen[j] >= 160 && daokiKitchen[j] < 180) kitchenNotes[j] = "C5"
    else if (daokiKitchen[j] >= 180 && daokiKitchen[j] < 200) kitchenNotes[j] = "D5"
    else if (daokiKitchen[j] >= 200 && daokiKitchen[j] < 220) kitchenNotes[j] = "E5"
    else if (daokiKitchen[j] >= 220 && daokiKitchen[j] < 240) kitchenNotes[j] = "F5"
    else if (daokiKitchen[j] >= 240 && daokiKitchen[j] < 260) kitchenNotes[j] = "G5"
    else if (daokiKitchen[j] >= 260 && daokiKitchen[j] < 280) kitchenNotes[j] = "A5"
    else if (daokiKitchen[j] >= 280 && daokiKitchen[j] < 300) kitchenNotes[j] = "B5"
    else kitchenNotes[j] = "C6";
    j++;
    return "visted all the loops";
}

async function convertWholdDayCodingLabToNoteLoop() {
    if (daokiCodingLab[k] >= 20 && daokiCodingLab[k] < 40) codingLabNotes[k] = "C4"
    else if (daokiCodingLab[k] >= 40 && daokiCodingLab[k] < 60) codingLabNotes[k] = "D4"
    else if (daokiCodingLab[k] >= 60 && daokiCodingLab[k] < 80) codingLabNotes[k] = "E4"
    else if (daokiCodingLab[k] >= 80 && daokiCodingLab[k] < 100) codingLabNotes[k] = "F4"
    else if (daokiCodingLab[k] >= 100 && daokiCodingLab[k] < 120) codingLabNotes[k] = "G4"
    else if (daokiCodingLab[k] >= 120 && daokiCodingLab[k] < 140) codingLabNotes[k] = "A4"
    else if (daokiCodingLab[k] >= 140 && daokiCodingLab[k] < 160) codingLabNotes[k] = "B4"
    else if (daokiCodingLab[k] >= 160 && daokiCodingLab[k] < 180) codingLabNotes[k] = "C5"
    else if (daokiCodingLab[k] >= 180 && daokiCodingLab[k] < 200) codingLabNotes[k] = "D5"
    else if (daokiCodingLab[k] >= 200 && daokiCodingLab[k] < 220) codingLabNotes[k] = "E5"
    else if (daokiCodingLab[k] >= 220 && daokiCodingLab[k] < 240) codingLabNotes[k] = "F5"
    else if (daokiCodingLab[k] >= 240 && daokiCodingLab[k] < 260) codingLabNotes[k] = "G5"
    else if (daokiCodingLab[k] >= 260 && daokiCodingLab[k] < 280) codingLabNotes[k] = "A5"
    else if (daokiCodingLab[k] >= 280 && daokiCodingLab[k] < 300) codingLabNotes[k] = "B5"
    else daokiCodingLab[k] = "C6";
    k++;
    return "visted all the loops";
}

//----------
function resetData() {
    index = 0;

    // array storing JSON with different values
    centerData = [];
    kitchenData = [];
    codingLabData = [];

    centerDataIndex = 0;
    kitchenDataIndex = 0;
    codingLabDataIndex = 0;

    // array storing only daoki(sound sensor value) - output: number
    daokiCenter = [];
    daokiKitchen = [];
    daokiCodingLab = [];

    // note array (Ex. ["c4", "e4"])
    centerNotes = [];
    kitchenNotes = [];
    codingLabNotes = [];

    // index tracking note array
    i = 0;
    j = 0;
    k = 0;

    Tone.Transport.start();
    root = 0;
    scale = major;
    pos = 0;
    octave = 2;
}

function resetWholdDayData() {
    wdIndex = 0;

    // array storing JSON with different values
    wdCenterData = [];
    wdKitchenData = [];
    wdCodingLabData = [];

    wdCenterDataIndex = 0;
    wdKitchenDataIndex = 0;
    wdCodingLabDataIndex = 0;

    // array storing only daoki(sound sensor value) - output: number
    wdDaokiCenter = [];
    wdDaokiKitchen = [];
    wdDaokiCodingLab = [];

    // note array (Ex. ["c4", "e4"])
    wdCenterNotes = [];
    wdKitchenNotes = [];
    wdCodingLabNotes = [];

    // index tracking note array
    wdI = 0;
    wdJ = 0;
    wdK = 0;

    Tone.Transport.start();
    wdRoot = 0;
    scale = major;
    wdPos = 0;
    octave = 2;
}

Tone.Transport.bpm.value = 120;

// ------- working tone.js code
// have to figure out why there are less number of notes now
// the point it, give some time for centerNotes array to fill up, 
// and if so, play the note 

function playSounds() {
    Tone.start();
    if (Tone.Transport.state == "started") {
        Tone.Transport.pause();
    } else {
        Tone.Transport.start();
    }
}

let duration = '8n';
let durations = ["16n", "8n", "4n"];

function playHourlyNote(time) {
    // console.log("center notes playing");
    // // let dur = "8n";
    // let dur;
    // dur = durations[Math.floor(Math.random() * durations.length)];
    // // dur = duration;

    // let dur4n = "4n";
    // let dur8n = "8n";

    // let pitch = root + scale[centerNotes[pos]] + 18 * octave;

    // let noteObject = Tone.Frequency(pitch, "midi");
    // // console.log(pos);
    // // synth.triggerAttackRelease(noteObject, dur);
    // // synth.set({ detune: -1200 });
    // synth.triggerAttackRelease(centerNotes[pos], dur);
    // synth.triggerAttackRelease(kitchenNotes[pos], dur);
    // synth.triggerAttackRelease(codingLabNotes[pos], dur);

    // Tone.Transport.scheduleOnce(playHourlyNote, "+" + dur);
    // pos++;

    // if (pos === centerNotes.length) {
    //     Tone.Transport.pause(); pos = 0;
    //     // playOn = false;
    // }
}

function playClosingSong(time) {
    console.log("center notes playing");
    // let dur = "8n";
    let dur;
    dur = durations[Math.floor(Math.random() * durations.length)];
    // dur = duration;

    let dur4n = "4n";
    let dur8n = "8n";

    let pitch = wdRoot + scale[wdCenterNotes[wdPos]] + 18 * octave;

    let noteObject = Tone.Frequency(pitch, "midi");
    // console.log(wdPos);
    // synth.triggerAttackRelease(noteObject, dur);
    // synth.set({ detune: -1200 });
    synth.triggerAttackRelease(wdCenterNotes[wdPos], dur);

    Tone.Transport.scheduleOnce(playClosingSong, "+" + dur);
    wdPos++;

    if (wdPos === wdCenterNotes.length) {
        Tone.Transport.pause(); wdPos = 0;
        // playOn = false;
    }
}

/* ------------------------------------------------------------------------------------------ */



