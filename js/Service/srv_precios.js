app.service('AppService_Precios', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /**************************************************
	* SERVICIOS RELACIONADOS CON LAS LISTAS DE PRECIOS
	***************************************************/
	this.HTTPObtenerListasPrecios = function (objetoListaPrecios) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerListasPrecios', data: objetoListaPrecios }); }
	this.HTTPProcesosListasPrecios = function (objetoListaPrecios) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosListasPrecios', data: objetoListaPrecios }); }

});