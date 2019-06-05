app.service('AppService_Parametros', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /*****************************************
	* SERVICIOS RELACIONADOS CON LOS PARAMETROS
	******************************************/
	this.HTTPObtenerParametros = function (objetoParametro) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerParametrosEmpresa', data: objetoParametro }); }
	this.HTTPProcesosParametros = function (objetoParametro) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosParametros', data: objetoParametro }); }
    this.HTTPObtenerFormatosExcel = function (objetoParametro) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/formatos/archivo/Excel', data: objetoParametro }); }
    
});