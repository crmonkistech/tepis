app.service('AppService_Encuestas', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();

    /*****************************************
	* SERVICIOS RELACIONADOS CON ENCUESTAS
	******************************************/
    this.HTTPObtenerEncuestas = function (objetoEncuesta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerEncuestas', data: objetoEncuesta }); }
    this.HTTPObtenerPreguntasEncuesta = function (objetoEncuesta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerPreguntasEncuesta', data: objetoEncuesta }); }
    this.HTTPObtenerRespuestasEncuesta = function (objetoEncuesta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDetallesRespuestaEncuesta', data: objetoEncuesta }); }
    this.HTTPObtenerUsuariosEncuesta = function (objetoEncuesta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerUsuariosEncuesta', data: objetoEncuesta }); }
    this.HTTPProcesosEncuestas = function (objetoEncuesta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosEncuestas', data: objetoEncuesta }); }

});