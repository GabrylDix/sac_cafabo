const ClassValidaciones = window.Validaciones;
$(document).ready(function () {
    const datatableLiquidaciones = $("#datatable_list_liquidaciones");
    const listado_detalleLiq_tabla = $("#datatable_detalle_detalleLiq");
    const form_editarLiquidacion = $("#form_editarLiquidacion");
    const btnEditarLiquidacion = $("#btnConfirmarEditarLiquidacion");
    const estados_liquidacion_header = {
        PE: { text: "Pendiente", css: "header-statusLiq-PE" },
        AP: { text: "Aprobado", css: "header-statusLiq-AP" },
        LO: { text: "En Lote", css: "header-statusLiq-LO" },
        PA: { text: "Pagada", css: "header-statusLiq-PA" },
        EL: { text: "Eliminado", css: "header-statusLiq-EL" },
    };
    //const btnConfirmarEditarProveedor = $("#btnConfirmarEditarProveedor");
    extraer_liquidaciones_ajax();

    function cargar_tabla_liquidaciones(liquidaciones) {
        datatableLiquidaciones.DataTable({
            destroy: true,
            data: liquidaciones,
            columns: [
                { title: "Nro Liquidación", data: "id", className: "text-start align-middle" },
                {
                    title: "Convenio",
                    data: null,
                    className: "text-left",
                    render: function (data) {
                        return `<div class="ubicacion-cell">
                            <strong>${data.nombre_convenio}</strong>
                            <small class="d-block text-muted"> ID: ${data.convenio_id} </small>
                        </div>`;
                    },
                },
                {
                    title: "Porcentaje",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return `${data.porcentaje || 0}%`;
                    },
                },
                {
                    title: "Generacion",
                    data: null,
                    className: "text-left",
                    render: function (data) {
                        return `<div class="ubicacion-cell">
                            <strong>${data.usuario_creacion}</strong>
                            <small class="d-block text-muted"> Fecha: ${data.fecha_creacion} </small>
                        </div>`;
                    },
                },
                {
                    title: "Total",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return Formatos.formatoMoneda(data.total || 0);
                    },
                },
                {
                    title: "Estado",
                    data: null,
                    className: "text-center align-middle",
                    render: function (data) {
                        let estados = {
                            PE: { text: "Pendiente", className: "sac-status-modify" },
                            AP: { text: "Aprobada", className: "sac-status-active" },
                            LO: { text: "En Lote", className: "sac-status-view" },
                            PA: { text: "Pagada", className: "sac-status-active" },
                            EL: { text: "Eliminada", className: "sac-status-inactive" },
                        };
                        const estadoConfig = estados[data.estado] || {
                            text: data.estado || "Desconocido",
                            className: "sac-status-neutral",
                        };
                        return `<span class="sac-status-badge ${estadoConfig.className}">${estadoConfig.text}</span>`;
                    },
                },
                {
                    title: "Acciones",
                    data: null,
                    className: "text-center align-middle",
                    render: function (data) {
                        // Disponible en todos los estados
                        let botones = `
                            <button class="sac-btn-icon sac-btn-icon-sm sac-btn-view btn-ver" id="btnVer_liquidacion" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver liquidación">
                                <i class="ri-eye-fill"></i>
                            </button>`;

                        //Botones APROBAR y ELIMINAR
                        if (data.estado === "PE") {
                            botones += `
                            <button class="sac-btn-icon sac-btn-icon-sm sac-btn-activate btn-aprobar" id="btnAprobar_liquidacion" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Aprobar" aria-label="Aprobar liquidación">
                                <i class="ri-check-double-line"></i>
                            </button>
                            <button class="sac-btn-icon sac-btn-icon-sm sac-btn-delete btn-eliminar" id="btnEliminar_liquidacion" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar" aria-label="Eliminar liquidación">
                                <i class="ri-delete-bin-fill"></i>
                            </button>`;
                        }
                        return `<div class="sac-table-actions">
                            ${botones}
                        </div>`;
                    },
                },
            ],
            language: {
                url: "public/json/Spanish.json",
                searchPlaceholder: "Buscar Liquidaciones...",
            },
            drawCallback: function () {
                // Inicializar tooltips en elementos de la tabla
                $('[data-bs-toggle="tooltip"]').tooltip("dispose").tooltip();
            },
            responsive: true,
            iDisplayLength: 10,
            lengthMenu: [
                [10, 20, 50, -1],
                [10, 20, 50, "Todos"],
            ],
            order: [[0, "desc"]],
        });
    }

    $("#datatable_list_liquidaciones tbody").on("click", "button", function () {
        let opt = $(this).attr("id");
        let row = $(this).closest("tr");
        if (row.hasClass("child")) {
            // Si es hija, apuntamos a la fila anterior (la fila padre real)
            row = row.prev();
        }
        let liquidacion = datatableLiquidaciones.DataTable().row(row).data();

        switch (opt) {
            case "btnVer_liquidacion":
                extraer_datos_liquidacion_ajax(liquidacion["id"]);
                break;
            case "btnAprobar_liquidacion":
                Swal.fire({
                    title: "¿Estás seguro?",
                    text: `¿Deseas aprobar esta liquidacion?`,
                    icon: "question",
                    showCancelButton: true,
                    allowOutsideClick: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, aprobar",
                    cancelButtonText: "Cancelar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        aprobar_liquidacion_ajax(liquidacion["id"]);
                        //alert('Función de aprobar liquidación no implementada aún');
                    }
                });
                break;
            case "btnEliminar_liquidacion":
                Swal.fire({
                    title: "¿Estás seguro?",
                    text: `¿Deseas eliminar esta liquidacion?`,
                    icon: "question",
                    showCancelButton: true,
                    allowOutsideClick: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, eliminar",
                    cancelButtonText: "Cancelar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        eliminar_liquidacion_ajax(liquidacion["id"]);
                        //alert('Función de eliminar liquidación no implementada aún');
                    }
                });

                break;
        }
    });

    function cargar_modal_detalleLiquidacion(liquidacion) {
        let cabecera = liquidacion.cabecera;
        let detalle = liquidacion.detalle;
        const estadoConfig = estados_liquidacion_header[cabecera.estado] || { text: cabecera.estado, css: "bg-dark-gradient" };
        $("#modalDetalleLiquidacion .modal-header")
            .removeClass(function (index, className) {
                return (className.match(/(^|\s)header-statusLiq-\S+/g) || []).join(" ");
            })
            .addClass(estadoConfig.css);

        //Cabecera
        //Fila 1
        $("#liquidacionModalLabel").text("Liquidación de Convenio- " + estadoConfig.text);
        $("#nro_liquidacion_detalleLiq").text(cabecera.id);
        $("#convenio_detalleLiq").text(cabecera.nombre_convenio);
        $("#cantidadRecetas_detalleLiq").text(cabecera.cantidad_recetas || 0);
        $("#fechaCarga_detalleLiq").text(cabecera.fecha_creacion);
        //Fila 2
        $("#presentado_detalleLiq").text(Formatos.formatoMoneda(cabecera.presentado || 0));
        $("#recuperoGastos_detalleLiq").text(Formatos.formatoMoneda(cabecera.recupero_gastos || 0));
        $("#debito_detalleLiq").text(Formatos.formatoMoneda(cabecera.debitos || 0));
        $("#debitoOS_detalleLiq").text(Formatos.formatoMoneda(cabecera.debitos_os || 0));
        //Fila 3
        $("#creditoOS_detalleLiq").text(Formatos.formatoMoneda(cabecera.creditos_os || 0));
        $("#creditos_detalleLiq").text(Formatos.formatoMoneda(cabecera.creditos || 0));
        $("#porcLiq_detalleLiq").text(cabecera.porcentaje + "%");
        $("#total_detalleLiq").text(Formatos.formatoMoneda(cabecera.total || 0));
        //Detalle
        cargar_tabla_liquidacion_detalle(detalle);

        $("#modalDetalleLiquidacion").modal("show");
    }

    function cargar_tabla_liquidacion_detalle(liquidaciones) {
        listado_detalleLiq_tabla.DataTable({
            destroy: true,
            data: liquidaciones,
            pageLength: 25, // Mostrar 25 registros por página
            columns: [
                { title: "Codigo", data: "id", className: "text-start align-middle" },
                { title: "Nombre", data: "nombre", className: "text-center" },
                { title: "Cantidad Recetas", data: "cantidad_recetas", className: "text-center" },
                {
                    title: "Presentado",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return Formatos.formatoMoneda(data.presentado || 0);
                    },
                },
                {
                    title: "Recupero Gastos",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return Formatos.formatoMoneda(data.recupero_gastos || 0);
                    },
                },
                {
                    title: "Debitos",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return Formatos.formatoMoneda(data.debitos || 0);
                    },
                },
                {
                    title: "Creditos",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return Formatos.formatoMoneda(data.creditos || 0);
                    },
                },
                {
                    title: "Debitos OS",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return Formatos.formatoMoneda(data.debitos_os || 0);
                    },
                },
                {
                    title: "Creditos OS",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return Formatos.formatoMoneda(data.creditos_os || 0);
                    },
                },
                {
                    title: "Total",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return Formatos.formatoMoneda(data.total || 0);
                    },
                },
                {
                    title: "Acciones",
                    data: null,
                    className: "text-center align-middle",
                    render: function (data) {
                        return `<div class="sac-table-actions">
                            <button class="sac-btn-icon sac-btn-icon-sm sac-btn-view" id="btnVer_detalle_liquidacion" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver liquidación Farmacia" aria-label="Ver liquidación de farmacia">
                                <i class="ri-eye-fill"></i>
                            </button>
                        </div>`;
                    },
                },
            ],
            drawCallback: function () {
                // Inicializar tooltips en elementos de la tabla
                $('[data-bs-toggle="tooltip"]').tooltip("dispose").tooltip();
            },
            language: {
                url: "public/json/Spanish.json",
                searchPlaceholder: "Buscar Liquidación...",
            },
            lengthMenu: [
                [25, 50, 100, -1],
                [25, 50, 100, "Todos"],
            ],
            responsive: true,
            scrollX: false,
            sInfo: false,
            info: false,
            order: [[0, "asc"]],
        });
    }

    $("#datatable_detalle_detalleLiq tbody").on("click", "button", function () {
        let opt = $(this).attr("id");
        let row = $(this).closest("tr");
        if (row.hasClass("child")) {
            // Si es hija, apuntamos a la fila anterior (la fila padre real)
            row = row.prev();
        }
        let detalleLiquidacion = listado_detalleLiq_tabla.DataTable().row(row).data();
        switch (opt) {
            case "btnVer_detalle_liquidacion":
                alert("Función de ver detalle de liquidación no implementada aún");
                //extraer_datos_liquidacion_ajax(detalleLiquidacion['id']);
                break;
        }
    });
    //#### FUNCIONES AJAX #####
    function extraer_liquidaciones_ajax() {
        let dataString = { backend: "extraer_liquidaciones" };
        $("#myAlert").modal("show");
        $.ajax({
            data: dataString,
            url: "app/Controllers/Liquidaciones/Liquidaciones_backend.php",
            type: "POST",
            dataType: "JSON",
            success: function (response) {
                $("#myAlert").modal("hide");
                if (response.success) {
                    cargar_tabla_liquidaciones(response.data);
                } else {
                    Swal.fire({
                        title: response.alert.title,
                        text: response.alert.message,
                        icon: response.alert.icon,
                        allowOutsideClick: false,
                        confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
                        confirmButtonText: "Aceptar",
                    });
                }
            },
        });
    }
    function extraer_datos_liquidacion_ajax(id_liquidacion) {
        let dataString = { backend: "extraer_liquidacion", id_liquidacion: id_liquidacion };
        $("#myAlert").modal("show");
        $.ajax({
            data: dataString,
            url: "app/Controllers/Liquidaciones/Liquidaciones_backend.php",
            type: "POST",
            dataType: "JSON",
            success: function (response) {
                $("#myAlert").modal("hide");
                if (response.success) {
                    cargar_modal_detalleLiquidacion(response.data);
                } else {
                    Swal.fire({
                        title: response.alert.title,
                        text: response.alert.message,
                        icon: response.alert.icon,
                        allowOutsideClick: false,
                        confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
                        confirmButtonText: "Aceptar",
                    });
                }
            },
        });
    }
    function aprobar_liquidacion_ajax(id_liquidacion) {
        let parametros = {
            backend: "confirmar_liquidacion",
            id_liquidacion: id_liquidacion,
        };

        $("#myAlert").modal("show");
        $.ajax({
            data: parametros,
            url: "app/Controllers/Liquidaciones/Liquidaciones_backend.php",
            type: "POST",
            dataType: "JSON",
            success: function (response) {
                $("#myAlert").modal("hide");
                Swal.fire({
                    title: response.alert.title,
                    text: response.alert.message,
                    icon: response.alert.icon,
                    allowOutsideClick: false,
                    confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
                    confirmButtonText: "Aceptar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (response.success) {
                            location.reload();
                        }
                    }
                });
            },
        });
    }
    function eliminar_liquidacion_ajax(id_liquidacion) {
        let parametros = {
            backend: "eliminar_liquidacion",
            id_liquidacion: id_liquidacion,
        };
        $("#myAlert").modal("show");
        $.ajax({
            data: parametros,
            url: "app/Controllers/Liquidaciones/Liquidaciones_backend.php",
            type: "POST",
            dataType: "JSON",
            success: function (response) {
                $("#myAlert").modal("hide");
                Swal.fire({
                    title: response.alert.title,
                    text: response.alert.message,
                    icon: response.alert.icon,
                    allowOutsideClick: false,
                    confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
                    confirmButtonText: "Aceptar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (response.success) {
                            location.reload();
                        }
                    }
                });
            },
        });
    }

    //#### FUNCIONES AUXILIARES #####

    //#### INICIO: VALIDACIONES FORMULARIOS #####
});
