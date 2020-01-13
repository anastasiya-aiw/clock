var hours = new Date().getHours();
var minutes = new Date().getMinutes();
var seconds = new Date().getSeconds();

var i = 0;
var CColor = "#383840"; //Цвет стрелок
var CBackground = "honeydew"; //Цвет фона
//var CSeconds = "#D14"; //Цвет секундной стрелки
var CFont = "bold 1.2rem Roboto"; //шрифт цифр
var CSize = 300; //Размер поля
var CCenter = CSize / 2; //Радиус круга
var CTSize = CCenter - 10; //Расстояние от центра где рисуются отметки минут
var CMSize = CTSize * 0.7; //Длинна минутной стрелки
var CSSize = CTSize * 0.8; //Длинна секундной стрелки
var CHSize = CTSize * 0.6; //Длинна часовой стрелки
var analogClock;

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
	//Стираем предыдущие стрелки
	ctxcircle(CCenter, CCenter, CSSize, CBackground);

	//Вычисляем поворот
	i = 360/3600 * ((minutes*60) + seconds);
	//Рисуем стрелку
	ctxline(CCenter, CCenter, CMSize, ((i-90) / 180 * Math.PI), CColor, 4);//Минутная

	i = 360/720*((hours*60) + minutes);
	ctxline(CCenter, CCenter, CHSize, ((i-90) / 180 * Math.PI), CColor, 5);// Часовая

	ctxcircle(CCenter, CCenter, 9, CColor);//Круг от стрелки

	//i = 360/(60*1000)* ((new Date().getSeconds()*1000) + new Date().getMilliseconds());
	//ctxline(CCenter, CCenter, CSSize, ((i-90) / 180 * Math.PI), CSeconds, 3);//Секундная
	//ctxcircle(CCenter, CCenter, 6, CSeconds);//Круг от секундной стрелки
}
window.onload = function () {
	analogClock = document.getElementById("analogclock"), ctx = analogClock.getContext('2d');
	ctx.fillStyle = CBackground;
	ctx.fillRect(0, 0, analogClock.width, analogClock.height);
  ctx.font = CFont;
  ctx.textBaseline = "middle";
  ctx.textAlign = 'center';

  //var x = Math.round(analogClock.width/2);
  //var y = Math.round(analogClock.height/2);
  //var r = Math.round(Math.min(x,y)-2);
  //var delta = Math.max(8, Math.round(r/10));
  //delta = 10;

	for(iv=0; iv<12; iv++) { // Рисуем часовые метки
		i = 360/12*iv;
    //var r1 = delta;
    //if (iv>=5) r1 = -delta;
    x1 = (CCenter + (CTSize * Math.cos((i-90) / 180 * Math.PI)));
    y1 = (CCenter + (CTSize * Math.sin((i-90) / 180 * Math.PI)));

		ctxcircle(x1, y1, 5, CColor);
/*
    if (iv==0) { //вывести цифры по часовому кругу
      ctx.fillText('12', x1, y1);
    } else {
      ctx.fillText(''+iv, x1, y1);
    }
*/
	}

	for(iv=0; iv<60; iv++){// Рисуем минутные метки
		i = 360/60*iv;
    x1 = (CCenter + (CTSize * Math.cos((i-90) / 180 * Math.PI)));
    y1 = (CCenter + (CTSize * Math.sin((i-90) / 180 * Math.PI)));
		ctxcircle(x1, y1, 2, CColor);
	}

	setInterval('tick(); ', 10);
}
