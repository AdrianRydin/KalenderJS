
/**
 * sätter formen till dagens datum så den inte är blank
 */
function setCurrentDate() {
  let dateControl = document.querySelectorAll('input[type="date"]');
  dateControl.forEach(element => {
    element.valueAsDate = new Date();
  })
}
/**
 * renderar dagarna från första veckan av månaden där dagar från förra månaden intränger
 * @returns en div per dag 
 */
function renderPrevMonth() {
  let result = "";

  // Index för första dagen i denna veckan
  const firstDayIndex = date.getDay() - 1;

  // Sista dagen på förra månaden
  const prevMonthLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

  // Förra månaden
  for (let i = firstDayIndex; i > 0; i--) {
    let day = prevMonthLastDay - i + 1;
    result += `<div class="prev-date">${day}</div>`;
  }

  return result;
}

function renderDay(day, today, todoCounter, helgdag) {
  let result = "";

  if(today) {
    result += "<div class=\"today\">";
  } else if(helgdag) {
    result += "<div class=\"red\">";
  }else {
    result += "<div>";
  }
  
  result += day.toString();

  if (todoCounter > 0 && helgdag) {
    result += "<br>";
    result += "<br>";
    result += helgdag;
    result += "<br>";
    result += "<br>";
    result += "todos: " + todoCounter.toString();
    
  }else if(todoCounter > 0) {
    result += "<br>";
    result += "<br>";
    result += "todos: " + todoCounter.toString();

  }else if (helgdag) {
    result += "<br>";
    result += "<br>";
    result += helgdag;
    
  }else{
    
  }

  result += "</div>";

  /*
  if(helgdag) {
    result += `<div class="red">${day}<br><br>${todoCounter}<br>${helgdag}</div>`;
  } else {
    result += `<div>${i}<br><br>${counter}</div>`;
  }*/

  return result;
}

/**
 * renderar dagarna i månaden som ska visas
 * @returns en div per dag 
 */
function renderCurrentMonth() {
  let result = "";

  // Hämta alla todos
  let todoList = getTodoList();

  // Sista dagen på månaden
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  // https://sholiday.faboul.se/dagar/v2.1/{YEAR}/{MONTH}

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let data = JSON.parse(xhttp.responseText);
        console.log(data);

        // Rendera denna månaden
        for (let i = 1; i <= lastDay; i++) {
          let dayInfo = data.dagar[i - 1];

          // Hur många todos denna dagen har
          let counter = 0;
          todoList.forEach(todo => {
            let todoDate = new Date(todo.date);

            // Kolla om todos datum passar med datumet
            if (todoDate.getFullYear() === date.getFullYear() && 
                todoDate.getMonth() === date.getMonth() && 
                todoDate.getDate() === i) 
            {
              counter++;
            }
          });

          let today = new Date();
          // Kolla om den här dagen är idag och då markera dagen
          if (i === today.getDate() && 
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear()) {

            result += renderDay(i, true, counter, dayInfo.helgdag);
          } else {
            result += renderDay(i, false, counter, dayInfo.helgdag);
          }
        }

      }
  };

  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  xhttp.open("GET", `https://sholiday.faboul.se/dagar/v2.1/${year}/${month}`, false);
  xhttp.send();

  return result;
}
/**
 * renderar dagarna från sista veckan av månaden där dagar från nästa månaden intränger
 * @returns en div per dag 
 */
function renderNextMonth() {
  let result = "";

  // Index för hur många dagar i sista veckan som tillhör nuvarande månad
  const lastWeekDayOfCurrentMonthIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay() - 1;

  // Räkna hur många dagar som behövs renderas från nästa månad
  const dayCount = 7 - lastWeekDayOfCurrentMonthIndex - 1;

  // Rendera nästa månaden dagar om vi behöver det
  for (let i = 1; i <= dayCount; i++) {
    result += `<div class="next-date">${i}</div>`;
  }

  return result;
}
/**
 * renderar kalendern med alla dagar
 */
function renderCalendar(){
  // Sätt date objectet till första dagen i månaden
  date.setDate(1);

  // Namn på alla månaderna
  const months = [
    "Januari",
    "Februari",
    "Mars",
    "April",
    "Maj",
    "Juni",
    "Juli",
    "Augusti",
    "September",
    "October",
    "November",
    "December",
  ];

  // Uppdatera kalender headern med rätt månad och år
  document.querySelector(".date h1").innerHTML = months[date.getMonth()];
  document.querySelector(".date p").innerHTML = date.getFullYear();

  // All html kod som genereras av kalendern 
  let content = "";

  // Renderera dem dagarna som ska visas från 
  content += renderPrevMonth();    // förra månaden
  content += renderCurrentMonth(); // denna månaden
  content += renderNextMonth();    // nästa månaden

  // Uppdatera html med den nya kalendern
  const monthDays = document.querySelector(".days");
  monthDays.innerHTML = content;
};

let m = date.getMonth();

document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(m -= 1);
  renderCalendar();
});

document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(m += 1);
  renderCalendar();
});

window.addEventListener("load", () => {
  setCurrentDate();
  renderCalendar();
});
