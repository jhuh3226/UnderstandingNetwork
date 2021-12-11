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

/* ROUTE ---------------------------------------------------------------------------------------- */
app.get('/hello-world', (req, res) => {

    return res.status(200).send('Hi!!!!!!');
});

/* POST ----------------------------------------------------------------------------------------- */
// POST to CENTER
app.post('/api/create/centerdecibel', (req, res) => {
    (async () => {
        // telling express to access to a collection and add new id and data
        try {
            await db.collection('CenterDecibel').doc('/' + req.body.id + '/')
                .create({
                    // max4466: req.body.max4466,
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

// ------------------------------------
// POST to CODING LAB
app.post('/api/create/codinglabdecibel', (req, res) => {
    (async () => {
        // telling express to access to a collection and add new id and data
        try {
            await db.collection('CodingLabDecibel').doc('/' + req.body.id + '/')
                .create({
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

// ------------------------------------
// POST to KITCHEN
app.post('/api/create/kitchendecibel', (req, res) => {
    (async () => {
        // telling express to access to a collection and add new id and data
        try {
            await db.collection('KitchenDecibel').doc('/' + req.body.id + '/')
                .create({
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

/* GET SINGLE ----------------------------------------------------------------------------------- */
// GET single data by id CENTER
app.get('/api/read/centerdecibel/id/:id', (req, res) => {
    (async () => {
        // telling express to access to a collection and add new id and data
        try {
            const document = db.collection('CenterDecibel').doc(req.params.id);
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

/* GET ------------------------------------------------------------------------------------------ */
// When button pushed, get all the data from each category
// GET all CENTER data
app.get('/api/read/centerdecibel/all', (req, res) => {
    (async () => {
        // telling express to access to a collection and add new id and data
        try {
            let query = db.collection('CenterDecibel').orderBy("time", "asc");   // get all the data sorted by time
            let response = [];

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;   // the result of the query

                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        time: doc.data().time,
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

// ------------------------------------
// GET all CODING LAB data
app.get('/api/read/codinglabdecibel/all', (req, res) => {
    (async () => {
        // telling express to access to a collection and add new id and data
        try {
            let query = db.collection('CodingLabDecibel').orderBy("time", "asc");   // get all the data sorted by time
            let response = [];

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;   // the result of the query

                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        time: doc.data().time,
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

// ------------------------------------
// GET all KITCHEN
app.get('/api/read/kitchendecibel/all', (req, res) => {
    (async () => {
        // telling express to access to a collection and add new id and data
        try {
            let query = db.collection('KitchenDecibel').orderBy("time", "asc");   // get all the data sorted by time
            let response = [];

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;   // the result of the query

                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        time: doc.data().time,
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

/* GET QUERY ------------------------------------------------------------------------------------ */
// get query range data for CENTER 
app.get('/api/read/centerdecibel/range/:start/:end', (req, res) => {
    (async () => {
        // telling express to access to a collection and add new id and data
        // such as 1638655020/1638655080
        try {
            let query = db.collection('CenterDecibel').where("time", ">=", parseInt(req.params.start)).where("time", "<=", parseInt(req.params.end)).orderBy("time", "asc");   // get all the data sorted by time
            console.log(req.params.start);
            console.log(req.params.end);
            let response = [];

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;   // the result of the query

                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        time: doc.data().time,
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

// ------------------------------------
// get query range data for CODING LAB 
app.get('/api/read/codinglabdecibel/range/:start/:end', (req, res) => {
    (async () => {
        // telling express to access to a collection and add new id and data
        try {
            let query = db.collection('CodingLabDecibel').where("time", ">=", parseInt(req.params.start)).where("time", "<=", parseInt(req.params.end)).orderBy("time", "asc");   // get all the data sorted by time
            console.log(req.params.start);
            console.log(req.params.end);
            let response = [];

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;   // the result of the query

                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        time: doc.data().time,
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

// ------------------------------------
// get query range data for KITCHEN
app.get('/api/read/kitchendecibel/range/:start/:end', (req, res) => {
    (async () => {
        // telling express to access to a collection and add new id and data
        try {
            let query = db.collection('KitchenDecibel').where("time", ">=", parseInt(req.params.start)).where("time", "<=", parseInt(req.params.end)).orderBy("time", "asc");   // get all the data sorted by time
            console.log(req.params.start);
            console.log(req.params.end);
            let response = [];

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;   // the result of the query

                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        time: doc.data().time,
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

// export the api to firebase cloud functions
exports.app = functions.https.onRequest(app);