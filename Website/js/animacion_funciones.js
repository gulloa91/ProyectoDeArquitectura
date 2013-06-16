// Programas:
// 1. Ciclo:
var programa1 = [["0", "MOV", "0, R0"], ["2", "MOV" ,"R0, R1"], ["4", "MOV", "2, R1"], ["6", "MOV", "R1, R2"], ["8", "ADD", "1, R0"], ["10", "MOV" ,"R0, R2"], ["12", "MUL", "R1, R0"], ["14", "MOV", "R1, R2"], ["16", "CMP", "256, R0"], ["18", "BLE", "8"], ["8", "ADD", "1, R0"], ["10", "MOV" ,"R0, R2"], ["12", "MUL", "R1, R0"], ["14", "MOV", "R1, R2"], ["16", "CMP", "256, R0"], ["18", "BLE", "8"], ["8", "ADD", "1, R0"], ["10", "MOV" ,"R0, R2"], ["12", "MUL", "R1, R0"], ["14", "MOV", "R1, R2"], ["16", "CMP", "256, R0"], ["18", "BLE", "8"], ["8", "ADD", "1, R0"], ["10", "MOV" ,"R0, R2"], ["12", "MUL", "R1, R0"], ["14", "MOV", "R1, R2"], ["16", "CMP", "256, R0"], ["18", "BLE", "8"], ["8", "ADD", "1, R0"], ["10", "MOV" ,"R0, R2"], ["12", "MUL", "R1, R0"], ["14", "MOV", "R1, R2"], ["16", "CMP", "256, R0"], ["18", "BLE", "8"], ["8", "ADD", "1, R0"], ["10", "MOV" ,"R0, R2"], ["12", "MUL", "R1, R0"], ["14", "MOV", "R1, R2"], ["16", "CMP", "256, R0"], ["18", "BLE", "8"], ["8", "ADD", "1, R0"], ["10", "MOV" ,"R0, R2"], ["12", "MUL", "R1, R0"], ["14", "MOV", "R1, R2"], ["16", "CMP", "256, R0"], ["18", "BLE", "8"], ["20", "STP", "0"]];

var play = false;

// Main
$(document).ready(function(){
	$(".div_animacion").hide();
});

function reproducir_animacion(){
	if( !play ) { // Reproducir
		play = true;
		$("#btnReproducir").html("Parar <i class='icon-pause'></i>");
		reproduccion();
		
	} else { // Parar
		play = false;
		$("#btnReproducir").html("Reproducir <i class='icon-play'></i>");
	}	
}

function reproduccion(){
	cargar_instruccion();
	
	if( play ) {
		setTimeout(function() {
			var startTime = (new Date()).getTime();
			if( play ) {
				reproduccion();
			}
		}, 1000);
	}
}

function crearTabla( tam ){
	var tabla = $("#tabla_dinamica");
	tabla.empty();
	var rows = "<tr><th>Pos.</th><th>Direccion</th><th>Instr.</th></tr>";
	for(var i = 0; i < tam; i ++) {
		rows += "<tr><td>" + i + "</td><td id='dir_"+ i +"'>-</td><td id='inst_"+ i +"'>-</td></tr>";
	}
	tabla.append(rows);
}

function volverAEmpezar(){
	borrar_instrucciones();
	$(".div_animacion").hide("slide", {direction: "down"}, 800,function() { 
		$(".div_parametros").show("slide", {direction: "up"}, 800);
	});
	$("#tam_cache").attr("disabled", false);
	$("#tam_bloque").attr("disabled", false);
}

function empezarAnimacion(){
	$("#tam_cache").attr("disabled", true);
	$("#tam_bloque").attr("disabled", true);
	$(".div_parametros").hide("slide", {direction: "up"}, 800,function() { 
		$(".div_animacion").show("slide", {direction: "down"}, 800);
	});
	crearTabla( $("#tam_cache").val() );
	$("#tam_cache").change(function(){
		crearTabla( $(this).val() );
	});
}

