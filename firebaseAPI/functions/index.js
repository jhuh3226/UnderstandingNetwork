// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// mqtt client
// subscribe to MQTT channels
// when data arrives, send to FireBase

// include the MQTT library:
const mqtt = require("mqtt");

// MQTT broker details:
let broker = {
    hostname: 'public.cloud.shiftr.io',
    port: 443
};

// MQTT client:
let client;
// client credentials:
let creds = {
    clientID: 'htmlClient',
    userName: 'public',
    password: 'public'
}
// topic to subscribe to when you connect to the broker:
let topic = 'jReadings';
let localDiv, remoteDiv;

let msg = null;

function setup() {
    // Create an MQTT client:
    client = new Paho.MQTT.Client(broker.hostname, Number(broker.port), creds.clientID);
    // set callback handlers for the client:
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    // connect to the MQTT broker:
    client.connect(
        {
            onSuccess: onConnect,       // callback function for when you connect
            userName: creds.userName,   // username
            password: creds.password,   // password
            useSSL: true                // use SSL
        }
    );
    // add handles for the divs:
    localDiv = document.getElementById('local');
    remoteDiv = document.getElementById('remote');
}


// called when the client connects
function onConnect() {
    localDiv.innerHTML = 'client is connected to '
        + broker.hostname + '<br>and subscribed to '
        + topic;
    client.subscribe(topic);
}

// called when the client loses its connection
function onConnectionLost(response) {
    if (response.errorCode !== 0) {
        localDiv.innerHTML = 'Connection Lost:' + response.errorMessage;
    }
}

// called when a message arrives
function onMessageArrived(message) {
    // get the payload string and make it a JSON object:
    msg = JSON.parse(message.payloadString);
    // console.log(message.payloadString);
    // how to read each value, this case it's lux
    console.log(msg);

    /* firebase */
    // sending data to firebase
    // addDocuments(msg);
    // getting data from firebase
    // getDocuments();

    // iterate over the elements of the JSON object:
    for (var key in msg) {
        // If there is not an HTML element with the same ID:
        if (document.getElementById(key) === null) {
            // create create one and give it this ID:
            let thisDiv = document.createElement('div');
            thisDiv.id = key;
            // create text with the key and value:
            let textNode = document.createTextNode(key + ': ' + msg[key]);
            // add the text to the element and add it to the HTML:
            thisDiv.append(textNode);
            document.body.append(thisDiv);
            // console.log(textNode);
        } else {
            // if there's already an element with this ID,
            // just update it:
            let thisDiv = document.getElementById(key);
            thisDiv.innerHTML = key + ': ' + msg[key];
        }
    }
}

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
app.get('/api/read/:id', (req, res) => {
    (async () => {
        // telling express to access to a collection and add new id and data
        try {
            const document = db.collection('f008d1cb466c').doc(req.params.id);
            let uid = await document.get();
            let response = uid.data();

            return res.status(200).send(response);
        }

        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();

});

function getLatest(req, res) {
    // get what the client wants from the request
    // form it into a fireBase query
    // query fireBase
    // when the response comes in, respond to the web client
}


// export the api to firebase cloud functions
exports.app = functions.https.onRequest(app);