app.service('AppService_MotivosNoVenta', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /**************************************************
	* SERVICIOS RELACIONADOS CON MOTIVOS DE NO VENTA
	***************************************************/
	this.HTTPObtenerMotivosNoVenta = function (objetoMotivo) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerMotivosNoVenta', data: objetoMotivo }); }
	this.HTTPProcesosMotivosNoVenta = function (objetoMotivo) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosMotivosNoVenta', data: objetoMotivo }); }
	this.HTTPProcesoActualizacionMotivosNoVenta = function (objetoMotivo) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ActualizarMotivosNoVenta', data: objetoMotivo }); }

});