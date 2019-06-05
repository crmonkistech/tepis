app.service('AppService_Impuestos', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();

    /*****************************************
    * SERVICIOS RELACIONADOS CON LOS IMPUESTOS
    *******************************************/
    this.HTTPObtenerImpuestos = function (objetoImpuesto) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerImpuestos', data: objetoImpuesto }); }
    this.HTTPProcesosImpuestos = function (objetoImpuesto) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosImpuestos', data: objetoImpuesto }); }
    this.HTTPObtenerInfoImpuesto = function (objetoImpuesto) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerInfoImpuesto', data: objetoImpuesto }); }

});