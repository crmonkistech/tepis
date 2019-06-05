app.service('AppService_Bodegas', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /*****************************************
	* SERVICIOS RELACIONADOS CON LAS BODEGAS
	*******************************************/
	this.HTTPObtenerBodegas = function (objetoBodega) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerBodegas', data: objetoBodega }); }
	this.HTTPObtenerBodegasUsuario = function (objetoBodega) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerBodegasUsuario', data: objetoBodega }); }
	this.HTTPProcesosBodega = function (objetoBanco) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosBodega', data: objetoBanco }); }
	this.HTTP_Actualizar_Inventario_Bodega_Unico = function (Objeto) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/actualizar/inventario/bodega/unico', data: Objeto }); }

});