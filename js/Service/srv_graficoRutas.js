app.service('AppService_GraficoRutas', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();

    /**********************************************
* SERVICIOS RELACIONADOS CON GRÁFICA RUTAS    *
**********************************************/
    this.HTTP_Obtener_Datos_Grafico_Rutas = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ConsultaDatosGraficaRutas', data: objetoDocumento }); }
    this.HTTP_Obtener_Detalle_Ruta_Grafico = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ConsultaRutasDetalleGrafico', data: objetoDocumento }); }

});