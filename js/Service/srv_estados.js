app.service('AppService_Estados', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
   /**************************************************
	* SERVICIOS RELACIONADOS CON LOS ESTADOS
	***************************************************/
	this.HTTPObtenerEstadosEntrega = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerEstadosEntregas', data: objetoRuta }); }

});