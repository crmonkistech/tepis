app.service('AppService_Bonificaciones', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /*****************************************
	* SERVICIOS RELACIONADOS CON LAS BONIFICACIONES
	*******************************************/
	this.HTTPObtenerBonificaciones = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerBonificaciones', data: objetoBonificacion }); }
	this.HTTPObtenerCategoriasProductosBonificaciones = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasProductosBonificaciones', data: objetoBonificacion }); }
	this.HTTPObtenerFamiliasClientesBonificaciones = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerFamiliasClientesBonificaciones', data: objetoBonificacion }); }
	this.HTTPValidarReglasBonificaciones = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/validarReglasBonificaciones', data: objetoBonificacion }); }
	this.HTTPProcesosBonificaciones = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosBonificaciones', data: objetoBonificacion }); }
	this.HTTPObtenerInformacionBonificacion = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerBonificacionID', data: objetoBonificacion }); }
	this.HTTPObtenerRutasBonificacion = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerRutasReglasBonificaciones', data: objetoBonificacion }); }
	this.HTTPObtenerListasPreciosClientesBonificacion = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerListasPreciosClientesReglasBonificaciones', data: objetoBonificacion }); }
	this.HTTPObtenerCategoriasClientesBonificacion = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasClientesReglasBonificaciones', data: objetoBonificacion }); }
	this.HTTPObtenerCategoriasProductosBonificacion = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasProductosReglasBonificaciones', data: objetoBonificacion }); }
	this.HTTPObtenerListasPreciosProductosBonificacion = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerListasPreciosProductosReglasBonificaciones', data: objetoBonificacion }); }

});