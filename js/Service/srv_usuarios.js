app.service('AppService_Usuarios', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /*****************************************
	* SERVICIOS RELACIONADOS CON LOS USUARIOS
	*******************************************/
	this.HTTPObtenerUsuarios = function (objetoUsuario) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerUsuarios', data: objetoUsuario }); }
	this.HTTPObtenerUsuariosFiltro = function (objetoUsuario) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerUsuariosFiltro', data: objetoUsuario }); }
	this.HTTPObtenerUsuarioID = function (objetoUsuario) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerUsuarioID', data: objetoUsuario }); }
	this.HTTPProcesosUsuarios = function (objetoUsuario) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosUsuarios', data: objetoUsuario }); }

});