app.service('AppService_MotivosDevolucion', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /**************************************************
	* SERVICIOS RELACIONADOS CON MOTIVOS DE DEVOLUCION
	***************************************************/
	this.HTTPObtenerMotivosDevolucion = function (objetoMotivo) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerMotivosDevolucion', data: objetoMotivo }); }
	this.HTTPProcesosMotivosDevolucion = function (objetoMotivo) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosMotivosDevolucion', data: objetoMotivo }); }
	this.HTTPProcesoActualizacionMotivosDevolucion = function (objetoMotivo) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ActualizarMotivosDevolucion', data: objetoMotivo }); }

});