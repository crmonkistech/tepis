app.service('AppService_Clientes', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
   /*****************************************
	* SERVICIOS RELACIONADOS CON LOS CLIENTES
	*******************************************/
	this.HTTPObtenerClientes = function (objetoCliente) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerClientes', data: objetoCliente }); }
	this.HTTPObtenerClientesInicio = function (objetoCliente) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerClientesInicio', data: objetoCliente }); }
	this.HTTPProcesosClientes = function (objetoCliente) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosClientes', data: objetoCliente }); }
	this.HTTPObtenerCategoriasCliente = function (objetoCliente) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerFamiliasCliente', data: objetoCliente }); }
	this.HTTPObtenerPeriodos = function (objetoPeriodo) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerPeriodos', data: objetoPeriodo }); }
	this.HTTPObtenerPeriodoID = function (objetoPeriodo) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerPeriodoID', data: objetoPeriodo }); }
	this.HTTPProcesosPeriodos = function (objetoPeriodo) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosPeriodos', data: objetoPeriodo }); }
	this.HTTPObtenerPeriodosRuta = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerPeriodosRuta', data: objetoRuta }); }

});