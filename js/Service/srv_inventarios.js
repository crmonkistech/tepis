app.service('AppService_Inventarios', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /*****************************************
	* SERVICIOS RELACIONADOS CON LOS INVENTARIOS
	*******************************************/
	this.HTTPObtenerInventarioBodega = function (objetoInventario) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerInventarioBodega', data: objetoInventario }); }
	this.HTTPObtenerInventarioUsuario = function (objetoInventario) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerInventarioAgente', data: objetoInventario }); }

});