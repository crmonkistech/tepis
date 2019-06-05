app.service('AppService_Cuentas', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /*****************************************
	* SERVICIOS RELACIONADOS CON LAS CUENTAS
	*******************************************/
	this.HTTPObtenerCuentas = function (objetoCuenta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCuentas', data: objetoCuenta }); }
	this.HTTPProcesosCuentas = function (objetoCuenta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosCuentas', data: objetoCuenta }); }

});