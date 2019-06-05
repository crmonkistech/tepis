app.service('AppService_GastosEnRuta', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
	/**************************************************
	* SERVICIOS RELACIONADOS CON GASTOS EN RUTA
	***************************************************/
	this.HTTPObtenerCategoriasGastosRuta = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasGastosRuta', data: objetoCategoria }); }
	this.HTTPObtenerGastoRutaID = function (objetoGastoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerGastoRutaID', data: objetoGastoRuta }); }
	this.HTTPProcesosGastosRuta = function (objetoGastoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosGastosRuta', data: objetoGastoRuta }); }

});