app.service('AppService_SAP', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();

    /*****************************************
    * SERVICIOS RELACIONADOS CON SAP
    *******************************************/
    this.HTTP_ERP_Sap_Lectura = function (objetoEnviar) {
        var request = {
            method: 'POST',
            url: direccion_servidor + '/sfa/erp_sap_lectura',
            data: objetoEnviar,
            headers: {
                'Content-Type': undefined
            }
        };
		/*return $http({method: 'POST', url: direccion_servidor + '/sfa/erp_sap_lectura',
		data: objetoEnviar});*/

        return $http(request);
    }
    this.HTTP_ERP_Sap_Escritura = function (objetoEnviar) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/erp_sap_escritura', data: objetoEnviar }); }
    this.HTTP_ERP_Obtener_Logs_Sap = function (objetoEnviar) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtener_logs_interfaces_sap', data: objetoEnviar }); }
    this.HTTP_Obtener_Logs_Procedimientos = function () { return $http({ method: 'GET', url: direccion_servidor + '/sfa/ObtenerLogCatalogosProcedimientos' }); }
    this.HTTP_Obtener_Logs_Bodegas = function () { return $http({ method: 'GET', url: direccion_servidor + '/sfa/ObtenerLogCatalogoBodegas' }); }
    this.HTTP_Obtener_Logs_Empresas = function () { return $http({ method: 'GET', url: direccion_servidor + '/sfa/ObtenerLogCatalogoEmpresas' }); }
    this.HTTP_Obtener_Logs_Compannias = function () { return $http({ method: 'GET', url: direccion_servidor + '/sfa/ObtenerLogCatalogoCompanias' }); }
    this.HTTP_Obtener_Logs_Parametros_Procedimientos = function (objetoEnviar) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ObtenerParametrosProcedimientos', data: objetoEnviar }); }
    this.HTTP_Obtener_Logs_Ejecutar_Procedimientos = function (objetoEnviar) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/EjecutarProcedimiento', data: objetoEnviar }); }

});