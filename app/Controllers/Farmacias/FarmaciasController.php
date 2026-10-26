<?php
namespace App\Controllers\Farmacias;

//MODELOS
use App\Models\Farmacias\FarmaciasModel;

//HELPERS
use App\Helper\ResponseHelper;
use App\Helper\LoggerHelper;



class FarmaciasController{
    protected $dbc;
    private $farmaciasModel;
    private $directorio = "farmacias";

    function __construct(){
        $this->dbc = $GLOBALS['dbc'];
        $this->farmaciasModel = new FarmaciasModel($this->dbc);
    }

    public function nueva_farmacia($datos){
        if ($this->farmaciasModel->verificar_farmacia($datos['id_farmacia'])) {
            if ($this->farmaciasModel->nueva_farmacia($datos)) {
                LoggerHelper::registrar_log("[EXITO] - La farmacia se dió de alta correctamente. {$datos['id_farmacia']}", $this->directorio);
                $response = ResponseHelper::sendResponse(true, 200, "La farmacia se dió de alta correctamente.", null, []);
            }else{
                LoggerHelper::registrar_log("[ERROR] - Al dar de alta una nueva farmacia. {$datos['id_farmacia']}", $this->directorio);
                $response = ResponseHelper::sendResponse(false, 200, "Ocurrio un error durante el proceso.", null, []);
            }
        }else{
                LoggerHelper::registrar_log("[ERROR] - Al dar de alta una nueva farmacia. {$datos['id_farmacia']}. Codigo en uso.", $this->directorio);
            $response = ResponseHelper::sendResponse(false, 200, "El código de farmacia ya está en uso.", null, []);
        }

        return $response;
    }

    public function extraer_farmacias(){
        $farmacias = $this->farmaciasModel->extraer_farmacias();
        $response = ResponseHelper::sendResponse(true, 200, "Listado Farmacias.", $farmacias, []);
        return $response;
    }

    public function extraer_farmacia($id_farmacia){
        $datos['datos_farmacia'] = $this->farmaciasModel->extraer_farmacia($id_farmacia);
        $datos['convenios_habilitados'] = $this->farmaciasModel->extraer_convenios_habilitados($id_farmacia);

        $response = ResponseHelper::sendResponse(true, 200, "Datos de Farmacia.", $datos, []);
        return $response;
    }

    public function habilitar_convenio($id_farmacia, $id_convenio){
        if ($this->farmaciasModel->verificar_convenio_habilitado($id_farmacia, $id_convenio)) {
            if ($this->farmaciasModel->habilitar_convenio($id_farmacia, $id_convenio)) {
                return ResponseHelper::sendResponse(true, 200, "El convenio se habilito correctamente");
            }else{
                return ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso");
            }
        }else{
            return ResponseHelper::sendResponse(false, 200, "El convenio ya se encuentra habiltado para la farmacia");
        }
    }

    public function modificar_farmacia($datos){
        if ($this->farmaciasModel->modificar_farmacia($datos)) {
            LoggerHelper::registrar_log("[EXITO] - La farmacia se modificó correctamente.", $this->directorio, null);
            $response = ResponseHelper::sendResponse(true, 200, "La farmacia se modificó correctamente.", null, [], "Éxito", "success");
        }else{
            LoggerHelper::registrar_log("[ERROR] - Modificar una farmacia.", $this->directorio, null);
            $response = ResponseHelper::sendResponse(false, 200, "Ocurrio un error durante el proceso.", null, [], "Error", "error");
        }

        return $response;
    }

    public function cambiar_estado_farmacia($id_farmacia, $estado){
        if ($this->farmaciasModel->cambiar_estado_farmacia($id_farmacia, $estado)) {
            LoggerHelper::registrar_log("[EXITO] - Se actualizo el estado de una farmacia. ID: {$id_farmacia} ESTADO: {$estado}", $this->directorio);
            $response = ResponseHelper::sendResponse(true, 200, "Actualización de estado de farmacia.", null, []);
        }else{
            LoggerHelper::registrar_log("[ERROR] - Al actualizar el estado de una farmacia. ID: {$id_farmacia} ESTADO: {$estado}", $this->directorio);
            $response = ResponseHelper::sendResponse(false, 200, "Ocurrió un error durante el proceso.", null, []);
        }

        return $response;
    }

    public function sugerencias_farmacias($termino){
        return $this->farmaciasModel->sugerencias_farmacias($termino);
    }

}
