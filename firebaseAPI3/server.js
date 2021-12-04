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
    clientId: "ITPcenter",
    // clientId: "nodeClient",
    username: "public",
    password: "public"
};
// topic and message payload:
let myTopic = "ITPcenterDecibel";
// let myTopic = "light-readings";

let directory = null;
let sentID = 0;
let NWcornerID = 0;
let NEcornerID = 0;
let SWcornerID = 0;
let centerDecibelTestID = 0;

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
    console.log(obj);

    let max4466Data = obj.max4466Value;
    let daokiData = obj.daokiValue;
    let timeStampData = obj.timeStamp;

    // let uidData = obj.uid;
    // let luxData = obj.lux;
    // let ctData = obj.ct;
    // let timeStampData = obj.timeStamp;
    // // let timeStampData = new Date(time);

    // NW_corner
    // if(uidData == '3c71bf882b40') console.log(`NW_corner-3c71bf882b40 Lux: ${luxData}`);
    // SW_corner
    // else if(uidData == '2462abba438c') console.log(`SW_corner-2462abba438c Lux: ${luxData}`);
    // NE_corner 
    // else if(uidData == '2462abb1e310') console.log(`NE_corner-2462abb1e310 Lux: ${luxData}`);

    // console.log(`ct: ${msg.ct}`);
    // send it:
    // if (obj.uid == '3c71bf882b40' || obj.uid == '2462abba438c' || obj.uid == '2462abb1e310') sendToFirestore(uidData, luxData, ctData, timeStampData);
    // sendToFirestore(max4466Data, daokiData, timeStampData);

    realTime();
}

function storageResponse(error, headings, body) {
    // print the responses from the server, if you need them:
    // console.log(headings);
    // console.log(body.toString());
}

let client = mqtt.connect(broker, options);
client.on("connect", setupClient);

function sendToFirestore(max4466Value, daokiValue, time) {
    console.log(`Sending max4466: ${max4466Value}, daoki: ${daokiValue}, time ${time}`);

        directory = 'centerdecibeltest';
        sentID = centerDecibelTestID;
        centerDecibelTestID++;

    fetch(firebaseLink + "/api/create/" + directory, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'id': sentID,
            'max4466': max4466Value,
            'daoki': daokiValue,
            'time': time
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            // Do some stuff ...
        })
        .catch((err) => console.log(err));
}

// whenever there is new readings from the broker, do POST API request to firestore
// function sendToFirestore(uid, lux, ct, time) {
//     console.log(`Sending uid: ${uid}, lux: ${lux}, ct ${ct}, time ${time}`);

//     // nw
//     if (uid == '3c71bf882b40') {
//         directory = 'nwcorner';
//         sentID = NWcornerID;
//         NWcornerID++;
//     }
//     // sw
//     else if (uid == '2462abba438c') {
//         directory = 'swcorner';
//         sentID = SWcornerID;
//         SWcornerID++;
//     }
//     // ne
//     else if (uid == '2462abb1e310') {
//         directory = 'necorner';
//         sentID = NEcornerID;
//         NEcornerID++;
//     }

//     fetch(firebaseLink + "/api/create/" + directory, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             'id': sentID,
//             'lux': lux,
//             'ct': ct,
//             'time': time
//         }),
//     })
//         .then((res) => res.json())
//         .then((data) => {
//             // Do some stuff ...
//         })
//         .catch((err) => console.log(err));
// }

12

function realTime() {
  var date = new Date();
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).substr(-2);
  var day = ("0" + date.getDate()).substr(-2);
  var hour = ("0" + date.getHours()).substr(-2);
  var minutes = ("0" + date.getMinutes()).substr(-2);
  var seconds = ("0" + date.getSeconds()).substr(-2);

  console.log(`${year}-${month}-${day} ${hour}:${minutes}:${seconds}`);

  return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
}

const listener = server.listen(process.env.PORT || 8080, () => {
    console.log("Your app is listening on port " + listener.address().port);
});