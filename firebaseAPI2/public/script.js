console.log("Page loaded, hello");

const btnFetch = document.getElementById("btnFetch");
const log = document.getElementById("log");

var loggedData = null;

btnFetch.addEventListener('click', () => {
    loggedData = getData();
    log.innerHTML = loggedData;
});

// on btn click get the latest data from the firestore
async function getData() {
    const response = await fetch("http://localhost:5001/understandingnetwork-90aa1/us-central1/app//api/read/1FLdpl2o5kiF4WXY8TCX");
    // const response = await fetch("")
    const data = await response.json();
    console.log(data);
}