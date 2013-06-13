  /** Globales: **/
  var colorCuadroMemoria = "#3F7E3F";
  var colorCuadroCPU = "#3F7E3F";
  
  window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
	  window.setTimeout(callback, 1000 / 60);
	};
  })();

  /** Dibujar Rectángulo **/
  function dibujarRectangulo(miRect, context, color) {
	context.beginPath();
	context.rect(miRect.x, miRect.y, miRect.width, miRect.height);
	context.fillStyle = color;
	context.fill();
	context.lineWidth = miRect.borderWidth;
	context.strokeStyle = 'black';
	context.stroke();
	
  }
  
  /** Etiquetas **/
  function dibujarEtiquetas(context){
	context.font = "bold 12px sans-serif";
	context.fillStyle = 'black';
	context.fillText("CPU", 277.5, 35);
	context.fillText("Memoria", 267.5, 235);
  }
  
  /** Rectángulos estáticos **/
  function dibujarRectangulo(x, y, miRectEstatico, context, color){
	context.beginPath();
	context.rect(x, y, miRectEstatico.width, miRectEstatico.height);
	context.fillStyle = color;
    context.fill();
	context.lineWidth = miRectEstatico.borderWidth;
	context.strokeStyle = 'black';
	context.stroke();
  }
  
  /** Animar Rectángulo **/
  function animate(miRect, miRectEstatico, canvas, context, startTime) {
	/*
	// update
	var time = (new Date()).getTime() - startTime;
	var amplitude = 150;

	// in ms
	var period = 2000;
	var centerX = canvas.width / 2 - miRect.width / 2;
	var nextX = amplitude * Math.sin(time * 2 * Math.PI / period) + centerX;
	miRect.x = nextX;
*/
	// clear
	context.clearRect(0, 0, canvas.width, canvas.height);

	// draw
	//dibujarRectangulo(miRect, context, "#3F7E3F");
	dibujarRectangulo(250, 10, miRectEstatico, context, colorCuadroCPU);
	dibujarRectangulo(250, 210, miRectEstatico, context, colorCuadroMemoria);
	dibujarEtiquetas(context);

	// request new frame
	requestAnimFrame(function() {
	  animate(miRect, canvas, context, startTime);
	});
  }
  
  /** Dibuja lo inicial, espera un momento y empieza a animar **/
  $(document).ready(function(){
	  var canvas = document.getElementById('animacion');
	  var context = canvas.getContext('2d');

	  var miRect = {
		x: 250,
		y: 10,
		width: 80,
		height: 40,
		borderWidth: 2
	  };
	  
	  // Memoria, Cache y CPU
	  var miRectEstatico = {
		width: 80,
		height: 40,
		borderWidth: 2
	  }

	  //dibujarRectangulo(miRect, context, "#3F7E3F");
	  dibujarRectangulo(250, 10, miRectEstatico, context, colorCuadroCPU);
	  dibujarRectangulo(250, 210, miRectEstatico, context, colorCuadroMemoria);
	  dibujarEtiquetas(context);

	  // wait one second before starting animation
	  setTimeout(function() {
		var startTime = (new Date()).getTime();
		animate(miRect, miRectEstatico,canvas, context, startTime);
	  }, 1000);
  });