$(document).ready(function () {
    const $form = $("#formImport_nuevaPresent");
    const $btn = $("#btnGuardar_nuevaPresent");
    const $periodo = $("#periodo_pres_select");
    const $convenio = $("#convenio_pres_select");
    const $uploadArea = $("#fileUploadArea");
    const $fileInput = $("#fileInput_pres");
    const $tablaErrores = $("#datatable_errorFile_pres");
    const textoBoton = $("#importBtnText").html();
    let selectedFile = null;
    let choicesConvenio = null;
    let convenioSeleccionado = null;
    let conveniosCache = [];
    let busquedaPendiente = null;
    let solicitudBusqueda = null;
    let solicitudConvenio = null;
    let timeoutBusqueda = null;
    let importando = false;

    if (typeof Choices !== "undefined") {
        choicesConvenio = new Choices($convenio[0], {
            searchEnabled: true,
            searchChoices: false,
            searchFloor: 0,
            searchResultLimit: 10,
            searchPlaceholderValue: "Buscar convenio...",
            itemSelectText: "Seleccionar",
            noResultsText: "No se encontraron convenios",
            noChoicesText: "Escriba para buscar convenios",
            shouldSort: false,
            position: "bottom",
            removeItemButton: false,
        });
        $(choicesConvenio.containerOuter.element).addClass("saf-choices convenio-choices");
    }

    const $anio = $("#anio_pres_select");
    const anioActual = new Date().getFullYear();
    $anio.append('<option value="" disabled selected>Seleccione un año</option>');
    for (let i = 0; i < 3; i++) {
        const anio = anioActual - i;
        $anio.append($("<option>").val(String(anio).slice(-2)).text(anio));
    }

    buscarConvenios("");
    validarFormulario();

    $convenio.on("search", function (event) {
        const termino = String(event.detail?.value || "").trim();
        clearTimeout(timeoutBusqueda);
        busquedaPendiente = termino;
        if (solicitudBusqueda) solicitudBusqueda.abort();
        timeoutBusqueda = setTimeout(function () {
            buscarConvenios(termino);
        }, 250);
    });

    $convenio.on("change", function () {
        const idConvenio = $convenio.val();
        convenioSeleccionado = null;
        if (solicitudConvenio) solicitudConvenio.abort();
        actualizarPeriodo(null);
        validarFormulario();
        if (!idConvenio) return;

        $periodo.find("option").text("Cargando período...");
        solicitudConvenio = $.ajax({
            url: "app/Controllers/Convenios/Convenios_backend.php",
            type: "POST",
            dataType: "json",
            data: { backend: "extraer_convenio", id_convenio: idConvenio },
        }).done(function (response) {
            if (String($convenio.val()) !== String(idConvenio)) return;
            if (response.success && ["1", "2"].includes(String(response.data?.datos?.tipo_cierre))) {
                convenioSeleccionado = response.data.datos;
                actualizarPeriodo(convenioSeleccionado.tipo_cierre);
            } else {
                actualizarPeriodo(null);
                $("#periodoHelp").text("No se pudo obtener el tipo de período. Seleccione nuevamente el convenio.");
            }
            validarFormulario();
        }).fail(function (_xhr, estado) {
            if (estado === "abort") return;
            actualizarPeriodo(null);
            $("#periodoHelp").text("No se pudo obtener el tipo de período. Seleccione nuevamente el convenio.");
            validarFormulario();
        });
    });

    $("#periodo_pres_select, #mes_pres_select, #anio_pres_select").on("change", validarFormulario);

    $fileInput.on("change", function () {
        if (this.files.length) seleccionarArchivo(this.files[0]);
    });

    $uploadArea.on("dragenter dragover", function (event) {
        event.preventDefault();
        event.stopPropagation();
        $uploadArea.addClass("sac-import-upload--active");
    }).on("dragleave drop", function (event) {
        event.preventDefault();
        event.stopPropagation();
        $uploadArea.removeClass("sac-import-upload--active");
        if (event.type === "drop" && event.originalEvent.dataTransfer.files.length) {
            seleccionarArchivo(event.originalEvent.dataTransfer.files[0]);
        }
    });

    $("#removeFile_pres").on("click", function () {
        limpiarArchivo();
        $fileInput.trigger("focus");
    });

    $form.on("submit", function (event) {
        event.preventDefault();
        $form.addClass("was-validated");
        if (!validarFormulario() || !$form[0].checkValidity() || importando) return;

        Swal.fire({
            title: "¿Importar esta presentación?",
            text: "Verifique que el convenio y el período correspondan al archivo seleccionado.",
            icon: "question",
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: "Sí, importar",
            cancelButtonText: "Cancelar",
        }).then(function (resultado) {
            if (resultado.isConfirmed && validarFormulario() && !importando) importarPresentacion();
        });
    });

    function buscarConvenios(termino) {
        if (solicitudBusqueda) solicitudBusqueda.abort();
        busquedaPendiente = termino;
        solicitudBusqueda = $.ajax({
            url: "app/Controllers/Convenios/Convenios_backend.php",
            type: "POST",
            dataType: "json",
            data: { backend: "sugerencias_convenios", termino: termino },
        }).done(function (response) {
            if (busquedaPendiente !== termino) return;
            $("#convenioHelp").text("Escriba el nombre o código para buscar un convenio.");
            const seleccion = $convenio.val();
            const encontrados = Array.isArray(response) ? response : [];
            const actual = conveniosCache.find((item) => String(item.id_convenio) === String(seleccion));
            conveniosCache = actual && !encontrados.some((item) => String(item.id_convenio) === String(seleccion))
                ? [actual, ...encontrados] : encontrados;
            if (choicesConvenio) {
                choicesConvenio.setChoices([
                    { value: "", label: "Seleccione un convenio", selected: !seleccion, placeholder: true },
                    ...conveniosCache.map((item) => ({
                        value: String(item.id_convenio),
                        label: item.label || `${item.id_convenio} - ${item.nombre || ""}`,
                        selected: String(item.id_convenio) === String(seleccion),
                    })),
                ], "value", "label", true);
            } else {
                $convenio.empty().append($("<option>").val("").text("Seleccione un convenio"));
                conveniosCache.forEach((item) => {
                    $convenio.append($("<option>").val(String(item.id_convenio)).text(item.label || `${item.id_convenio} - ${item.nombre || ""}`));
                });
                $convenio.val(seleccion || "");
            }
        }).fail(function (_xhr, estado) {
            if (estado !== "abort") $("#convenioHelp").text("No se pudieron buscar convenios. Intente nuevamente.");
        });
    }

    function actualizarPeriodo(tipoCierre) {
        $periodo.empty().append($("<option>").val("").text(tipoCierre == null ? "Seleccione primero un convenio" : "Seleccione un período"));
        $periodo.prop("disabled", tipoCierre == null);
        $("#periodoHelp").text("Se determina según el convenio seleccionado.");
        if (tipoCierre == null) return;
        if (String(tipoCierre) === "1") {
            $periodo.append($("<option>").val("0").text("Mensual"));
            $periodo.val("0");
        } else {
            $periodo.append($("<option>").val("1").text("1.ª quincena"));
            $periodo.append($("<option>").val("2").text("2.ª quincena"));
        }
    }

    function limpiarArchivo() {
        selectedFile = null;
        $fileInput.val("");
        $("#selectedFileDisplay").addClass("d-none");
        $("#fileError").addClass("d-none").text("");
        validarFormulario();
    }

    function seleccionarArchivo(file) {
        limpiarArchivo();
        const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
        let error = "";
        if (![".xls", ".xlsx"].includes(extension)) error = "Seleccione un archivo XLS o XLSX.";
        else if (file.size === 0) error = "El archivo está vacío.";
        else if (file.size > 10 * 1024 * 1024) error = "El archivo supera el máximo de 10 MB.";

        if (error) {
            $("#fileError").text(error).removeClass("d-none");
            return;
        }
        selectedFile = file;
        $("#fileName").text(file.name);
        $("#fileSize_pres").text(file.size >= 1024 * 1024
            ? (file.size / (1024 * 1024)).toFixed(2) + " MB"
            : (file.size / 1024).toFixed(2) + " KB");
        $("#selectedFileDisplay").removeClass("d-none");
        validarFormulario();
    }

    function validarFormulario() {
        const pendientes = [];
        if (!$convenio.val()) pendientes.push("convenio");
        if (!convenioSeleccionado || !$periodo.val()) pendientes.push("período");
        if (!$("#mes_pres_select").val()) pendientes.push("mes");
        if (!$("#anio_pres_select").val()) pendientes.push("año");
        if (!selectedFile) pendientes.push("archivo");
        const valido = pendientes.length === 0;
        $btn.prop("disabled", !valido || importando);
        if (!importando) {
            $("#validationAlert").text(valido
                ? "Todo listo para importar. Revise los datos antes de confirmar."
                : "Para importar, complete: " + pendientes.join(", ") + ".");
        }
        return valido;
    }

    function importarPresentacion() {
        importando = true;
        $btn.prop("disabled", true);
        $("#importBtnText").html('<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Importando...');
        $("#validationAlert").text("Importando presentación, espere un momento...");
        $("#validationAlertTabla").addClass("d-none");
        $("#myAlert").modal("show");

        const periodo = `${$periodo.val()}${$("#anio_pres_select").val()}${$("#mes_pres_select").val()}`;
        const formData = new FormData();
        formData.append("backend", "importar_presentacion");
        formData.append("archivo", selectedFile);
        formData.append("id_convenio", $convenio.val());
        formData.append("periodo", periodo);

        $.ajax({
            url: "app/Controllers/Presentaciones/Presentaciones_backend.php",
            type: "POST",
            dataType: "json",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
        }).done(function (response) {
            const errores = response.errors ? Object.values(response.errors) : [];
            if (!response.success && errores.length) mostrarErrores(errores);
            Swal.fire({
                title: response.alert?.title || (response.success ? "Éxito" : "Error"),
                text: response.alert?.message || response.message,
                icon: response.alert?.icon || (response.success ? "success" : "error"),
                confirmButtonText: "Aceptar",
            }).then(function () {
                if (response.success) location.reload();
                else if (errores.length) $("#erroresImportTitle").trigger("focus");
            });
        }).fail(function () {
            Swal.fire("Error de conexión", "No se pudo comunicar con el servidor. Intente nuevamente.", "error");
        }).always(function () {
            $("#myAlert").modal("hide");
            importando = false;
            $("#importBtnText").html(textoBoton);
            validarFormulario();
        });
    }

    function mostrarErrores(errores) {
        $("#validationAlertTabla").removeClass("d-none");
        $tablaErrores.DataTable({
            destroy: true,
            data: errores,
            pageLength: 25,
            columns: [
                { title: "Código farmacia", data: "id_farmacia", className: "text-start", defaultContent: "", render: $.fn.dataTable.render.text() },
                { title: "Farmacia", data: "nombre_farmacia", defaultContent: "", render: $.fn.dataTable.render.text() },
                { title: "Importe 100 %", data: null, className: "text-end", render: function (data) {
                    return `<span class="d-block">OS: ${Formatos.formatoMoneda(Number(data.importe_100) || 0)}</span><span class="d-block">Cámara: ${Formatos.formatoMoneda(Number(data.importe_100_camara) || 0)}</span>`;
                } },
                { title: "A cargo OS", data: null, className: "text-end", render: function (data) {
                    return `<span class="d-block">OS: ${Formatos.formatoMoneda(Number(data.importe_os) || 0)}</span><span class="d-block">Cámara: ${Formatos.formatoMoneda(Number(data.importe_os_camara) || 0)}</span>`;
                } },
                { title: "Plan", data: "id_plan", className: "text-center", defaultContent: "", render: $.fn.dataTable.render.text() },
                { title: "Error", data: "error", className: "text-start", defaultContent: "", render: function (data, type) {
                    const mensaje = data == null ? "" : String(data);
                    if (type !== "display") return mensaje;
                    const $contenido = $('<span class="d-inline-flex align-items-start gap-2 fw-semibold text-danger">');
                    $contenido.append('<i class="bi bi-exclamation-circle-fill flex-shrink-0" aria-hidden="true"></i>');
                    $contenido.append($("<span>").text(mensaje));
                    return $contenido[0].outerHTML;
                } },
            ],
            language: { url: "public/json/Spanish.json", searchPlaceholder: "Buscar error..." },
            lengthMenu: [[25, 50, 100, -1], [25, 50, 100, "Todos"]],
            responsive: true,
            scrollX: false,
            info: false,
            order: [[0, "desc"]],
        });
    }
});
