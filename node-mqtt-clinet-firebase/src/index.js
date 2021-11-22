import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp
} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBGsCWIXEBk7RIcntg2_69_mqupIBUZgm0",
    authDomain: "understandingnetwork-90aa1.firebaseapp.com",
    databaseURL: "https://understandingnetwork-90aa1-default-rtdb.firebaseio.com",
    projectId: "understandingnetwork-90aa1",
    storageBucket: "understandingnetwork-90aa1.appspot.com",
    messagingSenderId: "264597897286",
    appId: "1:264597897286:web:7fa981ee396002f8978a47",
    measurementId: "G-GLEVG4B9TV"
};

initializeApp(firebaseConfig);

// init services
const db = getFirestore()

/* ----------- START OF MQTT SETTING -----------*/
/*
  MQTT Client
  
  created 13 Jun 2021
  by Tom Igoe
*/

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

    // sending data to firebase
    addDocuments(msg);
    // getting data from firebase
    getDocuments();

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

/* ----------- END OF MQTT SETTING -----------*/

// collection ref
// f008d1cb466c is uid of the current Arduino
const colRef = collection(db, 'f008d1cb466c')

// queries
// fetch me anydocument where the author is equal to ___
// change getDocs(colReft) to getDoc(q) to make this work
// const q = query(colRef, where("author", "==", "patrick rothfuss"))
const q = query(colRef, orderBy('createdAt','asc'));


// get collection data
// const getDocuments = () => {
//     // getDocs(colRef)
//     getDocs(q)
//         .then(snapshot => {
//             // console.log(snapshot.docs)
//             let f008d1cb466c = []
//             snapshot.docs.forEach(doc => {
//                 f008d1cb466c.push({ ...doc.data(), id: doc.id })
//             })
//             console.log(f008d1cb466c)
//         })
//         .catch(err => {
//             console.log(err.message)
//         })
// }

const getDocuments = () => {
    onSnapshot(q, (snapshot) => {
        let f008d1cb466c = []
        snapshot.docs.forEach(doc => {
            f008d1cb466c.push({ ...doc.data(), id: doc.id })
        })
        console.log(f008d1cb466c)
      })
}

// add data to collection
const addDocuments = (msg) => {
    // have to set which collection we are adding data to
    addDoc(colRef, {
        ct: msg.ct,
        lux: msg.lux,
        time: msg.timeStamp,
        createdAt: serverTimestamp()
    })
        // make sure data is stored sucessfully
        .then(() => {
            console.log("data is stored succesfully");
        })
        .catch((error) => {
            console.log("unsuccessful, error" + error);
        });
};

// delete data from collection
const deleteDocuments = () => {
    // takes three arguments
    // 1. db/ 2. collection/ 3.id of the document
    // const docRef = doc(db, 'f008d1cb466c', _____.id.value)

    // deleteDoc(docRef)
    //     .then(() => {
    //         deleteBookForm.reset()
    //     })
};


// This is a listener for the page to load.
// This is the command that actually starts the script:
window.addEventListener('DOMContentLoaded', setup);