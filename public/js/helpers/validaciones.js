var Validaciones = {
    validarFormulario: function validarFormulario(form, btnValidar, funcion) {
        if (form.length > 0 && btnValidar.length > 0) {
            // Agrega el evento input para verificar los campos válidos en tiempo real
            form.find("input, select").on("input", function () {
                // Verificar si el campo es válido
                if ($(this).is(":valid")) {
                    $(this).addClass("is-valid").removeClass("is-invalid");
                } else {
                    $(this).addClass("is-invalid").removeClass("is-valid");
                }
            });

            btnValidar.on("click", function (event) {
                event.preventDefault(); // Previene la recarga de la página
                event.stopPropagation(); // Detiene la propagación del evento
                // Verifica si el formulario es válido antes de enviarlo
                if (!form[0].checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    event.preventDefault();
                    console.log("todo correcto");
                    // actualizar_datos();
                    funcion();
                }

                form.addClass("was-validated");
            });
        }
    },

    input_solo_numerico: function input_solo_numerico(id_input) {
        $(`#${id_input}`).on("input", function () {
            var inputValue = $(this).val();
            var numericValue = inputValue.replace(/[^0-9]/g, ""); // Elimina todo lo que no sea un número
            $(this).val(numericValue);
        });
    },

    input_solo_texto: function input_solo_texto(id_input) {
        $(`#${id_input}`).on("input", function () {
            var inputValue = $(this).val();
            var textValue = inputValue.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, ""); // Elimina todo lo que no sea texto
            $(this).val(textValue);
        });
    },
};

// Exponer la función globalmente
window.Validaciones = Validaciones;

// PARA USAR LA VALIDACION INCLUIR ESTE SCRIPT EN EL JS QUE SE QUIERA USAR

// /** Clase para validar los formularios
//  * @author Franco Falk
//  * @type {Validaciones}
//  */
// const ClassValidaciones = window.Validaciones;
