app.service('AppService_DetallesNoVenta', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();

    /**********************************************
    * SERVICIOS RELACIONADOS CON DETALLE NO VENTA *
    **********************************************/
    this.HTTP_Obtener_Detalles_No_Venta = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ConsultaDetalleNoVenta', data: objetoDocumento }); }

});