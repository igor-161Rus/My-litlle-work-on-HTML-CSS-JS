// Часы
setInterval(() => {
  const time = document.querySelector(".display #time");
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let day_night = "AM";
  if (hours > 24) {
    day_night = "PM";
    hours = hours - 12;
  }
  if (seconds < 10) {
      seconds = "0" + seconds;
  }
  if (minutes < 10) {
      minutes = "0" + minutes;
  }
  if (hours < 10) {
      hours = "0" + hours;
  }
  time.textContent = hours + ":" + minutes + ":" + seconds + " " + day_night;
})


// Календарь
var Cal = function(divId) {
    //Сохраняем идентификатор div
    this.divId = divId;
    // Дни недели с понедельника
    this.DaysOfWeek = [
      'Пн',
      'Вт',
      'Ср',
      'Чт',
      'Пт',
      'Сб',
      'Вс'
    ];
    // Месяцы начиная с января
    this.Months =['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    //Устанавливаем текущий месяц, год
    var d = new Date();
    this.currMonth = d.getMonth();
    this.currYear = d.getFullYear();
    this.currDay = d.getDate();
  };
  // Переход к следующему месяцу
  Cal.prototype.nextMonth = function() {
    if ( this.currMonth == 11 ) {
      this.currMonth = 0;
      this.currYear = this.currYear + 1;
    }
    else {
      this.currMonth = this.currMonth + 1;
    }
    this.showcurr();
  };
  // Переход к предыдущему месяцу
  Cal.prototype.previousMonth = function() {
    if ( this.currMonth == 0 ) {
      this.currMonth = 11;
      this.currYear = this.currYear - 1;
    }
    else {
      this.currMonth = this.currMonth - 1;
    }
    this.showcurr();
  };
  // Показать текущий месяц
  Cal.prototype.showcurr = function() {
    this.showMonth(this.currYear, this.currMonth);
  };
  // Показать месяц (год, месяц)
  Cal.prototype.showMonth = function(y, m) {
    var d = new Date()
    // Первый день недели в выбранном месяце 
    , firstDayOfMonth = new Date(y, m, 7).getDay()
    // Последний день выбранного месяца
    , lastDateOfMonth =  new Date(y, m+1, 0).getDate()
    // Последний день предыдущего месяца
    , lastDayOfLastMonth = m == 0 ? new Date(y-1, 11, 0).getDate() : new Date(y, m, 0).getDate();
    var html = '<table>';
    // Запись выбранного месяца и года
    html += '<thead><tr>';
    html += '<td colspan="7">' + this.Months[m] + ' ' + y + '</td>';
    html += '</tr></thead>';
    // заголовок дней недели
    html += '<tr class="days">';
    for(var i=0; i < this.DaysOfWeek.length;i++) {
      html += '<td>' + this.DaysOfWeek[i] + '</td>';
    }
    html += '</tr>';
    // Записываем дни
    var i=1;
    do {
      var dow = new Date(y, m, i).getDay();
      // Начать новую строку в понедельник
      if ( dow == 1 ) {
        html += '<tr>';
      }
      // Если первый день недели не понедельник показать последние дни предыдущего месяца
      else if ( i == 1 ) {
        html += '<tr>';
        var k = lastDayOfLastMonth - firstDayOfMonth+1;
        for(var j=0; j < firstDayOfMonth; j++) {
          html += '<td class="not-current">' + k + '</td>';
          k++;
        }
      }
      // Записываем текущий день в цикл
      var chk = new Date();
      var chkY = chk.getFullYear();
      var chkM = chk.getMonth();
      if (chkY == this.currYear && chkM == this.currMonth && i == this.currDay) {
        html += '<td class="today">' + i + '</td>';
      } else {
        html += '<td class="normal">' + i + '</td>';
      }
      // закрыть строку в воскресенье
      if ( dow == 0 ) {
        html += '</tr>';
      }
      // Если последний день месяца не воскресенье, показать первые дни следующего месяца
      else if ( i == lastDateOfMonth ) {
        var k=1;
        for(dow; dow < 7; dow++) {
          html += '<td class="not-current">' + k + '</td>';
          k++;
        }
      }
      i++;
    }while(i <= lastDateOfMonth);
    // Конец таблицы
    html += '</table>';
    // Записываем HTML в div
    document.getElementById(this.divId).innerHTML = html;
  };
  // При загрузке окна
  window.onload = function() {
    // Начать календарь
    var c = new Cal("divCal");			
    c.showcurr();
    // Привязываем кнопки «Следующий» и «Предыдущий»
    getId('btnNext').onclick = function() {
      c.nextMonth();
    };
    getId('btnPrev').onclick = function() {
      c.previousMonth();
    };
  }
  // Получить элемент по id
  function getId(id) {
    return document.getElementById(id);
  }


// Погода
var x = document.getElementById("demo");
function getLocation() {
if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(showPosition);
} else {
x.innerHTML = "Geolocation is not supported by this browser.";
}
}

