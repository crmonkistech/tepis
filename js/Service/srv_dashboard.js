app.service('AppServiceDB', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /***********************************************
	* DASHBOARD
	***********************************************/
	this.HTTPObtenerCantidadFacturasPendientes = function (objetoDash) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCantidadFacturasPendientes', data: objetoDash }); }
	this.HTTPObtenerCantidadClientesActivos = function (objetoDash) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCantidadClientesActivos', data: objetoDash }); }
	this.HTTPObtenerCantidadRutasActivas = function (objetoDash) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCantidadRutasActivas', data: objetoDash }); }
	this.HTTPObtenerCantidadJornadasActivas = function (objetoDash) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCantidadJornadasActivas', data: objetoDash }); }
	this.HTTPObtenerCantidadFacturasMensual = function (objetoDash) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCantidadFacturasMes', data: objetoDash }); }
	this.HTTPObtenerMontosFacturas = function (objetoDash) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerMontosFacturas', data: objetoDash }); }
	this.HTTPObtenerMontosRecibosDinero = function (objetoDash) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerMontosRecibosDinero', data: objetoDash }); }
	this.HTTPObtenerBonificacionesJornada = function (objetoDash) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerBonificacionesJornada', data: objetoDash }); }

});