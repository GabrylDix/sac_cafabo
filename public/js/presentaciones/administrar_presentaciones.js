$(document).ready(function () {
    var listado_presentaciones_tabla= $('#datatable_list_presentaciones');
    var listado_detallePres_tabla= $('#datatable_detalle_detallePres');
    var listado_planesFarma_tabla= $('#datatable_detalle_presFarma');
    var listado_recibos_tabla= $('#datatable_recibos_detallePres');
   let presentacionDatos= [];
    const estados_presentacion = {
        'AP': { text: 'Aprobado',              css: 'header-status-AP' },// Success suele requerir texto oscuro para contraste
        'PR': { text: 'Procesado',             css: 'header-status-PR' },// Info suele requerir texto oscuro para contraste
        'E':  { text: 'Eliminado',             css: 'header-status-E' },
        'PL': { text: 'Pendiente Liquidación', css: 'header-status-PL' }, // Warning requiere texto oscuro
        'LP': { text: 'Liquidado Parcial',     css: 'header-status-LP' },
        'LT': { text: 'Liquidado Total',       css: 'header-status-LT' }
    };
    //var presentacionDatos= [];
    extraer_presentaciones_ajax();

    function cargar_tabla_presentaciones(presentaciones){

        listado_presentaciones_tabla.DataTable({
            destroy: true,
            data:presentaciones,
            pageLength: 25, // Mostrar 25 registros por página
            columns: [
                {
                    data: "id_presentacion",
                    className: "text-start align-middle",
                },
                {
                    data: "convenio_nombre",
                },
                {
                    data: "periodo",
                    className: "text-center align-middle",
                },
                {
                    data: null,
                    className: "text-end align-middle",
                    render: function (data) {
                        return formatear_importe(data.importe_100);
                    
                    },
                },
                {
                    data: null,
                    className: "text-end align-middle",
                    render: function (data) {
                        return formatear_importe(data.a_cargo_os);
                    },
                },
                {
                    data: null,
                    className: "text-end align-middle",
                    render: function (data) {
                        return formatear_importe(data.total_a_pagar);
                    },
                },
                {
                    data: null,
                    className: "text-center align-middle",
                    render: function (data) {
                        const estados = {
                            AP: { text: "Aprobado", className: "sac-status-active" },
                            PR: { text: "Procesado", className: "sac-status-view" },
                            E: { text: "Eliminado", className: "sac-status-inactive" },
                            PL: { text: "Pendiente Liquidación", className: "sac-status-modify" },
                            LP: { text: "Liquidado Parcial", className: "sac-status-neutral" },
                            LT: { text: "Liquidado Total", className: "sac-status-active" },
                        };
                        const estadoConfig = estados[data.estado] || {
                            text: data.estado || "Sin definir",
                            className: "sac-status-neutral",
                        };

                        return `<span class="sac-status-badge ${estadoConfig.className}">${estadoConfig.text}</span>`;
                    },
                },
                {
                    data: "fecha_creacion",
                    className: "text-center align-middle",
                },
                {
                    data: null,
                    className: "text-center align-middle",
                    render: function (data) {
                        if(data.estado === 'PR'){
                            return `<div class="sac-table-actions">
                            <button class="sac-btn-icon sac-btn-icon-sm sac-btn-view" id="btnVer_presentacion" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver presentación">
                                <i class="ri-eye-fill"></i>
                            </button>
                            <button class="sac-btn-icon sac-btn-icon-sm sac-btn-activate" id="btnAprobar_presentacion" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Aprobar" aria-label="Aprobar presentación">
                                <i class="ri-check-double-line"></i>
                            </button>
                            <button class="sac-btn-icon sac-btn-icon-sm sac-btn-delete" id="btnEliminar_presentacion" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar" aria-label="Eliminar presentación">
                                <i class="ri-close-circle-fill"></i>
                            </button>
                        </div>`;
                        }else{
                            return `<div class="sac-table-actions">
                            <button class="sac-btn-icon sac-btn-icon-sm sac-btn-view" id="btnVer_presentacion" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver" aria-label="Ver presentación">
                                <i class="ri-eye-fill"></i>
                            </button>
                        </div>`;
                        }
                        
                    }
                }
            ],
            drawCallback: function () {
                // Inicializar tooltips en elementos de la tabla
                $('[data-bs-toggle="tooltip"]').tooltip("dispose").tooltip();
            },
            language: {
                url: "public/json/Spanish.json",
                searchPlaceholder: 'Buscar Presentacion...'
            },
            lengthMenu: [
                [25,50,100, -1],
                [25, 50,100, "Todos"],
            ],
            responsive:true,
            scrollX:false,
            sInfo: false,
            info: false,
            order: [[0, "desc"]],

        });
        $('#myAlert').modal('hide');
    }
    $("#datatable_list_presentaciones tbody").on("click", "button", function () {
        let opt = $(this).attr("id");
        let row = $(this).closest("tr");

        //Si es fila hija (responsive), subimos a la fila padre
        if (row.hasClass("child")) {
            row = row.prev();
        }
        presentacionDatos = listado_presentaciones_tabla.DataTable().row(row).data();

        switch (opt) {
            case "btnVer_presentacion":
                extraer_datos_presentacion_ajax(presentacionDatos['id_presentacion']);
                break;
            case "btnAprobar_presentacion":
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: `¿Desea Aprobar esta presentación?`,
                    icon: "question",
                    showCancelButton: true,
                    allowOutsideClick: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, Aprobar",
                    cancelButtonText: "Cancelar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        actualizar_estado_presentacion_ajax(presentacionDatos);
                    }
                });
                break;
            case "btnEliminar_presentacion":
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: `¿Desea Eliminar esta presentación?`,
                    icon: "question",
                    showCancelButton: true,
                    allowOutsideClick: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, Eliminar",
                    cancelButtonText: "Cancelar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        eliminar_presentacion_ajax(presentacionDatos);
                    }
                });
                
                break;
        }
    });
    //######### INICIO: AJAX PARA CONSULTAS #########
    function extraer_presentaciones_ajax(){
        let parametros = { backend: "extraer_presentaciones"};
        $('#myAlert').modal('show');
        $.ajax({
            data: parametros,
            url: 'app/Controllers/Presentaciones/Presentaciones_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                cargar_tabla_presentaciones(response.data);
            }
        });
    }
    function extraer_datos_presentacion_ajax(id_presentacion){
        let parametros = {'backend': 'extraer_presentacion', 'id_presentacion': id_presentacion};
        $('#myAlert').modal('show');
        $.ajax({
            data: parametros,
            url: 'app/Controllers/Presentaciones/Presentaciones_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                if(response.success){
                    ver_datos_presentacion(response.data);
                }else{
                    Swal.fire({
                        title: response.alert.title,
                        text: response.alert.message,
                        icon: response.alert.icon,
                        allowOutsideClick: false,
                        confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
                        confirmButtonText: "Aceptar"
                    })
                }
            }
        });
    }
    function actualizar_estado_presentacion_ajax(presentacion){
        let parametros = { backend: "actualizar_estado",id_presentacion: presentacion['id_presentacion'], estado: 'AP'};
        $('#myAlert').modal('show');
        $.ajax({
            data: parametros,
            url: 'app/Controllers/Presentaciones/Presentaciones_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                Swal.fire({
                    title: response.alert.title,
                    text: response.alert.message,
                    icon: response.alert.icon,
                    allowOutsideClick: false,
                    confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
                    confirmButtonText: "Aceptar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        if(response.success){
                           location.reload();
                        }
                    }
                });
            }
        });
    }
    function eliminar_presentacion_ajax(presentacion){
        let parametros = { backend: "eliminar_presentacion",id_presentacion: presentacion['id_presentacion']};
         $('#myAlert').modal('show');
        $.ajax({
            data: parametros,
            url: 'app/Controllers/Presentaciones/Presentaciones_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                Swal.fire({
                    title: response.alert.title,
                    text: response.alert.message,
                    icon: response.alert.icon,
                    allowOutsideClick: false,
                    confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
                    confirmButtonText: "Aceptar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        if(response.success){
                           location.reload();
                        }
                    }
                });
            }
        });
    }
    function ver_datos_presentacion(presentacion){
        let cabecera = presentacion.cabecera;
        let detalle= presentacion.detalle;
        let recibos= presentacion.recibo;
        const estadoConfig = estados_presentacion[cabecera.estado] || { text: cabecera.estado, css: 'bg-dark-gradient' };
        $('#presentacionModal .modal-header').removeClass (function (index, className) {
            return (className.match (/(^|\s)header-status-\S+/g) || []).join(' ');
        }).addClass(estadoConfig.css);
        $('#myAlert').modal('show');
        //Cabecera
        $('#presentacionModalLabel').text('Presentación de Convenio - '+estadoConfig.text);
        $('#nro_pres_detallePres').text(cabecera.id_presentacion);
        $('#convenio_detallePres').text(cabecera.convenio_nombre);
        $('#periodo_detallePres').text(cabecera.periodo);
        $('#fechaCarga_detallePres').text(cabecera.fecha_creacion);
        $('#importePres_detallePres').text(formatear_importe(cabecera.importe_100_presentado));
        $('#importe_detallePres').text(formatear_importe(cabecera.importe_100));
        $('#aCargoOSpresent_detallePres').text(formatear_importe(cabecera.a_cargo_os_presentado));
        $('#aCargoOS_detallePres').text(formatear_importe(cabecera.a_cargo_os));
        $('#bonifFarmacia_detallePres').text(formatear_importe(cabecera.bonificacion_farmacia));
        $('#notasCredito_detallePres').text(formatear_importe(cabecera.notas_credito));
        $('#recuperoGastos_detallePres').text(formatear_importe(cabecera.recupero_gastos));
        $('#debito_detallePres').text(formatear_importe(cabecera.debitos));
        $('#debitoOS_detallePres').text(formatear_importe(cabecera.debitos_os));
        $('#creditoOS_detallePres').text(formatear_importe(cabecera.creditos_os));
        $('#creditos_detallePres').text(formatear_importe(cabecera.creditos));
        $('#totalPagar_detallePres').text(formatear_importe(cabecera.total_a_pagar));
        $('#saldoPendiente_detallePres').text(formatear_importe(cabecera.saldo_pendiente));
        $('#porcentaje_detallePres').text(cabecera.porcentaje_pendiente+'%');
        $('#saldoLiq_detallePres').text('$'+cabecera.saldo_liquidado);
        $('#porcLiq_detallePres').text(cabecera.porcentaje_liquidado+'%');
        //Recibos
        cargar_tabla_recibos_detalle(recibos);
        //Detalle
        cargar_tabla_presentaciones_detalle(detalle);
        $("#presentacionModal").modal("show");
        $('#myAlert').modal('hide');
        
    }
    function formatear_importe(valor) {
        const valor_input = parseFloat(valor) || 0;

        // 2. Formateo Profesional (Estándar internacional)
        // 'es-AR' asegura el formato: $ 1.000,00 (punto para miles, coma para decimales)
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2
        }).format(valor_input);
    }
    function cargar_tabla_presentaciones_detalle(presentaciones){

        listado_detallePres_tabla.DataTable({
            destroy: true,
            data:presentaciones,
            pageLength: 25, // Mostrar 25 registros por página
            columns: [
                {   title: "Cod. Farmacia",
                    data: "id_farmacia",
                    className: "text-center",
                },
                {   title: "Nombre",
                    data: "nombre",
                    className: "text-center",
                },
                {   title: "Cantidad Recetas",
                    data: "cantidad_recetas",
                    className: "text-center",
                },
                {
                    title: "Importe 100%",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return formatear_importe(data.importe_100);
                    
                    },
                },
                {
                    title: "A Cargo OS",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return formatear_importe(data.a_cargo_os);
                    },
                },
                {
                    title: "Debitos OS",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return formatear_importe(data.debitos_os);
                    },
                },
                {
                    title: "Creditos OS",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return formatear_importe(data.creditos_os);
                    },
                },
                {
                    title: "Total a Pagar",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return formatear_importe(data.total_a_pagar);
                    },
                },
                {
                    title: "Acciones",
                    data: null,
                    className: "text-center",
                    render: function (data) {
                        return `<div class="sac-table-actions">
                            <button class="sac-btn-icon sac-btn-icon-sm sac-btn-view" id="btnVer_presentacion_farmacia" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver Presentación Farmacia" aria-label="Ver presentación de farmacia">
                                <i class="ri-eye-fill"></i>
                            </button>
                        </div>`;
                    }
                }
            ],
            drawCallback: function () {
                // Inicializar tooltips en elementos de la tabla
                $('[data-bs-toggle="tooltip"]').tooltip("dispose").tooltip();
            },
            language: {
                url: "public/json/Spanish.json",
                searchPlaceholder: 'Buscar Presentacion...'
            },
            lengthMenu: [
                [25,50,100, -1],
                [25, 50,100, "Todos"],
            ],
            responsive:true,
            scrollX:false,
            sInfo: false,
            info: false,
            order: [[0, "asc"]],

        });
    }
    function cargar_tabla_recibos_detalle(recibos){

        listado_recibos_tabla.DataTable({
            destroy: true,
            data:recibos,
            pageLength: 25, // Mostrar 25 registros por página
            columns: [
                {   title: "Nro. Recibo",
                    data: "id_recibo",
                    className: "text-center",
                },
                {   title: "Nro. Comprobante",
                    data: "numero_comprobante",
                    className: "text-center",
                },
                {   title: "Fecha Comprobante",
                    data: "fecha_comprobante",
                    className: "text-center",
                },
                {
                    title: "Importe",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return formatear_importe(data.importe);
                    
                    },
                }
            ],
            drawCallback: function () {
                // Inicializar tooltips en elementos de la tabla
                $('[data-bs-toggle="tooltip"]').tooltip("dispose").tooltip();
            },
            language: {
                url: "public/json/Spanish.json",
                searchPlaceholder: 'Buscar Recibos...'
            },
            lengthMenu: [
                [25,50,100, -1],
                [25, 50,100, "Todos"],
            ],
            responsive:true,
            scrollX:false,
            sInfo: false,
            info: false,
            order: [[0, "asc"]],

        });
    }
    $("#datatable_detalle_detallePres tbody").on("click", "button", function () {
        let opt = $(this).attr("id");
        let row = $(this).closest("tr");
        let presentacion = listado_detallePres_tabla.DataTable().row(row).data();

        switch (opt) {
            case "btnVer_presentacion_farmacia":
                extraer_presentacion_farmacia_ajax(presentacion);
                break;
        }
    });

    function extraer_presentacion_farmacia_ajax(presentacion){
        $('#presentacionModal').modal('hide');
        let parametros = {'backend': 'extraer_presentacion_farmacia', 'id_presentacion': presentacion.presentacion_id, 'id_farmacia': presentacion.id_farmacia};
        $('#myAlert').modal('show');
        $.ajax({
            data: parametros,
            url: 'app/Controllers/Presentaciones/Presentaciones_backend.php',
            type: 'POST',
            dataType: 'JSON',
            success: function (response) {
                $('#myAlert').modal('hide');
                if(response.success){
                    ver_datos_presentacion_farmacia(response.data);
                }else{
                    Swal.fire({
                        title: response.alert.title,
                        text: response.alert.message,
                        icon: response.alert.icon,
                        allowOutsideClick: false,
                        confirmButtonClass: "btn btn-info w-xs me-2 mt-2",
                        confirmButtonText: "Aceptar"
                    })
                }
            }
        });
    }
    function ver_datos_presentacion_farmacia(presentacion_farmacia){
        let cabecera = presentacion_farmacia.cabecera[0];
        let planes= presentacion_farmacia.detalle;
        const estadoConfig = estados_presentacion[cabecera.estado] || { text: cabecera.estado, css: 'bg-dark-gradient' };
        $('#presentacionFarmaciaModal .modal-header').removeClass (function (index, className) {
            return (className.match (/(^|\s)header-status-\S+/g) || []).join(' ');
        }).addClass(estadoConfig.css);
        $('#presentacionFarmaciaModalLabel').text('Presentación Detallada - Cod Farmacia: '+cabecera.id_farmacia+' - Farmacia: '+cabecera.nombre);
        //Cabecera
        //console.log(cabecera);
        //$('#codFarmacia_presFarma').text(cabecera.id_farmacia);
        $('#importePres_presFarma').text(formatear_importe(cabecera.importe_100_presentado));
        $('#importe_presFarma').text(formatear_importe(cabecera.importe_100));
        $('#aCargoOSpresent_presFarma').text(formatear_importe(cabecera.a_cargo_os_presentado));
        $('#aCargoOS_presFarma').text(formatear_importe(cabecera.a_cargo_os));
        $('#bonifFarmacia_presFarma').text(formatear_importe(cabecera.bonificacion_farmacia));
        $('#notasCredito_presFarma').text(formatear_importe(cabecera.notas_credito));
        $('#recuperoGastos_presFarma').text(formatear_importe(cabecera.recupero_gastos));
        $('#debito_presFarma').text(formatear_importe(cabecera.debitos));
        $('#debitoOS_presFarma').text(formatear_importe(cabecera.debitos_os));
        $('#creditoOS_presFarma').text(formatear_importe(cabecera.creditos_os));
        $('#creditos_presFarma').text(formatear_importe(cabecera.creditos));
        $('#totalPagar_presFarma').text(formatear_importe(cabecera.atotal_a_pagar));
        $('#saldoPendiente_presFarma').text(formatear_importe(cabecera.saldo_pendiente));
        $('#porcentaje_presFarma').text(cabecera.porcentaje_pendiente+'%');
        $('#saldoLiq_presFarma').text('$'+cabecera.saldo_liquidado);
        $('#porcLiq_presFarma').text(cabecera.porcentaje_liquidado+'%');
        $('#cantRecetas_presFarma').text(cabecera.cantidad_recetas);
        cargar_tabla_planes_farmacia(planes);
        //Detalle Presentación Farmacia
        $("#presentacionFarmaciaModal").modal("show");
    }

    function cargar_tabla_planes_farmacia(planes){

        listado_planesFarma_tabla.DataTable({
            destroy: true,
            data:planes,
            pageLength: 25, // Mostrar 25 registros por página
            columns: [
                {   title: "Plan",
                    data: null,
                    className: "text-center",
                    render: function(data){
                        const id_plan = data.plan_id || " - ";
                        const plan = data.nombre_plan || " - ";

                        return `<div class="ubicacion-cell">
                            <strong>${plan}</strong>
                            <small class="d-block text-muted"> Cod Plan: ${id_plan} </small>
                        </div>`;
                    } 
                },
                {   title: "Cantidad Recetas",
                    data: "cantidad_recetas",
                    className: "text-center",
                },
                {
                    title: "Importe 100%",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return formatear_importe(data.importe_100);
                    
                    },
                },
                {
                    title: "A Cargo OS",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return formatear_importe(data.a_cargo_os);
                    },
                },
                {
                    title: "Bonificación OS",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return formatear_importe(data.bonificacion_os);
                    },
                },
                {
                    title: "Bonificación Farmacia",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return formatear_importe(data.bonificacion_farmacia);
                    },
                },
                {
                    title: "Notas Credito",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return formatear_importe(data.notas_credito);
                    },
                },
                {
                    title: "Recupero Gastos",
                    data: null,
                    className: "text-end",
                    render: function (data) {
                        return formatear_importe(data.recupero_gastos);
                    },
                }
            ],
            drawCallback: function () {
                // Inicializar tooltips en elementos de la tabla
                $('[data-bs-toggle="tooltip"]').tooltip("dispose").tooltip();
            },
            language: {
                url: "public/json/Spanish.json",
                searchPlaceholder: 'Buscar Plan...'
            },
            lengthMenu: [
                [25,50,100, -1],
                [25, 50,100, "Todos"]
            ],
            responsive:true,
            scrollX:false,
            sInfo: false,
            info: false,
            order: [[0, "asc"]],

        });
    }

    $("#closeModalPresFarma, #closeModalUpPresFarma").on("click", function (e) {
        e.preventDefault();      
        // Ocultamos el modal de farmacia
        $("#presentacionFarmaciaModal").modal("hide");
        // Mostramos el modal principal
        $("#presentacionModal").modal("show");
    });
    
    
});
