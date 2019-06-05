app.service('AppService_Roles', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /*****************************************
	* SERVICIOS RELACIONADOS CON LOS ROLES
	*******************************************/
	this.HTTPObtenerRoles = function (objetoRol) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerRoles', data: objetoRol }); }
	this.HTTPProcesosRoles = function (objetoRol) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosRoles', data: objetoRol }); }

});