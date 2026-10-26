const ClassValidaciones = window.Validaciones;
$(document).ready(function () {
    const datatableLotes = $("#datatable_list_lotes");
    const datatableOrdPagoLote = $("#datatable_ordPago_detalleLote");
    const estados_cabecera_lotes = {
        AP: { text: "Aprobado", css: "header-status-AP" },
        PA: { text: "Pagado", css: "header-status-PA" },
        EL: { text: "Eliminado", css: "header-status-EL" },
        PE: { text: "Pendiente", css: "header-status-PE" },
    };
    const estados_badge_lotes = {
        AP: { text: "Aprobado", className: "sac-status-active" },
        PA: { text: "Pagado", className: "sac-status-active" },
        EL: { text: "Eliminado", className: "sac-status-inactive" },
        PE: { text: "Pendiente", className: "sac-status-modify" },
    };
    let tablaRegistrosLiquidaciones = $("#datatable_list_liquidaciones").DataTable({
        destroy: true,
        data: [], // Iniciamos vacío, se cargará dinámicamente según el select
        select: {
            style: "multi",
            className: "selected-row-table",
        },
        columns: [
            {
                title: "Nro Liquidacion",
                data: "id",
                className: "text-start align-middle",
            },
            {
                title: "Generación",
                data: null,
                className: "text-start",
                render: function (data) {
                    return `<div class="ubicacion-cell">
                        <strong>${data.usuario_generacion || "No especificado"}</strong>
                        <small class="d-block text-muted">Fecha: ${data.fecha_generacion || "S/D"}</small>
                    </div>`;
                },
            },
            {
                title: "Estado",
                data: null,
                className: "text-center",
                render: function (data) {
                    return `<div class="d-flex justify-content-center gap-2">
                            <span class="sac-status-badge sac-status-active">Aprobado</span>
                        </div>`;
                },
            },
        ],
        language: {
            url: "public/json/Spanish.json",
            searchPlaceholder: "Buscar Liquidacion...",
            select: {
                rows: {
                    _: " Seleccionaste %d Liquidacion",
                    0: " Haz clic en una fila para seleccionarla",
                    1: " 1 liquidacion seleccionada",
                },
            },
        },
        drawCallback: function () {
            // Desechar tooltips viejos para evitar que queden duplicados u huérfanos al redibujar
            if (typeof bootstrap !== "undefined" && bootstrap.Tooltip) {
                $('[data-bs-toggle="tooltip"]').each(function () {
                    const tooltipInstance = bootstrap.Tooltip.getInstance(this);
                    if (tooltipInstance) {
                        tooltipInstance.dispose();
                    }
                });
                $('[data-bs-toggle="tooltip"]').tooltip();
            }
        },
        responsive: true,
        iDisplayLength: 10,
        lengthMenu: [
            [10, 20, 50, -1],
            [10, 20, 50, "Todos"],
        ],
    });
    let tablaRegistrosFactCompra = $("#datatable_list_factCompra").DataTable({
        destroy: true,
        data: [], // Iniciamos vacío, se cargará dinámicamente según el select
        select: {
            style: "multi",
            className: "selected-row-table", // Highlight inmersivo de fila activa
        },
        columns: [
            {
                title: "Nro Factura",
                data: "numero_factura",
                className: "text-start align-middle",
            },
            {
                title: "Generación",
                data: null,
                className: "text-start",
                render: function (data) {
                    return `<div class="ubicacion-cell">
                        <strong>${data.usuario_generacion || "No especificado"}</strong>
                        <small class="d-block text-muted">Fecha: ${data.fecha_generacion || "S/D"}</small>
                    </div>`;
                },
            },
            {
                title: "Estado",
                data: null,
                className: "text-center",
                render: function (data) {
                    return `<div class="d-flex justify-content-center gap-2">
                            <span class="sac-status-badge sac-status-active">Aprobado</span>
                        </div>`;
                },
            },
        ],
        language: {
            url: "public/json/Spanish.json",
            searchPlaceholder: "Buscar Factura...",
            select: {
                rows: {
                    _: " Seleccionaste %d factura",
                    0: " Haz clic en una fila para seleccionarla",
                    1: " 1 Factura seleccionada",
                },
            },
        },
        drawCallback: function () {
            // Desechar tooltips viejos para evitar que queden duplicados u huérfanos al redibujar
            if (typeof bootstrap !== "undefined" && bootstrap.Tooltip) {
                $('[data-bs-toggle="tooltip"]').each(function () {
                    const tooltipInstance = bootstrap.Tooltip.getInstance(this);
                    if (tooltipInstance) {
                        tooltipInstance.dispose();
                    }
                });
                $('[data-bs-toggle="tooltip"]').tooltip();
            }
        },
        responsive: true,
        iDisplayLength: 10,
        lengthMenu: [
            [10, 20, 50, -1],
            [10, 20, 50, "Todos"],
        ],
    });

    extraer_lotes_ajax();
    extraer_bancos();
    function extraer_bancos() {
        let dataString = { backend: "extraer_cuentas_bancarias" };
        $("#myAlert").modal("show");
        $.ajax({
            data: dataString,
            url: "app/Controllers/Tesoreria/Cuentas_bancarias_backend.php",
            type: "POST",
            dataType: "JSON",
            success: function (response) {
                $("#myAlert").modal("hide");
                if (response.success) {
                    cargar_select_filtro(response.data);
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
    function cargar_select_filtro(bancos) {
        let $selects = [$("#cuenta_bancaria_NuevoLote")];

        $selects.forEach(($select) => {
            if ($select.length) {
                // Asegura que el selector existe en el DOM
                $select.empty();
                $select.append(`<option value="" selected disabled> Seleccione una cuenta bancaria...</option>`);

                for (var i = 0; i < bancos.length; i++) {
                    $select.append(`<option value="${bancos[i]["id_cuenta"]}">${bancos[i]["nombre_banco"]}</option>`);
                }
            }
        });
    }
    function cargar_tabla_lotes(lotes) {
        datatableLotes.DataTable({
            destroy: true,
            data: lotes,
            columns: [
                { title: "Nro Lote", data: "id_lote", className: "text-start align-middle" },
                {
                    title: "Tipo",
                    data: null,
                    className: "text-center",
                    render: function (data) {
                        let estados = {
                            1: { text: "Liquidaciones", className: "sac-status-view" },
                            2: { text: "Factura de Compras", className: "sac-status-neutral" },
                        };
                        const estadoConfig = estados[data.tipo_id] || {
                            text: data.tipo_id || "Desconocido",
                            className: "sac-status-neutral",
                        };
                        return `<span class="sac-status-badge ${estadoConfig.className}">${estadoConfig.text}</span>`;
                    },
                },
                {
                    title: "Importe",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return Formatos.formatoMoneda(data.importe || 0);
                    },
                },

                {
                    title: "Creacion",
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
                    title: "Autorizacion",
                    data: null,
                    className: "text-center",
                    render: function (data) {
                        const fechaAutorizacion = data.fecha_autorizacion;
                        const usuarioAutorizacion = data.usuario_autorizacion;
                        if (usuarioAutorizacion) {
                            return `<div class="ubicacion-cell">
                            <strong>${usuarioAutorizacion}</strong>
                            <small class="d-block text-muted"> Fecha: ${fechaAutorizacion} </small>
                        </div>`;
                        } else {
                            return `<div class="d-flex justify-content-center">
                                <span class="sac-status-badge sac-status-inactive">Sin Autorización</span>
                        </div>`;
                        }
                    },
                },
                {
                    title: "Estado",
                    data: null,
                    className: "text-center",
                    render: function (data) {
                        const estadoConfig = estados_badge_lotes[data.estado] || {
                            text: data.estado || "Desconocido",
                            className: "sac-status-neutral",
                        };
                        return `<span class="sac-status-badge ${estadoConfig.className}">${estadoConfig.text}</span>`;
                    },
                },
                {
                    title: "Acciones",
                    data: null,
                    className: "text-center",
                    render: function (data) {
                        // Disponible en todos los estados
                        let botones = `
                            <button class="sac-btn-icon sac-btn-icon-sm sac-btn-view btn-ver" id="btnVer_lote" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver lote">
                                <i class="ri-eye-fill"></i>
                            </button>`;

                        //Botones APROBAR y ELIMINAR
                        if (data.estado != "PA") {
                            botones += `
                            <button class="sac-btn-icon sac-btn-icon-sm sac-btn-activate btn-aprobar" id="btnAutorizar_lote" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Autorizar" aria-label="Autorizar lote">
                                <i class="ri-check-double-line"></i>
                            </button>
                            <button class="sac-btn-icon sac-btn-icon-sm sac-btn-modify" id="btnEditar_lote" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar" aria-label="Editar lote">
                                <i class="ri-edit-2-fill"></i>
                            </button>
                            <button class="sac-btn-icon sac-btn-icon-sm sac-btn-delete btn-eliminar" id="btnEliminar_lote" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar" aria-label="Eliminar lote">
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
                searchPlaceholder: "Buscar Lotes...",
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
        });
    }

    $("#datatable_list_lotes tbody").on("click", "button", function () {
        let opt = $(this).attr("id");
        let row = $(this).closest("tr");

        //Si es fila hija (responsive), subimos a la fila padre
        if (row.hasClass("child")) {
            row = row.prev();
        }
        loteDatos = datatableLotes.DataTable().row(row).data();

        switch (opt) {
            case "btnVer_lote":
                extraer_datos_lote_ajax(loteDatos["id_lote"]);
                //extraer_datos_presentacion_ajax(presentacionDatos['id_presentacion']);
                break;
            case "btnAutorizar_lote":
                Swal.fire({
                    title: "¿Estás seguro?",
                    text: `¿Desea Autorizar este Lote?`,
                    icon: "question",
                    showCancelButton: true,
                    allowOutsideClick: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, Autorizar",
                    cancelButtonText: "Cancelar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        //Posible Modificacion
                        actualizar_estado_lote_ajax(loteDatos["id_lote"]);
                    }
                });
                break;
            case "btnEliminar_lote":
                Swal.fire({
                    title: "¿Estás seguro?",
                    text: `¿Desea Eliminar esta Lote?`,
                    icon: "question",
                    showCancelButton: true,
                    allowOutsideClick: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, Eliminar",
                    cancelButtonText: "Cancelar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        eliminar_lote_ajax(loteDatos["id_lote"]);
                    }
                });

                break;
        }
    });

    // *******************************************
    // **************** ALTA LOTE ****************

    $("#btnNuevoLote").on("click", function (e) {
        $("#modalGenerarLote").modal("show");
    });
    $("#tipo_lote").on("change", function (e) {
        let tipo_lote = $(this).val();
        let parametros = {};
        let url = "";
        $("#contenedor_liquidaciones").hide();
        $("#contenedor_factCompra").hide();
        if (tipo_lote === "1") {
            parametros = {
                backend: "extraer_liquidaciones",
                estado: "AP",
            };
            url = "app/Controllers/Liquidaciones/Liquidaciones_backend.php";
        } else if (tipo_lote === "2") {
            parametros = {
                backend: "extraer_facturas_compras",
                estado: "AP",
            };
            url = "app/Controllers/Tesoreria/Facturas_compra_backend.php";
        } else {
            //Si selecciona la opción por defecto, limpiamos ambas tablas y salimos
            if (tablaRegistrosLiquidaciones) tablaRegistrosLiquidaciones.clear().draw();
            if (tablaRegistrosFactCompra) tablaRegistrosFactCompra.clear().draw();
            return;
        }

        $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            data: parametros,
            beforeSend: function () {
                if ($("#myAlert").length) {
                    $("#myAlert").modal("show");
                }
            },
            success: function (response) {
                if (response.success) {
                    if (tipo_lote === "1" && tablaRegistrosLiquidaciones) {
                        tablaRegistrosLiquidaciones.clear().rows.add(response.data).draw();

                        $("#contenedor_liquidaciones").show();
                        // ⚡ RECALCULAR ANCHO DESPUÉS DE MOSTRAR
                        tablaRegistrosLiquidaciones.columns.adjust().responsive.recalc();
                    } else if (tipo_lote === "2" && tablaRegistrosFactCompra) {
                        tablaRegistrosFactCompra.clear().rows.add(response.data).draw();

                        $("#contenedor_factCompra").show();
                        // ⚡ RECALCULAR ANCHO DESPUÉS DE MOSTRAR
                        tablaRegistrosFactCompra.columns.adjust().responsive.recalc();
                    }
                } else {
                    if (typeof Swal !== "undefined") {
                        Swal.fire({
                            title: response.alert.title,
                            text: response.alert.message,
                            icon: response.alert.icon,
                            allowOutsideClick: false,
                            confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
                            confirmButtonText: "Aceptar",
                        });
                    }
                }
            },
            complete: function () {
                if ($("#myAlert").length) {
                    $("#myAlert").modal("hide");
                }
            },
        });
    });
    $("#btnConfirmarNuevoLote").on("click", function (e) {
        e.preventDefault();

        let tipo_lote = $("#tipo_lote").val();
        let cuenta_bancaria = $("#cuenta_bancaria_NuevoLote").val();

        if (!tipo_lote) {
            Swal.fire({
                title: "Atención",
                text: "Debe seleccionar un Tipo de Lote.",
                icon: "warning",
                confirmButtonClass: "btn btn-info",
                confirmButtonText: "Aceptar",
            });
            return;
        }

        if (!cuenta_bancaria) {
            Swal.fire({
                title: "Atención",
                text: "Debe seleccionar una Cuenta Bancaria de destino.",
                icon: "warning",
                confirmButtonClass: "btn btn-info",
                confirmButtonText: "Aceptar",
            });
            return;
        }

        let idsSeleccionados = [];

        if (tipo_lote === "1") {
            let filasSeleccionadas = tablaRegistrosLiquidaciones.rows({ selected: true }).data().toArray();
            idsSeleccionados = filasSeleccionadas.map((fila) => fila.id);
        } else if (tipo_lote === "2") {
            let filasSeleccionadas = tablaRegistrosFactCompra.rows({ selected: true }).data().toArray();
            idsSeleccionados = filasSeleccionadas.map((fila) => fila.numero_factura);
        }

        if (idsSeleccionados.length === 0) {
            Swal.fire({
                title: "Atención",
                text: "Debe seleccionar al menos un registro a procesar en la tabla.",
                icon: "warning",
                confirmButtonClass: "btn btn-info",
                confirmButtonText: "Aceptar",
            });
            return;
        }
        let parametros = {
            backend: "generar_lote",
            datos: {
                tipo_lote: parseInt(tipo_lote),
                banco_id: parseInt(cuenta_bancaria),
                selecciones: idsSeleccionados,
            },
        };
        nuevo_lote_ajax(parametros);
    });
    function cargar_loteDetalle(lote) {
        let cabecera = lote.cabecera;
        let detalle = lote.detalle;

        const estadoConfig = estados_cabecera_lotes[cabecera.estado] || { text: cabecera.estado, css: "bg-dark-gradient" };
        $("#loteDetalleModal .modal-header")
            .removeClass(function (index, className) {
                return (className.match(/(^|\s)header-status-\S+/g) || []).join(" ");
            })
            .addClass(estadoConfig.css);
        $("#myAlert").modal("show");
        //Cabecera
        $("#loteDetalleModalLabel").text("Lote - " + estadoConfig.text);
        $("#nroLote_detalleLote").text(cabecera.id_lote);
        let tipo_lote = cabecera.tipo_id == 1 ? "Liquidaciones" : "Factura de Compra";
        $("#tipoLote_detalleLote").text(tipo_lote);
        //Modificar esto con el nombre del banco
        $("#nombreBanco_detalleLote").text(cabecera.nombre_banco);
        $("#ctaBancaria_detalleLote").text(cabecera.nombre_banco);

        $("#usrCreacion_detalleLote").text(cabecera.usuario_creacion);
        $("#fechaCreacion_detalleLote").text(cabecera.fecha_creacion);
        $("#usrAutorizacion_detalleLote").text(cabecera.usuario_autorizacion || "Sin Autorizacion");
        $("#fechaAutorizacion_detalleLote").text(cabecera.fecha_autorizacion || "Sin Autorizacion");

        $("#importeLote_detalleLote").text(formatear_importe(cabecera.importe));

        //Detalle
        cargar_tablaLotes_ordPagos(detalle);
        //cargar_tabla_lotes_detalle(detalle);
        $("#loteDetalleModal").modal("show");
        $("#myAlert").modal("hide");
    }
    function cargar_tablaLotes_ordPagos(ordenesPago) {
        datatableOrdPagoLote.DataTable({
            destroy: true,
            data: ordenesPago,
            pageLength: 25, // Mostrar 25 registros por página
            columns: [
                { title: "Nro. Orden", data: "id_orden_pago", className: "text-start align-middle" },
                {
                    title: "Destino",
                    data: null,
                    className: "text-center",
                    render: function (data) {
                        let estados = {
                            FAR: { text: "Farmacias", className: "sac-status-active" },
                            FAC: { text: "Factura de Compras", className: "sac-status-view" },
                        };
                        const estadoConfig = estados[data.tipo_destino] || {
                            text: data.tipo_destino || "Desconocido",
                            className: "sac-status-neutral",
                        };
                        return `<span class="sac-status-badge ${estadoConfig.className}">${estadoConfig.text}</span>`;
                    },
                },
                { title: "Descripcion", data: "descripcion", className: "text-center" },
                {
                    title: "Importe",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return formatear_importe(data.importe);
                    },
                },
                {
                    title: "Acciones",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        let botones = `<button class="sac-btn-icon sac-btn-icon-sm sac-btn-view btn-ver" id="btnVer_ordPago_lote" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver orden de pago">
                                <i class="ri-eye-fill"></i>
                            </button>`;
                        return `<div class="sac-table-actions">
                            ${botones}
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
                searchPlaceholder: "Buscar Orden de Pago...",
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
    //#### FUNCIONES AJAX #####
    function extraer_lotes_ajax() {
        let dataString = { backend: "extraer_lotes" };
        $("#myAlert").modal("show");
        $.ajax({
            data: dataString,
            url: "app/Controllers/Tesoreria/Lotes_backend.php",
            type: "POST",
            dataType: "JSON",
            success: function (response) {
                $("#myAlert").modal("hide");
                if (response.success) {
                    cargar_tabla_lotes(response.data);
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
    function extraer_datos_lote_ajax(id_lote) {
        $("#myAlert").modal("show");
        let parametros = {
            backend: "extraer_lote",
            id_lote: id_lote,
        };
        $.ajax({
            data: parametros,
            url: "app/Controllers/Tesoreria/Lotes_backend.php",
            type: "POST",
            dataType: "JSON",
            success: function (response) {
                $("#myAlert").modal("hide");

                if (response.success) {
                    cargar_loteDetalle(response.data);
                }
            },
        });
    }
    function nuevo_lote_ajax(datos) {
        $("#myAlert").modal("show");
        $.ajax({
            data: datos,
            url: "app/Controllers/Tesoreria/Lotes_backend.php",
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
                        } else {
                            $("#modalGenerarLote").modal("show");
                        }
                    }
                });
            },
        });
    }
    function actualizar_estado_lote_ajax(id_lote) {
        let parametros = {
            backend: "autorizar_lote",
            id_lote: id_lote,
        };
        console.log(parametros);
        $.ajax({
            data: parametros,
            url: "app/Controllers/Tesoreria/Lotes_backend.php",
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
    function formatear_importe(valor) {
        const valor_input = parseFloat(valor) || 0;

        // 2. Formateo Profesional (Estándar internacional)
        // 'es-AR' asegura el formato: $ 1.000,00 (punto para miles, coma para decimales)
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2,
        }).format(valor_input);
    }

    // *******************************************
    // ************* ELIMINAR LOTE ***************
    function eliminar_lote_ajax(id_lote) {
        let parametros = {
            backend: "eliminar_lote",
            id_lote: id_lote,
        };
        $.ajax({
            data: parametros,
            url: "app/Controllers/Tesoreria/Lotes_backend.php",
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
});
