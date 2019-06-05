app.service('AppService_Permisos', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /*****************************************
	* SERVICIOS RELACIONADOS CON LOS PERMISOS
	*******************************************/
	this.HTTPObtenerPermisos = function (objetoPermiso) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerPermisos', data: objetoPermiso }); }

});