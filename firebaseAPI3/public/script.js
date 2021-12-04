console.log("Page loaded, hello");

// fetch reference
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

const btnFetch = document.getElementById("btnFetch");
const log = document.getElementById("log");

const firebaseLink = "https://us-central1-understandingnetwork-90aa1.cloudfunctions.net/app"

btnFetch.addEventListener('click', () => {
    getData();
});

// on btn click get the latest data from the firestore
async function getData() {
    const response = await fetch(firebaseLink+"/api/read/centerdecibeltest/all");
    // const response = await fetch("")
    const data = await response.json();
    const stringData = JSON.stringify(data)
    log.innerHTML = stringData;
    console.log(data);
}