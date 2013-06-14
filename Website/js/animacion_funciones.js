// Main
$(document).ready(function(){
	crearTabla( $("#tam_cache").val() );
	$("#tam_cache").change(function(){
		$("#tabla_dinamica").empty();
		crearTabla( $(this).val() );
	});
});

function crearTabla( tam ){
	var tabla = $("#tabla_dinamica");
	var rows = "";
	for(var i = 0; i < tam; i ++) {
		rows += "<tr><td>" + i + "</td></tr>";
	}
	tabla.append(rows);
}