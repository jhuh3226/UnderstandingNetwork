const express = require("express");
const fetch = require('node-fetch');
const server = express();

// serve static files from /public
// / is a root directory
server.use("/", express.static("public"));
const firebaseLink = "https://us-central1-understandingnetwork-90aa1.cloudfunctions.net/app"

// mqtt server
// mqtt client ---------------------------------------------------------------------------------------------
// subscribe to MQTT channels
// when data arrives, send to FireBase

// include the MQTT library:
const mqtt = require("mqtt");
const { response } = require("express");
// the broker you plan to connect to.
// transport options:
// 'mqtt', 'mqtts', 'tcp', 'tls', 'ws', or 'wss':
const broker = "mqtts://public.cloud.shiftr.io";
// client options:
const options = {
    // clientId: "jRead",
    clientId: "nodeClient",
    username: "public",
    password: "public"
};
// topic and message payload:
// let myTopic = "jReadings";
let myTopic = "light-readings";
let latestReading = {};

// settings for the HTTP request to the storage server:
let httpOptions = {
    method: "POST",
    headers: {
        "Content-type": "application/json"
    }
    // google apps script expects you to redirect AND change to GET
    // from POST. That's hard to trap for, but you don't need the
    // redirect response if you get a 302. You can just ignore it
    // disableRedirects: true
};

// connect handler:
function setupClient() {
    // read all the subtopics:
    client.subscribe(myTopic);
    // set a handler for when new messages arrive:
    client.on("message", readMqttMessage);
}

// new message handler:
function readMqttMessage(topic, message) {
    // message is a Buffer, so convert to a string:
    let msgString = message.toString();
    // get rid of double quotes in any of the strings:
    // msgString = msgString.replace(/['"]+/g, "");
    const obj = JSON.parse(msgString);
    // console.log(obj);

    let uidData = obj.uid;
    let luxData = obj.lux;
    let ctData = obj.ct;
    let timeStampData = obj.timeStamp;

    // NW_corner
    // if(uidData == '3c71bf882b40') console.log(`NW_corner-3c71bf882b40 Lux: ${luxData}`);
    // SW_corner
    // else if(uidData == '2462abba438c') console.log(`SW_corner-2462abba438c Lux: ${luxData}`);
    // NE_corner 
    // else if(uidData == '2462abb1e310') console.log(`NE_corner-2462abb1e310 Lux: ${luxData}`);

    // console.log(`ct: ${msg.ct}`);
    // send it:
    sendToFirestore(uidData, luxData, ctData, timeStampData);
    // sendToFirestore(500, 500, 500);
}

function storageResponse(error, headings, body) {
    // print the responses from the server, if you need them:
    // console.log(headings);
    // console.log(body.toString());
}

let client = mqtt.connect(broker, options);
client.on("connect", setupClient);

// whenever there is new readings from the broker, do POST API request to firestore
function sendToFirestore(uid, lux, ct, time) {
    console.log(`Sending uid: ${uid}, lux: ${lux}, ct ${ct}, time ${time}`);

    /*
    fetch(firebaseLink + "/api/create/", {

        // Adding method type
        method: "POST",

        // Adding body or contents to send
        body: JSON.stringify({
            "id": 6,
            "ct": tempCt,
            "lux": tempLux,
            "time": tempTime
        }),

        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    */

    fetch(firebaseLink + "/api/create", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'id': uid,
            'lux': lux,
            'ct': ct,
            'time': time
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            // Do some stuff ...
        })
        // .catch((err) => console.log(err));
}

const listener = server.listen(process.env.PORT || 8080, () => {
    console.log("Your app is listening on port " + listener.address().port);
});