function showPosition(position) {
  x.innerHTML = "Широта: " + position.coords.latitude +
  "<br> Долгота: " + position.coords.longitude;
  url = `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=3ba0fd8e6df9f24e84919f279663263b&units=metric&lang=ru`
 start(url);
}

let url = 'https://api.openweathermap.org/data/2.5/forecast?lat=47.0&lon=42.0&appid=3ba0fd8e6df9f24e84919f279663263b&units=metric&lang=ru';
const temperatureUnit = '˚';
const humidityUnit = ' %';
const pressureUnit = ' мм. рт. ст.';
const windUnit = ' м/с';

var currentData;

async function getData(url) {
  let response = await fetch(url);

  if (response.ok) {
    let jsonData = response.json();
    return jsonData;
  } else {
    alert('Error: ' + response.status);
  }
}

function convertPressure(value) {
  return (value/1.33 ).toFixed();
}

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

function getHoursString(dateTime) {
  let date = new Date(dateTime);
  let hours = date.getHours().pad();

  return hours;
}

function getValueWithUnit(value, unit) {
  return `${value}${unit}`;
}

function getTemperature(value) {
  var roundedValue = value.toFixed();
  return getValueWithUnit(roundedValue, temperatureUnit);
}

function render(data) {
  renderCity(data);
  renderCurrentTemperature(data);
  renderCurrentDescription(data);

  renderForecast(data);
  renderDetails(data);
  renderDayOrNight(data);
}

function renderCity(data) {
  let cityName = document.querySelector('.current__city');
  cityName.innerHTML = data.city.name;
}

function renderCurrentTemperature(data) {
  let tmp = data.list[0].main.temp;

  let currentTmp = document.querySelector('.current__temperature');
  currentTmp.innerHTML = getTemperature(tmp);
}

function renderCurrentDescription(data) {
  let tmp = data.list[0].weather[0].description;

  let description = document.querySelector('.current__description');
  description.innerHTML = tmp;
}

function renderForecast(data) {
  let forecastDataContainer = document.querySelector('.forecast');
  let forecasts = '';

  for (let i = 0; i < 6; i++) {
    let item = data.list[i];

    let icon = item.weather[0].icon;
    let temp = getTemperature(item.main.temp);
    let hours = ( i == 0 ? 'Сейчас' : getHoursString(item.dt * 1000));

    let template = `<div class="forecast__item">
      <div class="forecast__time">${hours}</div>
      <div class="forecast__icon icon__${icon}"></div>
      <div class="forecast__temperature">${temp}</div>
    </div>`;
    forecasts += template;
  }
  forecastDataContainer.innerHTML = forecasts;
}

function renderDetails(data) {
  let item = data.list[0];
  let pressureValue = convertPressure(item.main.pressure);
  let pressure = getValueWithUnit(pressureValue, pressureUnit);
  let humidity = getValueWithUnit(item.main.humidity, humidityUnit);
  let feels_like = getTemperature(item.main.feels_like);
  let wind = getValueWithUnit(item.wind.speed, windUnit);

  renderDetailsItem('feelslike', feels_like);
  renderDetailsItem('humidity', humidity);
  renderDetailsItem('pressure', pressure);
  renderDetailsItem('wind', wind);
}

function renderDetailsItem(className, value) {
  let container = document.querySelector(`.${className}`).querySelector('.details__value');
  container.innerHTML = value;
}

function isDay(data) {
  let sunrise = data.city.sunrise * 1000;
  let sunset = data.city.sunset * 1000;

  let now = Date.now();
  return (now > sunrise && now < sunset);
}

function renderDayOrNight(data) {
  let attrName = isDay(data) ? 'day':'night';
  transition();
  document.documentElement.setAttribute('data-theme', attrName);
}

function periodicTasks() {
  setInterval(start, 6000000);
  setInterval(function() {
    renderDayOrNight(currentData);
  }, 60000);
}

function start(url) {
  getData(url).then(data => {
    currentData = data;
    render(data);
    periodicTasks();
  })
}

function transition() {
  document.documentElement.classList.add('transition');
  setTimeout(function() {
    document.documentElement.classList.remove('transition');
  }, 4000)
}

start(url);