function cargar_instruccion(){
	try {
		var paso = parseInt( $("#paso").text() );
		var valoresInstruccion = programa1[paso][2];
		var instruccion = programa1[paso][1];
		var direccion = programa1[paso][0];
		var espacioVacio = primerEspacioVacio();
		
		if( $("#instrucciones").val() == ""  ) { // Existe instrucción
			$("#instrucciones").val(instruccion + " " + valoresInstruccion);
			analizarInstruccion( espacioVacio, direccion, instruccion );
		} else {
			$("#instrucciones").val( $("#instrucciones").val() + "\n" + instruccion + " " + valoresInstruccion );
			analizarInstruccion( espacioVacio, direccion, instruccion );
		}
		var ta = document.getElementById('instrucciones');
		ta.scrollTop = ta.scrollHeight;
		
		$("#paso").text( parseInt($("#paso").text()) + 1 );	
	} catch (e) {  // Terminó el programa
		play = false;
		$("#btnReproducir").html("Reproducir <i class='icon-play'></i>");
	}
}

function borrar_instrucciones(){
	borrarValoresTabla();
	cacheColoresOriginales();
	$("#paso").text("0");
	$("#hits").text("0");
	$("#ratio").text("0%");
	$("#instrucciones").val("");
	play = false;
	$("#btnReproducir").html("Reproducir <i class='icon-play'></i>");
}

function analizarInstruccion( espacioVacio, direccion, instruccion ){
	cacheColoresOriginales();
	if( espacioVacio != -1 ) { // Existe un espacio vacío en Cache
		$("#dir_" + espacioVacio).text( direccion );
		$("#inst_" + espacioVacio).text( instruccion );
		
	} else { // Aplicar algoritmo para buscar un espacio
		var indice = estaEnCache(direccion);
		if( indice != -1 ) { // Está en Cache
			var hits = parseInt( $("#hits").text() );
			var pasos = parseInt( $("#paso").text() );
			hits = ++hits;
			$("#hits").text( hits );
			$("#ratio").text( (hits/pasos) * 100 );
			$("#dir_" + indice).css({ 
				"background": "#3A87AD",
				"color":"#FFF"
			});
			$("#inst_" + indice).css({ 
				"background": "#3A87AD",
				"color":"#FFF"
			});
			
		} else { // No está en Cache, añadir
			indice = posicionAleatoria();
			$("#dir_" + indice).text( direccion );
			$("#dir_" + indice).css({ 
				"background": "#414141",
				"color":"#FFF"
			});
			$("#inst_" + indice).text( instruccion );
			$("#inst_" + indice).css({ 
				"background": "#414141",
				"color":"#FFF"
			});
		}
	}
}

function borrarValoresTabla(){
	var pasos = parseInt( $("#paso").text() );
	for( var i = 0; i < pasos; i++ ){
		$("#dir_" + i).text( "-" );
		$("#inst_" + i).text( "-" );
	}
}

function cacheColoresOriginales(){
	var pasos = parseInt( $("#paso").text() );
	for( var i = 0; i < pasos; i++ ){
		$("#dir_" + i).css({ 
			"background": "none",
			"color":"#000"
		});
		$("#inst_" + i).css({ 
			"background": "none",
			"color":"#000"
		});
	}
}

/******************  BÚSQUEDAS *****************/
// Buscar direccion en Cache
function estaEnCache( direccion ) {
	var pasos = parseInt( $("#paso").text() );
	var esta = -1;
	for( var i = 0; i < pasos; i++ ){
		if( $("#dir_" + i).text() == direccion ) { // Encontrado
			esta = i;
			break;
		}
	}
	return esta;
}

// Primer espacio vacío en orden
function primerEspacioVacio(){
	var espacios = $("#tam_cache").val();
	var index = -1;
	for( var i = 0; i < espacios; i++ ){
		if( $("#dir_" + i).text() == "-" ) {  // Espacio en blanco
			index = i;
			break;
		}
	}
	return index;
}

// Escoger posición aleatoria:
function posicionAleatoria() {
	var rango = $("#tam_cache").val();
	// Retorna de 0 a Rango
	return Math.floor( ( Math.random() * rango ));
}