app.service('AppService', function ($http) {

	//var direccion_IP = 'http://200.74.249.8';
	//var puerto = '80/API_SFATesting';
	//var direccion_IP = 'http://192.168.0.183';
	//var direccion_IP = 'http://200.74.249.8';
	//var direccion_IP = 'http://192.168.0.195';
	// var direccion_IP = 'http://localhost';
	//var direccion_IP = 'http://200.74.249.8';
	//var puerto = '80/API_Desarrollo_FE';
	//var puerto = '80/test_api';//
	// var puerto = '12037';
	//var puerto = '6565';
	// var direccion_servidor = direccion_IP + ':' + puerto;

	// /***********************************************
	// * DASHBOARD
	// ***********************************************/
	// this.HTTPObtenerCantidadFacturasPendientes = function (objetoDash) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCantidadFacturasPendientes', data: objetoDash }); }
	// this.HTTPObtenerCantidadClientesActivos = function (objetoDash) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCantidadClientesActivos', data: objetoDash }); }
	// this.HTTPObtenerCantidadRutasActivas = function (objetoDash) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCantidadRutasActivas', data: objetoDash }); }
	// this.HTTPObtenerCantidadJornadasActivas = function (objetoDash) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCantidadJornadasActivas', data: objetoDash }); }
	// this.HTTPObtenerCantidadFacturasMensual = function (objetoDash) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCantidadFacturasMes', data: objetoDash }); }
	// this.HTTPObtenerMontosFacturas = function (objetoDash) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerMontosFacturas', data: objetoDash }); }
	// this.HTTPObtenerMontosRecibosDinero = function (objetoDash) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerMontosRecibosDinero', data: objetoDash }); }
	// this.HTTPObtenerBonificacionesJornada = function (objetoDash) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerBonificacionesJornada', data: objetoDash }); }

	// /***********************************************
	// * INICIO DE SESION
	// ***********************************************/
	// this.HTTPInicioSesion = function (objetoUsuario) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/login_web', data: objetoUsuario }); }
	// this.HTTPCerrarSesion = function (objetoUsuario) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/cerrarSesion', data: objetoUsuario }); }

	// /*****************************************
	// * SERVICIOS RELACIONADOS CON LAS EMPRESAS
	// ******************************************/
	// this.HTTPObtenerEmpresas = function (objetoEmpresa) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerEmpresas', data: objetoEmpresa }); }

	// /*****************************************
	// * SERVICIOS RELACIONADOS CON LOS PARAMETROS
	// ******************************************/
	// this.HTTPObtenerParametros = function (objetoParametro) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerParametrosEmpresa', data: objetoParametro }); }
	// this.HTTPProcesosParametros = function (objetoParametro) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosParametros', data: objetoParametro }); }
	// this.HTTPObtenerFormatosExcel = function (objetoParametro) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/formatos/archivo/Excel', data: objetoParametro }); }

	// /*****************************************
	// * SERVICIOS RELACIONADOS CON LOS BANCOS
	// *******************************************/
	// this.HTTPObtenerBancos = function (objetoBanco) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerBancos', data: objetoBanco }); }
	// this.HTTPProcesosBanco = function (objetoBanco) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosBanco', data: objetoBanco }); }

	// /*****************************************
	// * SERVICIOS RELACIONADOS CON LAS BODEGAS
	// *******************************************/
	// this.HTTPObtenerBodegas = function (objetoBodega) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerBodegas', data: objetoBodega }); }
	// this.HTTPObtenerBodegasUsuario = function (objetoBodega) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerBodegasUsuario', data: objetoBodega }); }
	// this.HTTPProcesosBodega = function (objetoBanco) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosBodega', data: objetoBanco }); }
	// this.HTTP_Actualizar_Inventario_Bodega_Unico = function (Objeto) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/actualizar/inventario/bodega/unico', data: Objeto }); }

	// /*****************************************
	// * SERVICIOS RELACIONADOS CON LAS BONIFICACIONES
	// *******************************************/
	// this.HTTPObtenerBonificaciones = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerBonificaciones', data: objetoBonificacion }); }
	// this.HTTPObtenerCategoriasProductosBonificaciones = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasProductosBonificaciones', data: objetoBonificacion }); }
	// this.HTTPObtenerFamiliasClientesBonificaciones = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerFamiliasClientesBonificaciones', data: objetoBonificacion }); }
	// this.HTTPValidarReglasBonificaciones = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/validarReglasBonificaciones', data: objetoBonificacion }); }
	// this.HTTPProcesosBonificaciones = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosBonificaciones', data: objetoBonificacion }); }
	// this.HTTPObtenerInformacionBonificacion = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerBonificacionID', data: objetoBonificacion }); }
	// this.HTTPObtenerRutasBonificacion = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerRutasReglasBonificaciones', data: objetoBonificacion }); }
	// this.HTTPObtenerListasPreciosClientesBonificacion = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerListasPreciosClientesReglasBonificaciones', data: objetoBonificacion }); }
	// this.HTTPObtenerCategoriasClientesBonificacion = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasClientesReglasBonificaciones', data: objetoBonificacion }); }
	// this.HTTPObtenerCategoriasProductosBonificacion = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasProductosReglasBonificaciones', data: objetoBonificacion }); }
	// this.HTTPObtenerListasPreciosProductosBonificacion = function (objetoBonificacion) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerListasPreciosProductosReglasBonificaciones', data: objetoBonificacion }); }

	// /*****************************************
	// * SERVICIOS RELACIONADOS CON LAS CUENTAS
	// *******************************************/
	// this.HTTPObtenerCuentas = function (objetoCuenta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCuentas', data: objetoCuenta }); }
	// this.HTTPProcesosCuentas = function (objetoCuenta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosCuentas', data: objetoCuenta }); }

	// /*****************************************
	// * SERVICIOS RELACIONADOS CON LOS CLIENTES
	// *******************************************/
	// this.HTTPObtenerClientes = function (objetoCliente) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerClientes', data: objetoCliente }); }
	// this.HTTPObtenerClientesInicio = function (objetoCliente) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerClientesInicio', data: objetoCliente }); }
	// this.HTTPProcesosClientes = function (objetoCliente) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosClientes', data: objetoCliente }); }
	// this.HTTPObtenerCategoriasCliente = function (objetoCliente) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerFamiliasCliente', data: objetoCliente }); }
	// this.HTTPObtenerPeriodos = function (objetoPeriodo) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerPeriodos', data: objetoPeriodo }); }
	// this.HTTPObtenerPeriodoID = function (objetoPeriodo) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerPeriodoID', data: objetoPeriodo }); }
	// this.HTTPProcesosPeriodos = function (objetoPeriodo) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosPeriodos', data: objetoPeriodo }); }
	// this.HTTPObtenerPeriodosRuta = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerPeriodosRuta', data: objetoRuta }); }

	// /*****************************************
	// * SERVICIOS RELACIONADOS CON LOS DESCUENTOS
	// *******************************************/
	// this.HTTPObtenerDescuentos = function (objetoDescuento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDescuentos', data: objetoDescuento }); }
	// this.HTTPProcesosDescuentos = function (objetoDescuento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosDescuentos', data: objetoDescuento }); }
	// this.HTTPObtenerInfoDescuento = function (objetoDescuento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerInfoDescuento', data: objetoDescuento }); }

	// /*****************************************
	// * SERVICIOS RELACIONADOS CON LOS DOCUMENTOS
	// *******************************************/
	// this.HTTPObtenerDocumentosFiltro = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDocumentosFiltro', data: objetoDocumento }); }
	// this.HTTPObtenerDetallesDocumentosFiltro = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDetallesDocumentosFiltro', data: objetoDocumento }); }
	// this.HTTPObtenerDetallesBonificacionesFiltro = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDetallesBonificacionesFiltro', data: objetoDocumento }); }
	// this.HTTP_Anular_Desmarcar_Recibo_Dinero = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/anular_desmarcar/recibos_dinero', data: objetoDocumento }); }
	// this.HTTP_Obtener_Usuarios_Mapa = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ObtenerUsuariosParaDocumentosMapa', data: objetoDocumento }); }
	// this.HTTP_Obtener_Marcadores_Mapa = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ConsultaMarcadoresDocumentoMapas', data: objetoDocumento }); }
	// this.HTTP_Obtener_Descripcion_Cagtegoria_Mapa = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ObtenerDescripcionCategoriaDocumentos', data: objetoDocumento }); }
	// this.HTTP_Obtener_Stock_Transfer_Jornada = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ObtenerStockTransferJornada', data: objetoDocumento }); }

	// /*****************************************
	//  * SERVICIOS RELACIONADOS CON LOS PEDIDOS *
	//  *****************************************/
	// this.HTTP_Obtener_Documentos_Pedidos = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ConsultaDocumentoPedidos', data: objetoDocumento }); }
	// this.HTTP_Obtener_Detalle_Documentos_Pedidos = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ConsultaDetalleDocumentoPedidos', data: objetoDocumento }); }
	// this.HTTP_Procesar_Documentos_Pedidos = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ConsumirProcesoPedido', data: objetoDocumento }); }
	// this.HTTP_Obtener_Rutas_Combo = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ConsultaListaRutasProcesoPedidos', data: objetoDocumento }); }

	// /**********************************************
	// * SERVICIOS RELACIONADOS CON DETALLE NO VENTA *
	// **********************************************/
	// this.HTTP_Obtener_Detalles_No_Venta = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ConsultaDetalleNoVenta', data: objetoDocumento }); }

	// /**********************************************
	// * SERVICIOS RELACIONADOS CON GRÁFICA RUTAS    *
	// **********************************************/
	// this.HTTP_Obtener_Datos_Grafico_Rutas = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ConsultaDatosGraficaRutas', data: objetoDocumento }); }
	// this.HTTP_Obtener_Detalle_Ruta_Grafico = function (objetoDocumento) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ConsultaRutasDetalleGrafico', data: objetoDocumento }); }

	// /*****************************************
	// * SERVICIOS RELACIONADOS CON LOS REPORTES
	// *******************************************/
	// this.HTTP_Generar_Reporte_Recorridos = function () { return $http({ method: 'POST', url: direccion_servidor + '/sfa/generar/reporte/recorridos' }); }

	// /**********************************************
	// * SERVICIOS RELACIONADOS CON LAS EQUIVALENCIAS
	// ***********************************************/
	// this.HTTPObtenerEquivalencias = function (objetoEquivalencia) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerEquivalencias', data: objetoEquivalencia }); }
	// this.HTTPProcesosEquivalencias = function (objetoEquivalencia) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosEquivalencias', data: objetoEquivalencia }); }

	// /*****************************************
	// * SERVICIOS RELACIONADOS CON ENCUESTAS
	// ******************************************/
	// this.HTTPObtenerEncuestas = function (objetoEncuesta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerEncuestas', data: objetoEncuesta }); }
	// this.HTTPObtenerPreguntasEncuesta = function (objetoEncuesta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerPreguntasEncuesta', data: objetoEncuesta }); }
	// this.HTTPObtenerRespuestasEncuesta = function (objetoEncuesta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDetallesRespuestaEncuesta', data: objetoEncuesta }); }
	// this.HTTPObtenerUsuariosEncuesta = function (objetoEncuesta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerUsuariosEncuesta', data: objetoEncuesta }); }
	// this.HTTPProcesosEncuestas = function (objetoEncuesta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosEncuestas', data: objetoEncuesta }); }

	// /*****************************************
	// * SERVICIOS RELACIONADOS CON LOS IMPUESTOS
	// *******************************************/
	// this.HTTPObtenerImpuestos = function (objetoImpuesto) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerImpuestos', data: objetoImpuesto }); }
	// this.HTTPProcesosImpuestos = function (objetoImpuesto) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosImpuestos', data: objetoImpuesto }); }
	// this.HTTPObtenerInfoImpuesto = function (objetoImpuesto) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerInfoImpuesto', data: objetoImpuesto }); }

	// /**************************************************
	// * SERVICIOS RELACIONADOS CON LAS LISTAS DE PRECIOS
	// ***************************************************/
	// this.HTTPObtenerListasPrecios = function (objetoListaPrecios) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerListasPrecios', data: objetoListaPrecios }); }
	// this.HTTPProcesosListasPrecios = function (objetoListaPrecios) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosListasPrecios', data: objetoListaPrecios }); }

	// /**************************************************
	// * SERVICIOS RELACIONADOS CON LAS RUTAS
	// ***************************************************/
	// this.HTTPObtenerRutasCompletas = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ObtenerRutasSinFiltro', data: objetoRuta }); }
	// this.HTTPObtenerRutas = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerRutas', data: objetoRuta }); }
	// this.HTTPObtenerRutasInicio = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerRutasInicio', data: objetoRuta }); }
	// this.HTTPClientesRutaID = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerClientesRutaID', data: objetoRuta }); }
	// this.HTTPUsuariosRutaID = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerUsuariosRuta', data: objetoRuta }); }
	// this.HTTPProcesosRutas = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosRutas', data: objetoRuta }); }

	// /**************************************************
	// * SERVICIOS RELACIONADOS CON LAS RUTAS DE ENTREGA
	// ***************************************************/
	// this.HTTPObtenerRutasEntrega = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerRutasEntrega', data: objetoRuta }); }
	// this.HTTPClientesRutaEntregaID = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerClientesRutaEntregas', data: objetoRuta }); }
	// this.HTTPInfoRutaEntregaID = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerInfoRutaEntregaID', data: objetoRuta }); }
	// this.HTTPObtenerDocumentosEntrega = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDocumentosEntrega', data: objetoRuta }); }
	// this.HTTPObtenerDocumentosRutaEntregaID = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDocumentosRutaEntregaID', data: objetoRuta }); }
	// this.HTTPObtenerUsuariosRutaEntrega = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerUsuariosRutaEntrega', data: objetoRuta }); }
	// this.HTTPProcesosRutasEntrega = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosRutasEntrega', data: objetoRuta }); }


	// /**************************************************
	// * SERVICIOS RELACIONADOS CON LOS ESTADOS
	// ***************************************************/
	// this.HTTPObtenerEstadosEntrega = function (objetoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerEstadosEntregas', data: objetoRuta }); }

	// /**************************************************
	// * SERVICIOS RELACIONADOS CON LOS PRODUCTOS
	// ***************************************************/
	// this.HTTPObtenerProductos = function (objetoProducto) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerProductos', data: objetoProducto }); }
	// this.HTTPProcesosProductos = function (objetoProducto) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosProductos', data: objetoProducto }); }
	// this.HTTPObtenerProductosFiltro = function (objetoProducto) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerProductosFiltro', data: objetoProducto }); }

	// /**************************************************
	// * SERVICIOS RELACIONADOS CON CATEGORIAS
	// ***************************************************/
	// this.HTTPObtenerCategoriasBodegas = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasBodegas', data: objetoCategoria }); }
	// this.HTTPObtenerCategoriasClientes = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasClientes', data: objetoCategoria }); }
	// this.HTTPObtenerCategoriasDocumentos = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasDocumentos', data: objetoCategoria }); }
	// this.HTTPObtenerCategoriasProductosInicio = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasProductosInicio', data: objetoCategoria }); }
	// this.HTTPObtenerCategoriasProductos = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasProductosBackoffice', data: objetoCategoria }); }
	// this.HTTPObtenerFamiliasClienteInicio = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerFamiliasClienteInicio', data: objetoCategoria }); }
	// this.HTTPObtenerFamiliasCliente = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerFamiliasCliente', data: objetoCategoria }); }
	// this.HTTPObtenerCategoriasRecibosDinero = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasRecibosDinero', data: objetoCategoria }); }
	// this.HTTPObtenerFormasPago = function (objetoFormaPago) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerFormasPago', data: objetoFormaPago }); }
	// this.HTTPProcesosCategoriasProductos = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosCategoriasProductos', data: objetoCategoria }); }
	// this.HTTPProcesosFamiliasClientes = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosFamiliasClientes', data: objetoCategoria }); }
	// this.HTTPObtenerInformacionFamiliaClienteID = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerFamiliaClienteID', data: objetoCategoria }); }
	// this.HTTPObtenerInformacionCategoriaProductoID = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriaProductoID', data: objetoCategoria }); }
	// this.HTTPObtenerCategoriasPreguntas = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasPreguntas', data: objetoCategoria }); }

	// /**************************************************
	// * SERVICIOS RELACIONADOS CON GASTOS EN RUTA
	// ***************************************************/
	// this.HTTPObtenerCategoriasGastosRuta = function (objetoCategoria) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerCategoriasGastosRuta', data: objetoCategoria }); }
	// this.HTTPObtenerGastoRutaID = function (objetoGastoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerGastoRutaID', data: objetoGastoRuta }); }
	// this.HTTPProcesosGastosRuta = function (objetoGastoRuta) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosGastosRuta', data: objetoGastoRuta }); }

	// /**************************************************
	// * SERVICIOS RELACIONADOS CON MONEDAS
	// ***************************************************/
	// this.HTTPObtenerMonedas = function (objetoMoneda) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerMonedas', data: objetoMoneda }); }

	// /**************************************************
	// * SERVICIOS RELACIONADOS CON MOTIVOS DE DEVOLUCION
	// ***************************************************/
	// this.HTTPObtenerMotivosDevolucion = function (objetoMotivo) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerMotivosDevolucion', data: objetoMotivo }); }
	// this.HTTPProcesosMotivosDevolucion = function (objetoMotivo) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosMotivosDevolucion', data: objetoMotivo }); }
	// this.HTTPProcesoActualizacionMotivosDevolucion = function (objetoMotivo) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ActualizarMotivosDevolucion', data: objetoMotivo }); }

	// /**************************************************
	// * SERVICIOS RELACIONADOS CON MOTIVOS DE NO VENTA
	// ***************************************************/
	// this.HTTPObtenerMotivosNoVenta = function (objetoMotivo) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerMotivosNoVenta', data: objetoMotivo }); }
	// this.HTTPProcesosMotivosNoVenta = function (objetoMotivo) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosMotivosNoVenta', data: objetoMotivo }); }
	// this.HTTPProcesoActualizacionMotivosNoVenta = function (objetoMotivo) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ActualizarMotivosNoVenta', data: objetoMotivo }); }

	// /*****************************************
	// * SERVICIOS RELACIONADOS CON LOS ROLES
	// *******************************************/
	// this.HTTPObtenerRoles = function (objetoRol) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerRoles', data: objetoRol }); }
	// this.HTTPProcesosRoles = function (objetoRol) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosRoles', data: objetoRol }); }

	// /*****************************************
	// * SERVICIOS RELACIONADOS CON LOS PERMISOS
	// *******************************************/
	// this.HTTPObtenerPermisos = function (objetoPermiso) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerPermisos', data: objetoPermiso }); }

	// /*****************************************
	// * SERVICIOS RELACIONADOS CON LOS USUARIOS
	// *******************************************/
	// this.HTTPObtenerUsuarios = function (objetoUsuario) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerUsuarios', data: objetoUsuario }); }
	// this.HTTPObtenerUsuariosFiltro = function (objetoUsuario) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerUsuariosFiltro', data: objetoUsuario }); }
	// this.HTTPObtenerUsuarioID = function (objetoUsuario) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerUsuarioID', data: objetoUsuario }); }
	// this.HTTPProcesosUsuarios = function (objetoUsuario) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/procesosUsuarios', data: objetoUsuario }); }

	// /*****************************************
	// * SERVICIOS RELACIONADOS CON LAS JORNADAS
	// *******************************************/
	// this.HTTPObtenerJornadas = function (objetoJornada) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerJornadas', data: objetoJornada }); }
	// this.HTTPObtenerJornadasID = function (objetoJornada) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerJornadaID', data: objetoJornada }); }
	// this.HTTPObtenerDocumentosJornada = function (objetoJornada) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDocumentosJornada', data: objetoJornada }); }
	// this.HTTPObtenerRecibosDineroJornada = function (objetoJornada) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerRecibosDineroJornada', data: objetoJornada }); }
	// this.HTTPActualizarEstadoDeposito = function (objetoDeposito) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/actualizarEstadoDeposito', data: objetoDeposito }); }
	// this.HTTPObtenerGastosRutaDeposito = function (objetoDeposito) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerGastosRutaDeposito', data: objetoDeposito }); }
	// this.HTTPObtenerDepositosJornada = function (objetoJornada) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDepositosJornada', data: objetoJornada }); }
	// this.HTTPObtenerDocumentosReciboDinero = function (objetoReciboDinero) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDocumentosReciboDinero', data: objetoReciboDinero }); }
	// this.HTTP_subir_archivos_al_Servidor = function (objetoEnvio) {
	// 	//var datos = HttpContext.Current.Request.Form["formulario_Files"];
	// 	return $http({ method: 'POST', url: direccion_servidor + '/sfa/subir/archivo/Excel', data: objetoEnvio });
	// }
	// this.HTTP_descargar_archivos_al_Servidor = function (objetoEnvio) {
	// 	//var datos = HttpContext.Current.Request.Form["formulario_Files"];
	// 	$http({
	// 		method: 'GET',
	// 		url: direccion_servidor + '/sfa/bajar/archivo/Excel/' + objetoEnvio.peticion,
	// 		data: objetoEnvio,
	// 		responseType: "arraybuffer"
	// 	}).then(
	// 		function (data) {
	// 			myLog({ title: 'RESPUESATA DEL SERVER AL OBTENER EL FILE', contenido: data });
	// 			var type = data.headers('Content-Type');
	// 			var disposition = data.headers('Content-Disposition');
	// 			var defaultFileName = 'Archivo.xlsx';
	// 			if (disposition) {
	// 				var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
	// 				if (match[1])
	// 					defaultFileName = match[1];
	// 			}
	// 			defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
	// 			var linkElement = document.createElement('a');
	// 			try {
	// 				var blob = new Blob([data.data], { type: type });
	// 				var url = window.URL.createObjectURL(blob);
	// 				linkElement.setAttribute('href', url);
	// 				linkElement.setAttribute("download", defaultFileName);
	// 				var clickEvent = new MouseEvent("click", {
	// 					"view": window,
	// 					"bubbles": true,
	// 					"cancelable": false
	// 				});
	// 				linkElement.dispatchEvent(clickEvent);
	// 			} catch (ex) {
	// 				console.log(ex);
	// 			}
	// 		});
	// }
	// this.HTTPObtenerReciboDineroDeposito = function (objetoDeposito) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerReciboDineroDeposito', data: objetoDeposito }); }
	// this.HTTPObtenerGastosRuta = function (objetoDeposito) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerGastoRutaJornada', data: objetoDeposito }); }
	// this.HTTPObtenerDetalleJornada = function (objetoDeposito) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDetalleJornada', data: objetoDeposito }); }
	// this.HTTPObtenerDetallesConteos = function (objetoJornada) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDetalleConteo', data: objetoJornada }); }
	// this.HTTPCerrarJornada = function (objetoJornada) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/cerrarJornada', data: objetoJornada }); }

	// /*****************************************
	// * SERVICIOS RELACIONADOS CON LOS INVENTARIOS
	// *******************************************/
	// this.HTTPObtenerInventarioBodega = function (objetoInventario) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerInventarioBodega', data: objetoInventario }); }
	// this.HTTPObtenerInventarioUsuario = function (objetoInventario) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerInventarioAgente', data: objetoInventario }); }

	// /*****************************************
	// * SERVICIOS RELACIONADOS CON SAP
	// *******************************************/
	// this.HTTP_ERP_Sap_Lectura = function (objetoEnviar) {
	// 	var request = {
	// 		method: 'POST',
	// 		url: direccion_servidor + '/sfa/erp_sap_lectura',
	// 		data: objetoEnviar,
	// 		headers: {
	// 			'Content-Type': undefined
	// 		}
	// 	};
	// 	/*return $http({method: 'POST', url: direccion_servidor + '/sfa/erp_sap_lectura',
	// 	data: objetoEnviar});*/

	// 	return $http(request);
	// }
	// this.HTTP_ERP_Sap_Escritura = function (objetoEnviar) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/erp_sap_escritura', data: objetoEnviar }); }
	// this.HTTP_ERP_Obtener_Logs_Sap = function (objetoEnviar) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtener_logs_interfaces_sap', data: objetoEnviar }); }
	// this.HTTP_Obtener_Logs_Procedimientos = function () { return $http({ method: 'GET', url: direccion_servidor + '/sfa/ObtenerLogCatalogosProcedimientos' }); }
	// this.HTTP_Obtener_Logs_Bodegas = function () { return $http({ method: 'GET', url: direccion_servidor + '/sfa/ObtenerLogCatalogoBodegas' }); }
	// this.HTTP_Obtener_Logs_Empresas = function () { return $http({ method: 'GET', url: direccion_servidor + '/sfa/ObtenerLogCatalogoEmpresas' }); }
	// this.HTTP_Obtener_Logs_Compannias = function () { return $http({ method: 'GET', url: direccion_servidor + '/sfa/ObtenerLogCatalogoCompanias' }); }
	// this.HTTP_Obtener_Logs_Parametros_Procedimientos = function (objetoEnviar) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ObtenerParametrosProcedimientos', data: objetoEnviar }); }
	// this.HTTP_Obtener_Logs_Ejecutar_Procedimientos = function (objetoEnviar) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/EjecutarProcedimiento', data: objetoEnviar }); }

	// /*****************************************
	// * SERVICIOS RELACIONADOS CON MONITOREOS
	// *******************************************/
	// this.HTTP_Obtener_Monitoreos = function (objetoEnviar) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/consultas_monitoreo', data: objetoEnviar }); }
	// this.HTTP_Ejecutar_Query_Monitoreo = function (objetoEnviar) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/ejecutar_query', data: objetoEnviar }); }

});