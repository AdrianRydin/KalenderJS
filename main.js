let date = new Date();

let dayDate = date.getDate() + '/' + date.getMonth() + '-' + date.getFullYear();
let time;
let weekDay = date.getDay();
let today;

let daySelector = document.getElementById("day");
let dateSelector = document.getElementById("date");
let timeSelector = document.getElementById("time");
let emojiSelector = document.getElementById("weatherEmoji");

function getDate() {
    switch (weekDay) {
        case 0:
            today = "Söndag";
            break;
        case 1:
            today = "Måndag";
            break;
        case 2:
            today = "Tisdag";
            break;
        case 3:
            today = "Onsdag";
            break;
        case 4:
            today = "Torsdag";
            break;
        case 5:
            today = "Fredag";
            break;
        case 6:
            today = "Lördag";    
            break;
    
        default:
            break;
    }
    
    daySelector.innerHTML = today;
    dateSelector.innerHTML = dayDate;
    setInterval(function(){
        date = new Date();
        time = date.toLocaleTimeString('en-GB'); 
        timeSelector.innerHTML = time;},1000);
}

function getWeather() {
    
const kelvin = 273;
let lon;
let lat;
let tempSelector = document.getElementById("temp");

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      lon = position.coords.longitude;
      lat = position.coords.latitude;
  
      // API ID
      const api = "8ba035014de4131589877badb0269696";
  
      // API URL
      const base =
`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` +
`lon=${lon}&appid=${api}`;
  
      // Calling the API
      fetch(base)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
            let temp = Math.floor(data.main.temp - kelvin);
          tempSelector.innerHTML = temp + "°C";
            if (temp <= 0) {
                emojiSelector.innerHTML = "\u{1F976}"
            }else if(temp >= 14 && temp < 30){
                emojiSelector.innerHTML = "\u{1F973}"
            }else if (temp >= 30){
                emojiSelector.innerHTML = "\u{1F975}"
            }else {
                emojiSelector.innerHTML = "\u{1F912}"
            }
        });
    });
  }
  
}

function burgerMenu() {
    let x = document.getElementById("burgerList");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }

window.addEventListener("load", () => {
    getWeather();
    getDate();
  });