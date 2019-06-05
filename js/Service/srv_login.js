app.service('AppServiceLG', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /***********************************************
	* INICIO DE SESION
	***********************************************/
	this.HTTPInicioSesion = function (objetoUsuario) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/login_web', data: objetoUsuario }); }
	this.HTTPCerrarSesion = function (objetoUsuario) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/cerrarSesion', data: objetoUsuario }); }

});