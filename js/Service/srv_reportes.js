app.service('AppService_Reportes', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();

    /*****************************************
    * SERVICIOS RELACIONADOS CON LOS REPORTES
    *******************************************/
    this.HTTP_Generar_Reporte_Recorridos = function () { return $http({ method: 'POST', url: direccion_servidor + '/sfa/generar/reporte/recorridos' }); }

});