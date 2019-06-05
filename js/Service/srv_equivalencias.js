app.service('AppService_Equivalencias', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /**********************************************
	* SERVICIOS RELACIONADOS CON LAS EQUIVALENCIAS
	***********************************************/
	this.HTTPObtenerEquivalencias = function (objetoEquivalencia) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerEquivalencias', data: objetoEquivalencia }); }
	this.HTTPProcesosEquivalencias = function (objetoEquivalencia) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosEquivalencias', data: objetoEquivalencia }); }

});