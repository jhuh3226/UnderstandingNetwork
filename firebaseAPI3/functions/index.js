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

// GET 
// app.get('/api/read', (req, res) => {
//     (async () => {
//         // telling express to access to a collection and add new id and data
//         try {

//             return res.status(200).send(response);
//         }

//         catch (error) {
//             console.log(error);
//             return res.status(500).send(error);
//         }
//     })();
// });

// GET certain data
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

// GET
// When button pushed, get all the data from each category
app.get('/api/read/swcorner/all', (req, res) => {
    (async () => {
        // telling express to access to a collection and add new id and data
        try {
            let query = db.collection('SWcorner').orderBy("time", "asc");   // get all the data sorted by time
            let response = [];

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;   // the result of the query

                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        time: doc.data().time,
                        lux: doc.data().lux,
                        ct: doc.data().ct
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

// check the real-time
// GET only data from asc order that corresponds to certain date

// export the api to firebase cloud functions
exports.app = functions.https.onRequest(app);