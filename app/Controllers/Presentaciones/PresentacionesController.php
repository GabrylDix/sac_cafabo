<?php
namespace App\Controllers\Presentaciones;

//MODELOS
use App\Models\Presentaciones\PresentacionesModel;

//CONTROLLERS
use App\Controllers\Contabilidad\AsientosContablesController;
use App\Controllers\Convenios\ConveniosController;

//HELPERS
use App\Helper\ResponseHelper;
use App\Helper\LoggerHelper;
use App\Helper\ArchivoHelper;
use App\Helper\Excel\ExcelHelper;


class PresentacionesController{
    protected $dbc;
    private $presentacionesModel;
    private $directorio = "Presentaciones";

    function __construct(){
        $this->dbc = $GLOBALS['dbc'];
        $this->presentacionesModel = new PresentacionesModel($this->dbc);
    }

    public function importar_presentacion($datos){
        $archivo = $_FILES['archivo'];

        $control = $this->control_archivo($archivo);

        if ($control['error'] == true) {
            $response = ResponseHelper::sendResponse(false, 200, $control['msj'], null, []);
            return $response;
        }
        //GENERO EL DIRECTORIO
        $directorio = ArchivoHelper::crear_directorio(['archivos', 'presentaciones']);
        //ESTA ES LA UBICACION DEL CSV
        $destino_csv = $directorio."/".date("YmdHis");
        //GUARDO EL ARCHIVO EN EL SERVIDOR
        $archivo_excel = ArchivoHelper::guardar_archivo($archivo, $directorio);
        //CONVIERTO EL EXCEL EN CSV
        $archivo_csv = ExcelHelper::convertir_excel_csv($archivo_excel, $destino_csv);

        $this->dbc->beginTransaction();
        $consulta['imp_csv'] = $this->presentacionesModel->importar_archivo_csv($archivo_csv);
        $consulta['reg_invalidos'] = $this->obtener_presentaciones_invalidas($datos['id_convenio']);
        
        if ($consulta['reg_invalidos']) {
            $response = ResponseHelper::sendResponse(false, 200, "Se detectaron errores en los archivos. Verifique los datos e intente nuevamente.", null, $consulta['reg_invalidos']);
            $this->dbc->rollBack();
            return $response;
        }

        $consulta['id_presentacion'] = $this->procesar_presentacion($datos['id_convenio'], $datos['periodo']);

        if ($consulta['imp_csv'] && $consulta['id_presentacion']) {
            $response = ResponseHelper::sendResponse(true, 200, "La presentacion se proceso con éxito. Nro asignado: {$consulta['id_presentacion']}", null, []);
            $this->dbc->commit();
        }else{
            $response = ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", null, []);
            $this->dbc->rollBack();
        }

        return $response;
    }

    private function obtener_presentaciones_invalidas($id_convenio) {
        // 1. Agrupamos las consultas y sus respectivos mensajes de error
        $validaciones = [
            'Los importes no pueden ser 0.'         => $this->presentacionesModel->obtener_registros_con_import_0(),
            'El id de la farmacia no es valido.' => $this->presentacionesModel->obtener_registros_id_farmacia_invalida(),
            'El id del plan no es valido para el convenio seleccionado.'     => $this->presentacionesModel->obtener_registros_id_plan_invalido($id_convenio)
        ];
        
        $registros_invalidos = [];
        
        // 2. Iteramos dinámicamente sobre cada grupo de errores
        foreach ($validaciones as $mensaje_error => $registros) {
            foreach ($registros as $registro) {
                $key = $registro['id_farmacia'] . '_' . $registro['id_plan'];
                
                // Si la clave no existe, inicializamos la estructura base con el error vacío
                if (!isset($registros_invalidos[$key])) {
                    $registros_invalidos[$key] = [
                        'id_farmacia'      => $registro['id_farmacia'],
                        'nombre_farmacia'  => $registro['nombre_farmacia'],
                        'id_plan'          => $registro['id_plan'],
                        'cantidad_recetas' => $registro['cantidad_recetas'],
                        'importe_100_camara' => $registro['importe_100_camara'],
                        'importe_os_camara' => $registro['importe_os_camara'],
                        'importe_100'      => $registro['importe_100'],
                        'importe_os'       => $registro['importe_os'],
                        'bonificacion_os' => $registro['bonificacion_os'],
                        'bonificacion_farmacia' => $registro['bonificacion_farmacia'],
                        'notas_credito' => $registro['notas_credito'],
                        'debitos_os' => $registro['debitos_os'],
                        'creditos_os' => $registro['creditos_os'],
                        'error'            => '' // Inicializamos vacío
                    ];
                }
                
                // 3. Concatenamos el error correspondiente
                // Si ya hay un error previo, le agregamos un espacio antes del nuevo mensaje
                $espacio = ($registros_invalidos[$key]['error'] === '') ? '' : ' ';
                $registros_invalidos[$key]['error'] .= $espacio . $mensaje_error;
            }
        }

        // 4. Devolvemos el array plano
        return array_values($registros_invalidos);
    }

