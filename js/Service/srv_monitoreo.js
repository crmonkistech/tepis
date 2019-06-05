app.service('AppService_Monitoreo', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();

    /*****************************************
    * SERVICIOS RELACIONADOS CON MONITOREOS
    *******************************************/
    this.HTTP_Obtener_Monitoreos = function (objetoEnviar) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/consultas_monitoreo', data: objetoEnviar }); }
    this.HTTP_Ejecutar_Query_Monitoreo = function (objetoEnviar) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ejecutar_query', data: objetoEnviar }); }

});