console.log("Page loaded, hello");

// fetch reference
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

const btnFetch = document.getElementById("btnFetch");
const log = document.getElementById("log");
// let centerData, kitchenData, codingLabData = []; 
// let daokiCenter, daokiKitchen, daokiCodingLab = [];

let centerData = null;
let daokiCenter = [];
let soundCenter, soundKitchen, soundCodingLab = [];
// convert daoki decibel number to note
let soundData = [];

let centerDataIndex = 0;
let index = 0;	
let i = 0;
let timeIncre = 0;

const firebaseLink = "https://us-central1-understandingnetwork-90aa1.cloudfunctions.net/app"

btnFetch.addEventListener('click', () => {
    console.log(centerData.length);
    console.log(centerData);
    console.log(daokiCenter);
    log.innerHTML = daokiCenter;
    // getCenterData();
});

// on clicking the ___btn, start the tone.js
function startAudio() {
    Tone.start();
    console.log("Songs can now be played");
}

setInterval(function () {
    //code goes here that will be run every 1 seconds.    
    realTime();
    hourlyChime();

    // if(sortCenterDaokiValOn) sortCenterDaokiVal();
}, 10);

/* ------------------------------------------------------------------------------------------ */
var date, yer, month, day, hour, minuites, seconds;

// (move to server.js)
// get the realtime
function realTime() {
    date = new Date();
    year = date.getFullYear();
    month = ("0" + (date.getMonth() + 1)).substr(-2);
    day = ("0" + date.getDate()).substr(-2);
    hour = ("0" + date.getHours()).substr(-2);
    minutes = ("0" + date.getMinutes()).substr(-2);
    seconds = ("0" + date.getSeconds()).substr(-2);
    // console.log(`${year}-${month}-${day} ${hour}:${minutes}:${seconds}`);
    toTimestamp(year, month, day, hour, minutes, seconds);

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
    // && seconds == "00"
    if (minutes == "39" && seconds == "00" && hour != "00") {
        console.log("It is sharp hour");
        // from current timestamp - 3600 (hour ago) to current timestamp - 60 (one minute ago)
        var queryStartTime = parseInt(toTimestamp(year, month, day, hour, minutes, "00")) - 3600;
        var queryEndTime = parseInt(toTimestamp(year, month, day, hour, minutes, "00")) - 60;
        console.log(`${queryStartTime}, ${queryEndTime}`);

        // GET the data in query
        getCenterData(queryStartTime, queryEndTime);

        // console.log(centerData);

        // do the musical transformation
    }

    // if it is 12 AM at night play the sound of the previous day (lasts for 360 seconds (6 minutes))
    if (hour == "00" && minutes == "00") {

    }
}

// c d e f g a b c d e f g a b c (8 or 15)
/* STRUCTRUE */
// get the data from firebase
// count how many are in the list (to equalize the song length)
// distribute time according to it (to equalize the song length)

/* ------------------------------------------------------------------------------------------ */
// GET API to fetch data with range from CENTER
async function getCenterData(start, end) {
    const response = await fetch(firebaseLink + "/api/read/centerdecibel/range/" + start + "/" + end);
    const data = await response.json();

    // push the data to centerData
    centerData = await data;

    centerData.forEach(sortCenterDaokiVal);

    daokiCenter.forEach(convertToNote);

    soundData.forEach(playNote);

    // const stringData = JSON.stringify(data);
    // console.log(data);

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
async function sortCenterDaokiVal() {
    daokiCenter.push((centerData[centerDataIndex].daoki));
    centerDataIndex++;
    console.log(centerDataIndex);
}

 function convertToNote() {
    console.log("doing")
    if (daokiCenter[i] >= 20 && daokiCenter[i] < 40) soundData[i] = "C4"
    else if (daokiCenter[i] >= 40 && daokiCenter[i] < 60) soundData[i] = "D4"
    else if (daokiCenter[i] >= 60 && daokiCenter[i] < 80) soundData[i] = "E4"
    else if (daokiCenter[i] >= 80 && daokiCenter[i] < 100) soundData[i] = "F4"
    else if (daokiCenter[i] >= 100 && daokiCenter[i] < 120) soundData[i] = "G4"
    else if (daokiCenter[i] >= 120 && daokiCenter[i] < 140) soundData[i] = "A4"
    else if (daokiCenter[i] >= 140 && daokiCenter[i] < 160) soundData[i] = "B4"
    else if (daokiCenter[i] >= 160 && daokiCenter[i] < 180) soundData[i] = "C5"
    else if (daokiCenter[i] >= 180 && daokiCenter[i] < 200) soundData[i] = "D5"
    else if (daokiCenter[i] >= 200 && daokiCenter[i] < 220) soundData[i] = "E5"
    else if (daokiCenter[i] >= 220 && daokiCenter[i] < 240) soundData[i] = "F5"
    else if (daokiCenter[i] >= 240 && daokiCenter[i] < 260) soundData[i] = "G5"
    else if (daokiCenter[i] >= 260 && daokiCenter[i] < 280) soundData[i] = "A5"
    else if (daokiCenter[i] >= 280 && daokiCenter[i] < 300) soundData[i] = "B5"
    else soundData[i] = "C6";
    soundData.push("C4");
    i++;
}

//create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth().toDestination();

//play a middle 'C' for the duration of an 8th note
const now = Tone.now()

 function playNote() {
    synth.triggerAttackRelease(soundData[index], "8n", now + timeIncre);
    timeIncre += 0.25;
    index++;
}