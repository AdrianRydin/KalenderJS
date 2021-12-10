const date = new Date();
let dayDate = date.getDate() + '/' + date.getMonth() + '-' + date.getFullYear();
let time = date.getHours() + ':' + date.getMinutes();
let day = date.getDay();
let today = "";
switch (day) {
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

document.getElementById("day").innerHTML = today;
document.getElementById("date").innerHTML = dayDate;
document.getElementById("time").innerHTML = time;
document.getElementById("weather").innerHTML = today;
