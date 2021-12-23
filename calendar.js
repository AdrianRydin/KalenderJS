let selectedDate = null;
let selectedDateElement = null;

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
/**
 * skapar HTMLElement beroende på dag så att de har olika klasser
 * @param {int} day vilken dag det är i månaden
 * @param {boolean} today är true om det är idag
 * @param {int} todoCounter hur många todos en dag har
 * @param {string} helgdag namn på helgdagen
 * @returns HTMLElement 
 */
function renderDay(day, today, todoCounter, helgdag) {
  let result = "";

  result += "<div ";
  result += "onclick=\"selectDay(this)\" ";
  result += "id=\"current-day\" ";
  let calendarDate = new Date(date.getFullYear(), date.getMonth(), day);
  result += `data-date=\"${String(calendarDate)}\"`;

  if(today) {
    result += "class=\"current-day today\" ";
  } else if(helgdag) {
    result += "class=\"current-day red-day\" ";
  }else {
    result += "class=\"current-day\" ";
  }
  result += ">";
  
  result += "<div class='day'>"
  result += day.toString();
  result += "</div>"

  if(helgdag) {
    result += "<div class='holiday'>"
    result += helgdag;
    result += "</div>"
  }

  if (todoCounter > 0) {
    result += "<div class='todocount'>"
    result += "todos: " + todoCounter.toString();
    result += "</div>"
  }

  result += "<div id='selected'>";
  result += "</div>";

  result += "</div>";

  return result;
}
/**
 * visar todos som är kopplade till dagen man selectat 
 * och ger den selectade dagen ny css klass så man ser att den är selectad
 * @param {HTMLElement} currentElement Elementet som kallar på funktionen
 */
function selectDay(currentElement) {
  let calendarDate = new Date(currentElement.dataset.date);

  if(selectedDateElement === null) {
    if(selectedDate === null) {
      selectedDate = calendarDate;
      selectedDateElement = currentElement;
      currentElement.classList.add("date-selected");
    }
  } else {
    if(calendarDate.getFullYear() === selectedDate.getFullYear() && 
       calendarDate.getMonth() === selectedDate.getMonth() && 
       calendarDate.getDate() === selectedDate.getDate()) {
      selectedDate = null;
      selectedDateElement = null;
      currentElement.classList.remove("date-selected");
    } else {
      selectedDateElement.classList.remove("date-selected");
      currentElement.classList.add("date-selected");
      selectedDate = calendarDate;
      selectedDateElement = currentElement;
    }
  }


  renderTodos();

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
  document.querySelector(".date h2").innerHTML = months[date.getMonth()];
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
