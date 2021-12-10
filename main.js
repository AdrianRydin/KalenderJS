let date = new Date();

let dayDate = date.getDate() + '/' + date.getMonth() + '-' + date.getFullYear();
let time;
let weekDay = date.getDay();
let today;

let daySelector = document.getElementById("day");
let dateSelector = document.getElementById("date");
let timeSelector = document.getElementById("time");

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
      console.log(position);
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
          console.log(data);
          tempSelector.textContent = 
              Math.floor(data.main.temp - kelvin) + "°C";
        });
    });
  }
}


window.addEventListener("load", () => {
    getWeather();
    getDate();
  });