    private function control_archivo($archivo){
        $respuesta['error'] = false;
        
        if ($archivo['size'] == 0) {
            $respuesta['error'] = true;
            $respuesta['msj'] = "El archivo esta vacio.";
        }

        //VERIFICO QUE EL ARCHIVO TENGA ALGO Y SEA LA EXTENSION CORRECTA
        if ($archivo['size'] == 0 || (pathinfo(strtolower($archivo['name']), PATHINFO_EXTENSION) != 'xlsx' && pathinfo(strtolower($archivo['name']), PATHINFO_EXTENSION) != 'xls')) {
            $respuesta['error'] = true;
            $respuesta['msj'] = "El archivo seleccionado no es formato excel.";
            return $respuesta;
        }

        return $respuesta;
    }

    private function procesar_presentacion($id_convenio, $periodo){
        // print_r($consulta['insert']);exit;
        $consulta['insert'] = $this->presentacionesModel->generar_presentaciones($id_convenio, $periodo);
        
        $consulta['insert_plan'] = $this->presentacionesModel->insertar_presentacion_planes($consulta['insert']);

        $consulta['insert_farmacias'] = $this->presentacionesModel->insertar_presentacion_farmacias($consulta['insert']);

        $consulta['upd_presentacion'] = $this->presentacionesModel->actualizar_presentacion($consulta['insert']);

        if ($consulta['insert'] && $consulta['insert_plan'] && $consulta['insert_farmacias'] && $consulta['upd_presentacion']) {
            return $consulta['insert'];
        }else{
            return false;
        }
    }

    /**
     * FUCNION DE PRESENTACIONES
     */
    public function extraer_presentaciones($datos = null){
        $presentaciones = $this->presentacionesModel->extraer_presentaciones($datos);
        $response = ResponseHelper::sendResponse(true, 200, "Listado de presentaciones.", $presentaciones, []);

        return $response;
    }

    public function extraer_presentaciones_liquidar($id_convenio){
        $presentaciones = $this->presentacionesModel->extraer_presentaciones_liquidar($id_convenio);
        $response = ResponseHelper::sendResponse(true, 200, "Listado de presentaciones listas para liquidar.", $presentaciones);

        return $response;
    }

    public function extraer_presentacion($id_presentacion){
        $presentacion = $this->presentacionesModel->extraer_presentacion($id_presentacion);
        $presentacion['recibo'] = $this->presentacionesModel->extraer_recibos($id_presentacion);
        $response = ResponseHelper::sendResponse(true, 200, "Presentacion.", $presentacion, []);
        return $response;
    }

    public function extraer_recibos_presentacion($id_presentacion){
        $recibos = $this->presentacionesModel->extraer_recibos($id_presentacion);
        return  ResponseHelper::sendResponse(true, 200, "Recibos asociados a la presentación.", $recibos);
    }

    public function extraer_presentacion_farmacia($id_presentacion, $id_farmacia){
        $presentacion['cabecera'] = $this->presentacionesModel->extraer_presentacion_farmacia($id_presentacion, $id_farmacia);
        $presentacion['detalle'] = $this->presentacionesModel->extraer_presentacion_planes_farmacia($id_presentacion, $id_farmacia);

        return ResponseHelper::sendResponse(true, 200, "Presentacion de la farmacia", $presentacion);
    }

    public function eliminar_presentacion($id_presentacion){
        $consulta['delete'] = $this->presentacionesModel->eliminar_presentacion($id_presentacion);

        if ($consulta['delete']) {
            $response = ResponseHelper::sendResponse(true, 200, "La presentación se eliminó correctamente.", null, []);
        }else{
            $response = ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", null, []);
        }

        return $response;
    }

    public function actualizar_estado($id_presentacion, $estado){
        if ($estado == "AP") {
            $asientosController = new AsientosContablesController($this->dbc);
            $conveniosController = new ConveniosController($this->dbc);
            $presentacion = $this->presentacionesModel->extraer_presentacion($id_presentacion);
            $convenio = $conveniosController->extraer_convenio($presentacion['cabecera']['convenio_id']);

            $convenio = $convenio['data']['datos'];

            $payload['cabecera'] = array('ejercicio' => date("Y"),
                'fecha_aplicacion' => date("Y-m-d"),
                'tipo_origen' => 'PRE',
                'id_origen' => $id_presentacion,
                'descripcion' => "Presentacion {$id_presentacion} - {$convenio['nombre']} - {$presentacion['cabecera']['periodo']}",
                'nota' => "Presentacion {$id_presentacion} - {$convenio['nombre']} - {$presentacion['cabecera']['periodo']}"
            );
            $payload['detalle'] = [];
            $payload['detalle'][] = array('id_cuenta' => $convenio['cuenta_contable_activo'], 
                'debe' => $presentacion['cabecera']['total_a_pagar'],
                'haber' => 0
            );

            $payload['detalle'][] = array('id_cuenta' => $convenio['cuenta_contable_pasivo'], 
                'debe' => 0,
                'haber' => $presentacion['cabecera']['total_a_pagar']
            );


            $respuesta = $asientosController->insertar_asiento_contable($payload); 

            if (!$respuesta['success']) {
                return ResponseHelper::sendResponse(false, 200, "Ocurrió un error al registrar el asiento contable");
            }
        }

        if ($this->presentacionesModel->actualizar_estado($id_presentacion, $estado)) {
            return ResponseHelper::sendResponse(true, 200, "El estado de la presentación se actualizó correctamente");
        }else{
            return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso");
        }
    }

}
