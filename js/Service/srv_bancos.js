app.service('AppService_Bancos', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /*****************************************
	* SERVICIOS RELACIONADOS CON LOS BANCOS
	*******************************************/
	this.HTTPObtenerBancos = function (objetoBanco) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerBancos', data: objetoBanco }); }
	this.HTTPProcesosBanco = function (objetoBanco) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosBanco', data: objetoBanco }); }

});