// const { Tone } = require("tone/build/esm/core/Tone");

console.log("Page loaded, hello");

// fetch reference
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

const btnFetch = document.getElementById("btnFetch");
const log = document.getElementById("log");
// let centerData, kitchenData, codingLabData = []; 
// let daokiCenter, daokiKitchen, daokiCodingLab = [];

let start = null;
let end = null;

let centerData = [];
let daokiCenter = [];
let soundCenter, soundKitchen, soundCodingLab = [];
// convert daoki decibel number to note
let soundData = [];
const notes = [];

let centerDataIndex = 0;
let index = 0;
let i = 0;
let timeIncre = 0;
var indexNotes = 0;

let playOn = false;
let stillPlaying = true;
// let hourlyChimeOn = false;

let major = [0, 2, 4, 5, 7, 9, 11, 12];
let soundArray = [6, 6, 2, 6, 6, 3, 3, 4, 4, 1, 2, 2, 4, 4, 4, 1, 3, 4, 7, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 2, 2, 2, 3, 2, 0, 2, 4, 0, 2, 4, 7, 4, 2, 0, 2, 4, 1, 3, 5, 7, 7, 6, 4, 3, 2, 5, 2, 7, 6, 7, 6, 5, 4, 2, 1, 7, 0, 0, 2, 3, 3, 4, 3, 3, 2, 0, 0, 2, 2, 3, 4, 4, 5, 7, 0, 0, 1, 2, 0, 0, 3, 2, 2, 4, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 2, 1, 0, 0, 0, 1, 2, 1, 2, 1, 7, 6, 2, 1, 4, 3, 1, 2, 6, 7, 0, 7, 6, 2, 1, 0, 4, 4, 5, 5, 3, 3, 4, 4, 3, 3, 3, 3, 1, 1, 5, 5, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0, 1, 3, 1, 1, 4, 4, 6, 6, 3, 3, 2, 2, 4, 4, 4, 4, 6, 6];
let root = 0;
let scale = major;
let pos = 0;
let octave = 2;

//create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth().toDestination();

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

let isPlaying = false

// on clicking the ___btn, start the tone.js
function startAudio() {
    Tone.start();
    console.log("Songs can now be played");
    isPlaying = true
}

function stopAudio() {
    isPlaying = false
}

// Second Mark
let counterTime = 0
setInterval(() => {
    if (counterTime % 60 === 0) {
        // might have to put if there is new out put
        
        // if (playOn && !stillPlaying) {
        console.log("m") // sound to play (once)
        playSounds();
        // stillPlaying = true;
        // }
    }
    // else if (counterTime % 1 === 0) {
    //     console.log("s") // sound to play (once)
    // }
    counterTime += 1
}, 1000)


setInterval(function () {
    //code goes here that will be run every 1 seconds.    
    realTime();
    // if (playOn) playNote();
    // setTimeout(playNote(), 15000)
    // console.log(soundData);
}, 1000);


setInterval(function () {
    hourlyChime();
}, 1000);


// setTimeout(playNote(), 15000);

/* ------------------------------------------------------------------------------------------ */
var date, yer, month, day, hour, minuites, seconds, millis = 0;

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
    // minutes =- "00"

    if ((seconds == "00" || seconds == "30") && hour != "00") {
        console.log("It is sharp hour");
        // reset all the index and list
        resetData();

        // from current timestamp - 3600 (hour ago) to current timestamp - 60 (one minute ago)
        var queryStartTime = parseInt(toTimestamp(year, month, day, hour, minutes, "00")) - 3600;
        var queryEndTime = parseInt(toTimestamp(year, month, day, hour, minutes, "00")) - 60;
        console.log(`${queryStartTime}, ${queryEndTime}`);

        // GET the data in query
        getCenterData(queryStartTime, queryEndTime).then(
            function () {
                sortCenterDaokiVal().then(
                    function () {
                        convertToNote().then(
                            function () {
                                // playOn = true;
                                // stillPlaying = false;
                                // playSounds();
                                // startToneJS();
                                // scheduleToneJS().then(
                                // );
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
async function sortCenterDaokiVal() {
    centerData.forEach(sortCenterDaokiValLoop);
    console.log(daokiCenter);
    return "sortedCenterDaokiVal";
}

async function sortCenterDaokiValLoop() {
    daokiCenter.push((centerData[centerDataIndex].daoki));
    centerDataIndex++;
    return "vistedAllTheLoops";
}

async function convertToNote() {
    daokiCenter.forEach(convertToNoteLoop);
    console.log(soundData);
    // playOn = true;
    return "convertedToNote"
}

async function convertToNoteLoop() {
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
    i++;
    return "visted all the loops";
}

// async function startPlay() {
//     playOn = true;
//     console.log("play the note");
//     return "play the note"
// }

function playNote() {
    // if (playOn) {
    soundData.forEach(playNoteLoop);
    console.log("finished playing")
    // }
    // return "finished playing"
}

function playNoteLoop() {
    synth.triggerAttackRelease(soundData[index], "8n", now + timeIncre);

    timeIncre += 0.25;
    index++;
    // console.log(index);
    // if (index >= soundData.length) playOn = false;
}

function resetData() {
    centerDataIndex = 0;
    i = 0;
    index = 0;
    indexNotes = 0;
    centerData = [];
    daokiCenter = [];
    soundData = [];
    Tone.Transport.start();
    root = 0;
    scale = major;
    pos = 0;
    octave = 2;
}

const notesTest = ['C4', 'C4', 'C4', 'C4', 'C4', 'C4', 'C4', 'E4', 'C4', 'D4', 'C4', 'C4'];
// const notes = soundData;

Tone.Transport.bpm.value = 120;

async function scheduleToneJS() {
    Tone.Transport.scheduleRepeat(time => {
        repeat(time);
    }, '8n');
    return "played all the songs";
}

function repeat(time) {
    let note = soundData[indexNotes];

    synth.triggerAttackRelease(note, '8n', time);
    indexNotes++;
    console.log(indexNotes);
    if (indexNotes >= soundData.length) Tone.Transport.stop();
}


// ------- working tone.js code
// have to figure out why there are less number of notes now
// the point it, give some time for soundData array to fill up, 
// and if so, play the note 
Tone.Transport.scheduleOnce(playNote, 0);

function playSounds() {
    Tone.start();
    if (Tone.Transport.state == "started") {
        Tone.Transport.pause();
    } else {
        Tone.Transport.start();
    }
}

function playNote(time) {
    let dur = "8n";
    let pitch = root + scale[soundData[pos]] + 18 * octave;

    let noteObject = Tone.Frequency(pitch, "midi");
    console.log(pos);
    // console.log(noteObject);
    // console.log(pitch);
    // console.log(root);
    // synth.triggerAttackRelease(noteObject, dur);
    synth.triggerAttackRelease(soundData[pos], dur);

    Tone.Transport.scheduleOnce(playNote, "+" + dur);
    pos++;

    if (pos === soundData.length) {
        Tone.Transport.pause(); pos = 0;
        // playOn = false;
    }
}

// function playTest() {
//     console.log("playing test song");
//     var synth = new Tone.Synth().toDestination();
//     synth.triggerAttackRelease("C4", "8n", now);
//     synth.triggerAttackRelease("E4", "8n", 0.25);
//     synth.triggerAttackRelease("C4", "8n", 0.5);
// }

// var sequence = new Tone.Sequence(playNote, ["E4", "C4", "F#4", ["A4", "Bb3"]]);

// var seq = new Tone.Sequence(function(time, note){
// 	console.log(note);
// //straight quater notes
// }, soundData[indexNotes], "8n");