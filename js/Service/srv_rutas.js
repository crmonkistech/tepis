app.service('AppService_Rutas', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /**************************************************
	* SERVICIOS RELACIONADOS CON LAS RUTAS
	***************************************************/
	this.HTTPObtenerRutasCompletas = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ObtenerRutasSinFiltro', data: objetoRuta }); }
	this.HTTPObtenerRutas = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerRutas', data: objetoRuta }); }
	this.HTTPObtenerRutasInicio = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerRutasInicio', data: objetoRuta }); }
	this.HTTPClientesRutaID = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerClientesRutaID', data: objetoRuta }); }
	this.HTTPUsuariosRutaID = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerUsuariosRuta', data: objetoRuta }); }
	this.HTTPProcesosRutas = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosRutas', data: objetoRuta }); }

});