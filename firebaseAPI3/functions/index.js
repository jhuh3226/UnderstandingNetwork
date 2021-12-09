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

// POST time only after certain time

// POST (create), to CenterDecibelTest
// Have to seperate for each Uid 
app.post('/api/create/centerdecibeltest', (req, res) => {
    (async () => {
        // telling express to access to a collection and add new id and data
        try {
            await db.collection('CenterDecibelTest').doc('/' + req.body.id + '/')
                .create({
                    max4466: req.body.max4466,
                    daoki: req.body.daoki,
                    time: req.body.time
                    // createdAt: timestamp
                })

            return res.status(200).send('Data sent');
        }

        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();

});

// POST (create), to NEcorner
// Have to seperate for each Uid 
app.post('/api/create/necorner', (req, res) => {
    (async () => {
        // telling express to access to a collection and add new id and data
        try {
            await db.collection('NEcorner').doc('/' + req.body.id + '/')
                .create({
                    ct: req.body.ct,
                    lux: req.body.lux,
                    time: req.body.time
                    // createdAt: timestamp
                })

            return res.status(200).send('Data sent');
        }

        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();

});

// POST (create), to NEcorner
// Have to seperate for each Uid 
app.post('/api/create/nwcorner', (req, res) => {
    (async () => {
        // telling express to access to a collection and add new id and data
        try {
            await db.collection('NWcorner').doc('/' + req.body.id + '/')
                .create({
                    ct: req.body.ct,
                    lux: req.body.lux,
                    time: req.body.time
                })

            return res.status(200).send('Data sent');
        }

        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();

});

// POST (create), to NEcorner
// Have to seperate for each Uid 
app.post('/api/create/swcorner', (req, res) => {
    (async () => {
        // telling express to access to a collection and add new id and data
        try {
            await db.collection('SWcorner').doc('/' + req.body.id + '/')
                .create({
                    ct: req.body.ct,
                    lux: req.body.lux,
                    time: req.body.time
                })

            return res.status(200).send('Data sent');
        }

        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();

});

// GET single data by id
app.get('/api/read/centerdecibeltest/id/:id', (req, res) => {
    (async () => {
        // telling express to access to a collection and add new id and data
        try {
            const document = db.collection('CenterDecibelTest').doc(req.params.id);
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

// GET
// When button pushed, get all the data from each category
app.get('/api/read/centerdecibeltest/all', (req, res) => {
    (async () => {
        // telling express to access to a collection and add new id and data
        try {
            let query = db.collection('CenterDecibelTest').orderBy("time", "asc");   // get all the data sorted by time
            let response = [];

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;   // the result of the query

                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        time: doc.data().time,
                        max4466: doc.data().max4466,
                        daoki: doc.data().daoki
                    };
                    response.push(selectedItem);
                }
                return response; // each then should return a value
            })
            return res.status(200).send(response);
        }

        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

// GET
// get query range data
app.get('/api/read/centerdecibeltest/range/:start/:end', (req, res) => {
    (async () => {
        // telling express to access to a collection and add new id and data
        // 1638655020/1638655080
        try {
            let query = db.collection('CenterDecibelTest').where("time", ">=", parseInt(req.params.start)).where("time", "<=", parseInt(req.params.end)).orderBy("time", "asc");   // get all the data sorted by time
            console.log(req.params.start);
            console.log(req.params.end);
            let response = [];

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;   // the result of the query

                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        time: doc.data().time,
                        max4466: doc.data().max4466,
                        daoki: doc.data().daoki
                    };
                    response.push(selectedItem);
                }
                return response; // each then should return a value
            })
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

// mqtt server ---------------------------------------------------------------------------------------------
// subscribe to MQTT channels
// when data arrives, send to FireBase

// const firebaseLink = "https://us-central1-understandingnetwork-90aa1.cloudfunctions.net/app"

// // include the MQTT library:
// const mqtt = require("mqtt");
// const { response } = require("express");
// // the broker you plan to connect to.
// // transport options:
// // 'mqtt', 'mqtts', 'tcp', 'tls', 'ws', or 'wss':
// const broker = "mqtts://public.cloud.shiftr.io";
// // client options:
// const options = {
//     clientId: "ITPcenter",
//     // clientId: "nodeClient",
//     username: "public",
//     password: "public"
// };
// // topic and message payload:
// let myTopic = "ITPcenterDecibel";
// // let myTopic = "light-readings";

// let directory = null;
// let sentID = 0;
// let centerDecibelTestID = 0;

// // connect handler:
// function setupClient() {
//     // read all the subtopics:
//     client.subscribe(myTopic);
//     // set a handler for when new messages arrive:
//     client.on("message", readMqttMessage);
// }

// // new message handler:
// function readMqttMessage(topic, message) {
//     // message is a Buffer, so convert to a string:
//     let msgString = message.toString();
//     // get rid of double quotes in any of the strings:
//     // msgString = msgString.replace(/['"]+/g, "");
//     const obj = JSON.parse(msgString);
//     console.log(obj);

//     let max4466Data = obj.max4466Value;
//     let daokiData = obj.daokiValue;
//     let timeStampData = obj.timeStamp;

//     sendToFirestore(max4466Data, daokiData, timeStampData);
// }

// let client = mqtt.connect(broker, options);
// client.on("connect", setupClient);

// function sendToFirestore(max4466Value, daokiValue, time) {
//     console.log(`Sending max4466: ${max4466Value}, daoki: ${daokiValue}, time ${time}`);

//         directory = 'centerdecibeltest';
//         sentID = centerDecibelTestID;
//         centerDecibelTestID++;

//     fetch(firebaseLink + "/api/create/" + directory, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             'id': sentID,
//             'max4466': max4466Value,
//             'daoki': daokiValue,
//             'time': time
//         }),
//     })
//         .then((res) => res.json())
//         .then((data) => {
//             // Do some stuff ...
//         })
//         .catch((err) => console.log(err));
// }

// check the real-time
// GET only data from asc order that corresponds to certain date

// export the api to firebase cloud functions
exports.app = functions.https.onRequest(app);