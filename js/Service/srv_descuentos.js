app.service('AppService_Descuentos', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();

    /*****************************************
    * SERVICIOS RELACIONADOS CON LOS DESCUENTOS
    *******************************************/
    this.HTTPObtenerDescuentos = function (objetoDescuento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDescuentos', data: objetoDescuento }); }
    this.HTTPProcesosDescuentos = function (objetoDescuento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosDescuentos', data: objetoDescuento }); }
    this.HTTPObtenerInfoDescuento = function (objetoDescuento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerInfoDescuento', data: objetoDescuento }); }

});