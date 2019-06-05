app.service('AppService_Categorias', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();
    
    /*******************************************
	* SERVICIOS RELACIONADOS CON CATEGORIAS
	********************************************/
	this.HTTPObtenerCategoriasBodegas = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasBodegas', data: objetoCategoria }); }
	this.HTTPObtenerCategoriasClientes = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasClientes', data: objetoCategoria }); }
	this.HTTPObtenerCategoriasDocumentos = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasDocumentos', data: objetoCategoria }); }
	this.HTTPObtenerCategoriasProductosInicio = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasProductosInicio', data: objetoCategoria }); }
	this.HTTPObtenerCategoriasProductos = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasProductosBackoffice', data: objetoCategoria }); }
	this.HTTPObtenerFamiliasClienteInicio = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerFamiliasClienteInicio', data: objetoCategoria }); }
	this.HTTPObtenerFamiliasCliente = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerFamiliasCliente', data: objetoCategoria }); }
	this.HTTPObtenerCategoriasRecibosDinero = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasRecibosDinero', data: objetoCategoria }); }
	this.HTTPObtenerFormasPago = function (objetoFormaPago) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerFormasPago', data: objetoFormaPago }); }
	this.HTTPProcesosCategoriasProductos = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosCategoriasProductos', data: objetoCategoria }); }
	this.HTTPProcesosFamiliasClientes = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosFamiliasClientes', data: objetoCategoria }); }
	this.HTTPObtenerInformacionFamiliaClienteID = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerFamiliaClienteID', data: objetoCategoria }); }
	this.HTTPObtenerInformacionCategoriaProductoID = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriaProductoID', data: objetoCategoria }); }
	this.HTTPObtenerCategoriasPreguntas = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasPreguntas', data: objetoCategoria }); }

});