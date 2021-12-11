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
    const response = await fetch(firebaseLink + "/api/read/centerdecibel/all");
    // const response = await fetch("")
    const data = await response.json();
    const stringData = JSON.stringify(data)
    log.innerHTML = stringData;
    console.log(data);
}

// (delete this after moving to server.js)
// ge the realtime
function realTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).substr(-2);
    var day = ("0" + date.getDate()).substr(-2);
    var hour = ("0" + date.getHours()).substr(-2);
    var minutes = ("0" + date.getMinutes()).substr(-2);
    var seconds = ("0" + date.getSeconds()).substr(-2);

    console.log(`${year}-${month}-${day} ${hour}:${minutes}:${seconds}`);
    toTimestamp(year, month, day, hour, minutes, seconds);

    return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
}

// (move this to server.js)
// get the current year, month, day, hour, minute to timestamp
// referenced https://www.hashbangcode.com/article/convert-date-timestamp-javascript
// https://www.epochconverter.com/
function toTimestamp(year, month, day, hour, minute, second) {
    var datum = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    // console.log(datum.getTime() / 1000);
    return datum.getTime() / 1000;
}

// (move this to server.js)
// At every hour, GET the query data
// but for now test it console
function hourlyChime() {
    // get the current time
    var date = new Date();
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).substr(-2);
    var day = ("0" + date.getDate()).substr(-2);
    var hour = ("0" + date.getHours()).substr(-2);
    var minutes = ("0" + date.getMinutes()).substr(-2);
    var seconds = ("0" + date.getSeconds()).substr(-2);

    // console.log(date.getMinutes());     // show the minute

    if (minutes == "00" && minutes != "00") {
        console.log("It is sharp hour");
        // GET the data in query
        // from current timestamp - 3600 (hour ago) to current timestamp - 60 (one minute ago)
        var queryStartTime = parseInt(toTimestamp(year, month, day, hour, minutes, "00")) - 3600;
        var queryEndTime = parseInt(toTimestamp(year, month, day, hour, minutes, "00")) - 60;

        console.log(`${queryStartTime}, ${queryEndTime}`);

        // do the musical transformation
    }

    // if it is 12 AM at night play the sound of the previous day (lasts for 360 seconds (6 minutes))
    if(hour == "00" && minutes == "00"){

    }
}