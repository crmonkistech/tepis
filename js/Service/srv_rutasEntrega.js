app.service('AppService_RutasEntrega', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /**************************************************
	* SERVICIOS RELACIONADOS CON LAS RUTAS DE ENTREGA
	***************************************************/
	this.HTTPObtenerRutasEntrega = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerRutasEntrega', data: objetoRuta }); }
	this.HTTPClientesRutaEntregaID = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerClientesRutaEntregas', data: objetoRuta }); }
	this.HTTPInfoRutaEntregaID = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerInfoRutaEntregaID', data: objetoRuta }); }
	this.HTTPObtenerDocumentosEntrega = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDocumentosEntrega', data: objetoRuta }); }
	this.HTTPObtenerDocumentosRutaEntregaID = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDocumentosRutaEntregaID', data: objetoRuta }); }
	this.HTTPObtenerUsuariosRutaEntrega = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerUsuariosRutaEntrega', data: objetoRuta }); }
	this.HTTPProcesosRutasEntrega = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosRutasEntrega', data: objetoRuta }); }

});