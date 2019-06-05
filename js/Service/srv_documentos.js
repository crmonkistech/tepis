app.service('AppService_Documentos', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /*****************************************
	* SERVICIOS RELACIONADOS CON LOS DOCUMENTOS
	*******************************************/
	this.HTTPObtenerDocumentosFiltro = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDocumentosFiltro', data: objetoDocumento }); }
	this.HTTPObtenerDetallesDocumentosFiltro = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDetallesDocumentosFiltro', data: objetoDocumento }); }
	this.HTTPObtenerDetallesDocumentosEntregas = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ObtenerDetallesDocumentosEntregas', data: objetoDocumento }); }
	this.HTTPObtenerDetallesBonificacionesFiltro = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDetallesBonificacionesFiltro', data: objetoDocumento }); }
	this.HTTP_Anular_Desmarcar_Recibo_Dinero = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/anular_desmarcar/recibos_dinero', data: objetoDocumento }); }
	this.HTTP_Obtener_Usuarios_Mapa = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ObtenerUsuariosParaDocumentosMapa', data: objetoDocumento }); }
	this.HTTP_Obtener_Marcadores_Mapa = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ConsultaMarcadoresDocumentoMapas', data: objetoDocumento }); }
	this.HTTP_Obtener_Descripcion_Cagtegoria_Mapa = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ObtenerDescripcionCategoriaDocumentos', data: objetoDocumento }); }
	this.HTTP_Obtener_Stock_Transfer_Jornada = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ObtenerStockTransferJornada', data: objetoDocumento }); }

});