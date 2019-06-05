app.service('AppService_Productos', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /**************************************************
	* SERVICIOS RELACIONADOS CON LOS PRODUCTOS
	***************************************************/
	this.HTTPObtenerProductos = function (objetoProducto) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerProductos', data: objetoProducto }); }
	this.HTTPProcesosProductos = function (objetoProducto) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosProductos', data: objetoProducto }); }
	this.HTTPObtenerProductosFiltro = function (objetoProducto) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerProductosFiltro', data: objetoProducto }); }

});