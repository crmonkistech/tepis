app.service('AppService_Monedas', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
   /**************************************************
	* SERVICIOS RELACIONADOS CON MONEDAS
	***************************************************/
	this.HTTPObtenerMonedas = function (objetoMoneda) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerMonedas', data: objetoMoneda }); }

});