// Globale variables
let baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip='
const apiKey = '3cb86747650848dd3291b53657fdb90e';


// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '-' + d.getDate() + '-' + d.getFullYear();

// Hold entry information div 
const entryHolder = document.getElementById('entryHolder');

// Hold generte button element
const generateEl = document.getElementById('generate');
// Start action ,generartor event listener callback
const startAction = (e) => {
    //Hide entry holder information for not found city
    entryHolder.style.display='none';

    // Get value from zip input and remove start and end empty space
    const zip = document.getElementById('zip').value.trim();

    // Check if user enter zip code
    if (zip) {
        // Check if zip numeric value
        if (!isNaN(zip)) {
            // Start fetch data from Weather API
            getWeather(zip).then(data => {
                // // Hold feelings textarea value
                const feelings = document.getElementById('feelings').value.trim();
                //Check if valid zip code
                if(data.cod==='404'){
                    throw new Error(data.message);
                }  
                console.log(data);
                // convert temperature to celsius               
                const temp = Math.ceil(data.main.temp - 273.15);

                // Add data to post resquest
                const postData = { date: newDate, temp: temp, feelings: feelings };
                return postData;
            }).then(postData => {
                // Post data
                return postDataToServer('/postData', postData)
            }).then(data => {
                console.log(data);
                // Retrieve most entry
                return getMostEntry();
            }).then(mostEntry => {
                // Update UI
                updatUi(mostEntry);
            }).catch(e=>{
                alert(e)
                return;
            });
        } else {
            // None numirec zip code
            alert('Not valid zip code found , please enter valid zip code');
        }
    } else {

        // Empty zipe code
        alert('No zip code found , please enter zip code');
    }
}

// Add click listener to generate button
generateEl.addEventListener('click', startAction);




// Fetch weathr data from API
const getWeather = async (zip) => {
    const url = `${baseURL}${zip}&appid=${apiKey}`;
    const response = await fetch(url);
    try {
        const weatherData = await response.json();
        return weatherData;
    } catch (error) {
        console.log("error", error);
    }
};


// Post data to server
const postDataToServer = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        // Body data type must match "Content-Type" header        
        body: JSON.stringify(data),
    });
    try {
        const resData = await response.json();
        return resData;
    } catch (error) {
        console.log("error", error);
    }
};
// Retrieve most entry
const getMostEntry = async () => {
    const response = await fetch('/getMostEntry');
    try {
        const resData = await response.json();
        return resData;
    } catch (error) {
        console.log("error", error);
    }
};

// Update UI

function updatUi(entry) {
    console.log('Update Ui', entry);
    // Show most entry element
    entryHolder.style.display='block';
    // Hold most entry information elements
    let date = document.querySelector('#date');
    let temp = document.querySelector('#temp');
    let content = document.querySelector('#content');

    date.innerHTML = ` <i class="fa fa-calendar-o" aria-hidden="true"></i><span>${entry.date}</span>`;
    temp.innerHTML = ` <i class="fa fa-cloud" aria-hidden="true"></i><span>${entry.temp}</span>  <sup>o</sup>c`;
    content.innerHTML = `<i class="fa fa-comment" aria-hidden="true"></i><span>${entry.feelings}</span>`;
}
