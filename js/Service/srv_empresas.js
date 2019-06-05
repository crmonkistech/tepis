app.service('AppService_Empresas', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /*****************************************
	* SERVICIOS RELACIONADOS CON LAS EMPRESAS
	******************************************/
	this.HTTPObtenerEmpresas = function (objetoEmpresa) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerEmpresas', data: objetoEmpresa }); }

});