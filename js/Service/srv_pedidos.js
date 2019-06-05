app.service('AppService_Pedidos', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /*****************************************
	 * SERVICIOS RELACIONADOS CON LOS PEDIDOS *
	 *****************************************/
	this.HTTP_Obtener_Documentos_Pedidos = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ConsultaDocumentoPedidos', data: objetoDocumento }); }
	this.HTTP_Obtener_Detalle_Documentos_Pedidos = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ConsultaDetalleDocumentoPedidos', data: objetoDocumento }); }
	this.HTTP_Procesar_Documentos_Pedidos = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ConsumirProcesoPedido', data: objetoDocumento }); }
	this.HTTP_Obtener_Rutas_Combo = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ConsultaListaRutasProcesoPedidos', data: objetoDocumento }); }

});