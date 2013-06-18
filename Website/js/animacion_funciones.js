// Programas:
// 1. Ciclo - 6 iteraciones:
var programa1 = [["0", "MOV", "0, R0"], ["2", "MOV" ,"R0, R1"], ["4", "MOV", "2, R1"], ["6", "MOV", "R1, R2"], ["8", "ADD", "1, R0"], ["10", "MOV" ,"R0, R2"], ["12", "MUL", "R1, R0"], ["14", "MOV", "R1, R2"], ["16", "CMP", "256, R0"], ["18", "BLE", "8"], ["8", "ADD", "1, R0"], ["10", "MOV" ,"R0, R2"], ["12", "MUL", "R1, R0"], ["14", "MOV", "R1, R2"], ["16", "CMP", "256, R0"], ["18", "BLE", "8"], ["8", "ADD", "1, R0"], ["10", "MOV" ,"R0, R2"], ["12", "MUL", "R1, R0"], ["14", "MOV", "R1, R2"], ["16", "CMP", "256, R0"], ["18", "BLE", "8"], ["8", "ADD", "1, R0"], ["10", "MOV" ,"R0, R2"], ["12", "MUL", "R1, R0"], ["14", "MOV", "R1, R2"], ["16", "CMP", "256, R0"], ["18", "BLE", "8"], ["8", "ADD", "1, R0"], ["10", "MOV" ,"R0, R2"], ["12", "MUL", "R1, R0"], ["14", "MOV", "R1, R2"], ["16", "CMP", "256, R0"], ["18", "BLE", "8"], ["8", "ADD", "1, R0"], ["10", "MOV" ,"R0, R2"], ["12", "MUL", "R1, R0"], ["14", "MOV", "R1, R2"], ["16", "CMP", "256, R0"], ["18", "BLE", "8"], ["8", "ADD", "1, R0"], ["10", "MOV" ,"R0, R2"], ["12", "MUL", "R1, R0"], ["14", "MOV", "R1, R2"], ["16", "CMP", "256, R0"], ["18", "BLE", "8"], ["8", "ADD", "1, R0"], ["10", "MOV" ,"R0, R2"], ["12", "MUL", "R1, R0"], ["14", "MOV", "R1, R2"], ["16", "CMP", "256, R0"], ["18", "BLE", "8"], ["20", "STP", "0"]];

var play = false;
var pasosArray = new Array(); // Para estadísticas
var hitsArray = new Array();

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
	if( $("#tam_bloque").val() == 1 ) { // Bloque 1 Word
		tabla.empty();
		var rows = "<tr><th>Pos.</th><th>Direccion</th><th>Instr.</th></tr>";
		for(var i = 0; i < tam; i ++) {
			rows += "<tr><td>" + i + "</td><td id='dir_"+ i +"'>-</td><td id='inst_"+ i +"'>-</td></tr>";
		}
		tabla.append(rows);
		
	} else { // Bloque 4 Words
		tabla.empty();
		var rows = "<tr><th>Tag</th><th>Direccion</th><th>Instr.</th></tr>";
		for(var i = 0; i < tam; i ++) {
			rows += "<tr><td>-</td><td id='dir_"+ i +"'>-</td><td id='inst_"+ i +"'>-</td></tr>";
		}
		tabla.append(rows);
	}
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
		pasosArray.push( parseInt( paso ) );
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
		hitsArray.push(0);
		mostrarEstadisticas();
	}
}

function mostrarEstadisticas(){
	with(jstat){
		var x = pasosArray;
		var y = hitsArray;
		plot(x,y,{
			main: 'My first jStat graph'
		});
	};
}

function borrar_instrucciones(){
	borrarValoresTabla();
	cacheColoresOriginales();
	$("#paso").text("0");
	$("#hits").text("0");
	$("#ratio").text("0");
	$("#instrucciones").val("");
	play = false;
	$("#btnReproducir").html("Reproducir <i class='icon-play'></i>");
	pasosArray = new Array(); // Para estadísticas
	hitsArray = new Array();
}

function analizarInstruccion( espacioVacio, direccion, instruccion ){
	cacheColoresOriginales();
	if( espacioVacio != -1 && estaEnCache(direccion) == -1 ) { // Existe un espacio vacío en Cache
		//$("#dir_" + espacioVacio).text( direccion );
		//$("#inst_" + espacioVacio).text( instruccion );
		agregarBloquesEnCacheConVacio( $("#tam_bloque").val(), espacioVacio, direccion, instruccion ); // Optimización
		hitsArray.push(0);
		
	} else { // Aplicar algoritmo para buscar un espacio
		var indice = estaEnCache(direccion);
		if( indice != -1 ) { // Está en Cache
			var hits = parseInt( $("#hits").text() );
			var pasos = parseInt( $("#paso").text() );
			hits = ++hits;
			$("#hits").text( hits );
			$("#ratio").text( (hits/pasos) * 100 );
			hitsArray.push(hits);
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
			/*
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
			*/
			hitsArray.push(0);
			agregarBloquesEnCacheSinVacio( $("#tam_bloque").val(), indice, direccion, instruccion )
		}
	}
}

function borrarValoresTabla(){
	var pasos = $("#tam_cache").val();
	for( var i = 0; i < pasos; i++ ){
		$("#dir_" + i).text( "-" );
		$("#inst_" + i).text( "-" );
	}
}

function cacheColoresOriginales(){
	var pasos = $("#tam_cache").val();
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

/***************** FUNCIONES OPTIMIZACIÓN **************/
// Con espacio vacío
function agregarBloquesEnCacheConVacio( tam, espacioVacio, direccion, instruccion ) {
	var paso = parseInt( $("#paso").text() ) + 1;
	
	// Agregar primer bloque
	$("#dir_" + espacioVacio).text( direccion );
	$("#inst_" + espacioVacio).text( instruccion );
	
	// Agregar siguientes bloques
	for( var i = 1; i < tam; i++ ) {
		espacioVacio = ++espacioVacio;
		
		$("#dir_" + espacioVacio).text( programa1[paso][0] ).css({ 
			"background": "#414141",
			"color":"#FFF"
		});;
		$("#inst_" + espacioVacio).text( programa1[paso][1] ).css({ 
			"background": "#414141",
			"color":"#FFF"
		});;
		
		paso = ++paso;
	}
}

// Sin espacio vacío
function agregarBloquesEnCacheSinVacio( tam, indice, direccion, instruccion ) {
	var paso = parseInt( $("#paso").text() );
	
	// Primero buscar posicion inicial:
	while( (indice % tam) != 0 ) { // No es límite
		indice = --indice;
	}
	
	// Agregar bloques
	for( var i = 0; i < parseInt(tam); i++ ) {
		
		$("#dir_" + indice).text( programa1[paso][0] ).css({ 
			"background": "#414141",
			"color":"#FFF"
		});;
		$("#inst_" + indice).text( programa1[paso][1] ).css({ 
			"background": "#414141",
			"color":"#FFF"
		});;
		
		paso = ++paso;
		indice = ++indice;
	}
}

/******************  BÚSQUEDAS *****************/
// Buscar direccion en Cache
function estaEnCache( direccion ) {
	var pasos = getCacheElementQty();
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

function getCacheElementQty(){
	var espacios = $("#tam_cache").val();
	var cnt = 0;
	for( var i = 0; i < espacios; i++ ){
		if( $("#dir_" + i).text() != "-" ) {
			cnt = ++cnt;
		} else {
			break;
		}
	}
	return cnt;
}