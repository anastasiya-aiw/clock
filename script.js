var timerId;

var date;
var timezone;
var pm = 1;

var months_arr = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
var errors = document.getElementById('errors');

var i = 0;
var CColor = "#383840"; //Цвет стрелок
var CBackground = "honeydew"; //Цвет фона
var CFont = "bold 1.2rem Roboto"; //шрифт цифр
var CSeconds = "#D14"; //Цвет секундной стрелки
var CSize = 300; //Размер поля
var CCenter = CSize / 2; //Радиус круга
var CTSize = CCenter - 10; //Расстояние от центра где рисуются отметки минут
var CMSize = CTSize * 0.7; //Длина минутной стрелки
var CSSize = CTSize * 0.8; //Длина секундной стрелки
var CHSize = CTSize * 0.6; //Длина часовой стрелки
var analogClock;


// init: get date&time from site
var currentTimezoneURL = "https://worldtimeapi.org/api/ip";
var getJSON = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};
function clockStart(URL){
  getJSON(URL,
      function(err, data) {
        if (err !== null) {
          errors.innerHTML = 'Something went wrong: ' + err;
        } else {
          var a = data.datetime.split(/[^0-9]/);
          var d = new Date(a[0],a[1]-1,a[2],a[3],a[4],a[5]);
          var datetime = new Date(d.toString());

          date = datetime;
          timezone = data.timezone;

          update();

          timerId = setTimeout(function(){
            clockStart(URL);
          }, 60000);
        }
      }
    );
}
clockStart(currentTimezoneURL);

function update(){
  updateTime();
  updateDate();
}

/* вывод текущего времени */
function updateTime() {
    var clock = document.getElementById('clock');

    if (pm == 1){
      var hours = date.getHours();
    } else {
      var hours = date.getHours() % 12;
      hours = hours ? hours : 12;
    }
    if (hours < 10) hours = '0' + hours;
    clock.children[0].innerHTML = hours;

    var minutes = date.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    clock.children[1].innerHTML = minutes;
}

/* вывод текущей даты */
function updateDate() {
  var dateToday = document.getElementById('today');

  var year = date.getFullYear();
  var month = months_arr[date.getMonth()];
  var day = date.getDate();

  dateToday.innerHTML = day + ' ' + month + ' ' + year;
}

/**********************************************************/
/* переключить формат отображения 12/24 */
var checkbox = document.getElementById('pm'),
    checkboxLabel = checkbox.nextElementSibling;
checkbox.addEventListener("change", changePmFormat, false);
function changePmFormat(){
  var isChecked = checkbox.checked;
  if (isChecked) {
    pm = 1;
    checkbox.value = "1";
    checkbox.checked = true;
    checkboxLabel.innerHTML = "24-часовой формат";
  } else {
    pm = 0;
    checkbox.value = "0";
    checkbox.checked = false;
    checkboxLabel.innerHTML = "12-часовой формат";
  }

  updateTime();
}

/* изменить город+часовой пояс */
var timezoneURL = "http://worldtimeapi.org/api/timezone/";
var selectCity = document.getElementById('city');
selectCity.addEventListener("change", changeCity, false);
function changeCity(){
  clearTimeout(timerId);

  var val = selectCity.options[selectCity.selectedIndex].value;
  if (val != '') {
    timezone = val;
    var newURL = timezoneURL + timezone;
    clockStart(newURL);
  } else {
    timezone = '';
    clockStart(currentTimezoneURL);
  }
}

/* переключиться на аналоговые часы */
var switchAnalogTab = document.getElementById('tabs__tab2');
switchAnalogTab.addEventListener("change", showAnalogClock, false);
function showAnalogClock(){
  analogClock = document.getElementById("analogclock"), ctx = analogClock.getContext('2d');
	ctx.fillStyle = CBackground;
	ctx.fillRect(0, 0, analogClock.width, analogClock.height);
  ctx.font = CFont;
  ctx.textBaseline = "middle";
  ctx.textAlign = 'center';

	for(iv=0; iv<12; iv++) { // Рисуем часовые метки
		i = 360/12*iv;
    x1 = (CCenter + (CTSize * Math.cos((i-90) / 180 * Math.PI)));
    y1 = (CCenter + (CTSize * Math.sin((i-90) / 180 * Math.PI)));

		ctxcircle(x1, y1, 5, CColor);
	}

	for(iv=0; iv<60; iv++){// Рисуем минутные метки
		i = 360/60*iv;
    x1 = (CCenter + (CTSize * Math.cos((i-90) / 180 * Math.PI)));
    y1 = (CCenter + (CTSize * Math.sin((i-90) / 180 * Math.PI)));
		ctxcircle(x1, y1, 2, CColor);
	}

	setInterval('tick(); ', 10);
}

/**********************************************************/
/* analog */
function ctxline(x1, y1, len, angle, color, wid){//Функция рисования линии под углом
	var x2 = (CCenter + (len * Math.cos(angle)));
	var y2 = (CCenter + (len * Math.sin(angle)));
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.lineWidth = wid;
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

function ctxcircle(x, y, rd, color){//Функция рисования круга
	ctx.beginPath();
	ctx.arc(x, y, rd, 0, 2*Math.PI, false);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.strokeStyle = color;
	ctx.stroke();
}

function tick(){ //Функция рисования стрелок
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

	//Стираем предыдущие стрелки
	ctxcircle(CCenter, CCenter, CSSize, CBackground);

	//Вычисляем поворот
	i = 360/3600 * ((minutes*60) + seconds);
	//Рисуем стрелку
	ctxline(CCenter, CCenter, CMSize, ((i-90) / 180 * Math.PI), CColor, 4);//Минутная

	i = 360/720*((hours*60) + minutes);
	ctxline(CCenter, CCenter, CHSize, ((i-90) / 180 * Math.PI), CColor, 5);// Часовая

	ctxcircle(CCenter, CCenter, 9, CColor);//Круг от стрелки
}
