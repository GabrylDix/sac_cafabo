$(document).ready(function () {
    prueba();
    // console.


    $("#boton").on("click", function(){
        funcion();
    })

    function funcion(){
        parametros = { backend: "revertir_asiento_contable", 
                    id_asiento: 16,
                    periodo: '02510'};
        //TOMAMOS EL ARCHIVO DEL FORMULARIO
        let inputFile = document.getElementById("archivo");
        let file = inputFile.files[0];
        let form_data = new FormData();
        //AGREGAMOS EL ARCHIVO Y LOS DATOS DEL DATASTRING CODIFICADO EN JSON
        form_data.append("archivo", file);
        form_data.append("datos", JSON.stringify(parametros));

        $.ajax({
            url: 'app/Controllers/Presentaciones/Presentaciones_backend.php',
            type: 'POST',
            dataType: "json",
            processData: false,
            contentType: false, 
            data: form_data,
            success: function(response) {
                console.log(response);
            }
        });
    }

    function prueba(){
        let parametros = {
            backend: 'eliminar_lote',
            id_lote: 3
        }

        $.ajax({
            url: 'app/Controllers/Tesoreria/Lotes_backend.php',
            type: 'POST',
            dataType: "json",
            data: parametros,
            success: function(response) {
                console.log(response);
            }
        });
    }
});