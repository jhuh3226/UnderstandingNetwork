// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// firebase install command can be found here
// https://github.com/nicolehe/ITP-hello-computer-f21/tree/main/week4-dialogflow-fulfillment
// also firebase code help can be found here
// https://firebase.google.com/docs/reference/js/firestore_

// structure advise from Tom
// firebase client = express server
// when web client requests data,
// get it from fireBase
// send response to client

const functions = require("firebase-functions");

var admin = require("firebase-admin");
var serviceAccount = require("./permissions.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://understandingnetwork-90aa1-default-rtdb.firebaseio.com"
});

const express = require("express");
const app = express();

const db = admin.firestore();

const cors = require("cors");
app.use(cors({ origin: true }));

// Routes
app.get('/hello-world', (req, res) => {

    return res.status(200).send('Hi!!!!!!');
});

// POST (create)
app.post('/api/create', (req, res) => {
    (async () => {
        // telling express to access to a collection and add new id and data
        try {
            await db.collection('f008d1cb466c').doc('/' + req.body.id + '/')
                .create({
                    ct: 1000,
                    lux: 2000
                })

            return res.status(200).send('Data sent');
        }

        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();

});

// GET 
// When button pushed, get all the data from date __
// app.get('api/read')

// GET
app.get('/api/read/:id', (req, res) => {
    (async () => {
        // telling express to access to a collection and add new id and data
        try {
            const document = db.collection('f008d1cb466c').doc(req.params.id);
            let uid = await document.get();
            let response = uid.data();

            // log.innerHTML = response;

            return res.status(200).send(response);
        }

        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();

});

// get all the data

function getLatest(req, res) {
    // get what the client wants from the request
    // form it into a fireBase query
    // query fireBase
    // when the response comes in, respond to the web client
}

// mqtt client ---------------------------------------------------------------------------------------------
// subscribe to MQTT channels
// when data arrives, send to FireBase

// include the MQTT library:
const mqtt = require("mqtt");
// the broker you plan to connect to.
// transport options:
// 'mqtt', 'mqtts', 'tcp', 'tls', 'ws', or 'wss':
const broker = "mqtts://public.cloud.shiftr.io";
// client options:
const options = {
    clientId: "jRead",
    username: "public",
    password: "public"
};
// topic and message payload:
let myTopic = "jReadings";

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
    console.log(msgString);
    // send it:
}

function storageResponse(error, headings, body) {
    // print the responses from the server, if you need them:
    // console.log(headings);
    // console.log(body.toString());
}

let client = mqtt.connect(broker, options);
client.on("connect", setupClient);


// export the api to firebase cloud functions
exports.app = functions.https.onRequest(app);