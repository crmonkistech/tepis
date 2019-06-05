app.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('dashboard', {
      url: '/dashboard',
      abstract: true,
      cache: false,
      templateUrl: 'templates/dashboard.html',
      controller: 'DashboardCtrl'
    })

  $stateProvider
    .state('dashboard.principal', {
      url: '/principal/:ID_Empresa', cache: false,
      views: {
        '': {
          templateUrl: 'templates/principal.html',
          controller: 'PrincipalCtrl'
        }
      }
    })

  $stateProvider
    .state('login', {
      url: '/login', cache: false,
      views: {
        '': {
          templateUrl: 'templates/InicioSesion/vistaLogin.html',
          controller: 'LoginCtrl'
        }
      }
    })

  /********************************************
  *VISTAS PARA PRESENTACION DE LA INFORMACION
  ********************************************/

  $stateProvider
    .state('dashboard.mapaDocumentos', {
      url: '/mapaDocumentos', cache: false,
      views: {
        '': {
          templateUrl: 'templates/Documentos/mapaDocumentos.html',
          controller: 'mapaDocumentosCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.procesoPedidos', {
      url: '/procesoPedidos', cache: false,
      views: {
        '': {
          templateUrl: 'templates/Documentos/procesoPedidos.html',
          controller: 'ProcesoPedidosCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.detalleNoVenta', {
      url: '/detalleNoVenta', cache: false,
      views: {
        '': {
          templateUrl: 'templates/Documentos/detalleNoVenta.html',
          controller: 'detalleNoVentaCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.graficaRutas', {
      url: '/graficaRutas', cache: false,
      views: {
        '': {
          templateUrl: 'templates/Documentos/graficaRutas.html',
          controller: 'graficaRutasCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaBancos', {
      url: '/vistaBancos', cache: false,
      views: {
        '': {
          templateUrl: 'templates/Bancos/vistaBancos.html',
          controller: 'BancosCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.periodos', {
      url: '/periodos',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Periodos/Periodos.html',
          controller: 'PeriodosCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.nuevoPeriodo', {
      url: '/nuevoPeriodo',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Periodos/Nuevo_Periodo.html',
          controller: 'RegistrarNuevoPeriodoCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.editarPeriodo', {
      url: '/editarPeriodo/:ID_Periodo',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Periodos/Editar_Periodo.html',
          controller: 'EditarPeriodoCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaBodegas', {
      url: '/vistaBodegas',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Bodegas/vistaBodegas.html',
          controller: 'BodegasCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaEntregas', {
      url: '/vistaEntregas',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Entregas/vistaEntregas.html',
          controller: 'EntregasCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaBonificaciones', {
      url: '/vistaBonificaciones',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Bonificaciones/vistaBonificaciones.html',
          controller: 'BonificacionesCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaCategoriasProductos', {
      url: '/vistaCategoriasProductos',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Categorias/vistaCategoriasProductos.html',
          controller: 'CategoriasProductosCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaCategoriasClientes', {
      url: '/vistaCategoriasClientes',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Categorias/vistaCategoriasClientes.html',
          controller: 'CategoriasClientesCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaClientes', {
      url: '/vistaClientes',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Clientes/vistaClientes.html',
          controller: 'ClientesCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaCuentas', {
      url: '/vistaCuentas',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Cuentas/vistaCuentas.html',
          controller: 'CuentasCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaDescuentos', {
      url: '/vistaDescuentos',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Descuentos/vistaDescuentos.html',
          controller: 'DescuentosCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaDepositos', {
      url: '/vistaDepositos',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Depositos/vistaDepositos.html',
          controller: 'DepositosCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaDocumentos', {
      url: '/vistaDocumentos/:ID_Categoria_Documento/:Texto_Busqueda',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Documentos/vistaDocumentos.html',
          controller: 'DocumentosCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaEquivalencias', {
      url: '/vistaEquivalencias',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Equivalencias/vistaEquivalencias.html',
          controller: 'EquivalenciasCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaEncuestas', {
      url: '/vistaEncuestas',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Encuestas/vistaEncuestas.html',
          controller: 'EncuestasCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaRespuestas', {
      url: '/vistaRespuestas',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Encuestas/vistaRespuestas.html',
          controller: 'RespuestasCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaGastosRuta', {
      url: '/vistaGastosRuta',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/GastosRuta/vistaGastosRuta.html',
          controller: 'GastosRutaCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaImpuestos', {
      url: '/vistaImpuestos',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Impuestos/vistaImpuestos.html',
          controller: 'ImpuestosCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaJornadas', {
      url: '/vistaJornadas',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Jornadas/vistaJornadas.html',
          controller: 'JornadasCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaInventarioBodega', {
      url: '/vistaInventarioBodega',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Inventarios/vistaInventarioBodega.html',
          controller: 'InventarioBodegaCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaListaPrecios', {
      url: '/vistaListaPrecios',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/ListaPrecios/vistaListasPrecios.html',
          controller: 'ListaPreciosCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaProductos', {
      url: '/vistaProductos',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Productos/vistaProductos.html',
          controller: 'ProductosCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaRoles', {
      url: '/vistaRoles',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Roles/vistaRoles.html',
          controller: 'RolesCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaRutas', {
      url: '/vistaRutas',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Rutas/vistaRutas.html',
          controller: 'RutasCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaUsuarios', {
      url: '/vistaUsuarios',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Usuarios/vistaUsuarios.html',
          controller: 'UsuariosCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaMotivosDevolucion', {
      url: '/vistaMotivosDevolucion',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Motivos/vistaMotivosDevolucion.html',
          controller: 'MotivosDevolucionCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaMotivosDeNoVenta', {
      url: '/vistaMotivosDeNoVenta',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Motivos/vistaMotivosDeNoVenta.html',
          controller: 'MotivosDeNoVentaCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaLogs', {
      url: '/vistaLogs',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Logs/vistaLogs.html',
          controller: 'LogsCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaLogsProcesos', {
      url: '/vistaLogsProcesos',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Logs/vistaLogsProcesos.html',
          controller: 'LogsProcesosCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaParametros', {
      url: '/vistaParametros',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Parametros/Parametros.html',
          controller: 'ParametrosCtrl'
        }
      }
    })
  //
  $stateProvider
    .state('dashboard.vistaFormatosImpresion', {
      url: '/vistaFormatosImpresion',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Parametros/vistaFormatosImpresion.html',
          controller: 'FormatosImpresionCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaParametrosGenerales', {
      url: '/vistaParametrosGenerales',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Parametros/vistaParametrosGenerales.html',
          controller: 'ParametrosGeneralesCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.vistaMetas', {
      url: '/vistaMetas',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Metas/vistaMetas.html',
          controller: 'MetasCtrl'
        }
      }
    })

  /***************************************
  *VISTAS PARA REGISTRAR INFORMACION
  ****************************************/

  $stateProvider
    .state('dashboard.registrarNuevaEntrega', {
      url: '/registrarNuevaEntrega',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Entregas/registrarNuevaEntrega.html',
          controller: 'RegistrarNuevaEntregaCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.registrarNuevaBonificacion', {
      url: '/registrarNuevaBonificacion',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Bonificaciones/registrarNuevaBonificacion.html',
          controller: 'RegistrarNuevaBonificacionCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.registrarNuevaCategoriaProducto', {
      url: '/registrarNuevaCategoriaProducto',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Categorias/registrarNuevaCategoriaProducto.html',
          controller: 'RegistrarNuevaCategoriaProductoCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.registrarNuevaCategoriaCliente', {
      url: '/registrarNuevaCategoriaCliente',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Categorias/registrarNuevaCategoriaCliente.html',
          controller: 'RegistrarNuevaCategoriaClienteCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.registrarNuevaEncuesta', {
      url: '/registrarNuevaEncuesta',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Encuestas/registrarNuevaEncuesta.html',
          controller: 'RegistrarNuevaEncuestaCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.registrarNuevoGastoRuta', {
      url: '/registrarNuevoGastoRuta',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/GastosRuta/registrarNuevoGastoRuta.html',
          controller: 'RegistrarNuevoGastoRutaCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.registrarNuevoRol', {
      url: '/registrarNuevoRol',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Roles/registrarNuevoRol.html',
          controller: 'RegistrarNuevoRolCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.registrarNuevaRuta', {
      url: '/registrarNuevaRuta',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Rutas/registrarNuevaRuta.html',
          controller: 'RegistrarNuevaRutaCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.registrarNuevoUsuario', {
      url: '/registrarNuevoUsuario',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Usuarios/registrarNuevoUsuario.html',
          controller: 'RegistrarNuevoUsuarioCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.editarUsuario', {
      url: '/editarUsuario/:ID_Usuario',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Usuarios/editarUsuario.html',
          controller: 'EditarUsuarioCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.registrarNuevoMotivoDevolucion', {
      url: '/registrarNuevoMotivoDevolucion',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Motivos/registrarNuevoMotivoDevolucion.html',
          controller: 'RegistrarNuevoMotivoDevolucionCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.registrarNuevoMotivoDeNoVenta', {
      url: '/registrarNuevoMotivoDeNoVenta',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Motivos/registrarNuevoMotivoDeNoVenta.html',
          controller: 'RegistrarNuevoMotivoDeNoVentaCtrl'
        }
      }
    })


  /****************************************************
  * VISTAS PARA EDITAR LA INFORMACIÓN
  *****************************************************/

  $stateProvider
    .state('dashboard.editarEntrega', {
      url: '/editarEntrega/:ID_Ruta_Entrega',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Entregas/editarEntrega.html',
          controller: 'EditarEntregaCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.editarBonificacion', {
      url: '/editarBonificacion/:ID_Bonificacion_Seleccionada',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Bonificaciones/editarBonificacion.html',
          controller: 'EditarBonificacionCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.editarCategoriaProducto', {
      url: '/editarCategoriaProducto/:ID_Categoria_Producto',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Categorias/editarCategoriaProducto.html',
          controller: 'EditarCategoriaProductoCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.editarFamiliaCliente', {
      url: '/editarFamiliaCliente/:ID_Familia_Cliente',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Categorias/editarCategoriaCliente.html',
          controller: 'EditarFamiliaClienteCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.detallesDocumento', {
      url: '/detallesDocumento/:ID_Documento/:ID_Categoria_Documento/:Texto_Busqueda',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Documentos/detallesDocumento.html',
          controller: 'DetallesDocumentoCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.editarEncuesta', {
      url: '/editarEncuesta/:ID_Encuesta',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Encuestas/editarEncuesta.html',
          controller: 'EditarEncuestaCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.editarGastoRuta', {
      url: '/editarGastoRuta/:ID_Gasto_Ruta',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/GastosRuta/editarGastoRuta.html',
          controller: 'EditarGastoRutaCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.procesarJornada', {
      url: '/procesarJornada/:ID_Jornada/:ID_Usuario',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Jornadas/procesarJornada.html',
          controller: 'ProcesarJornadaCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.editarMotivoNoVenta', {
      url: '/editarMotivoNoVenta',
      cache: false,
      params: {
        MtvEnviado: null
      },
      views: {
        '': {
          templateUrl: 'templates/Motivos/editarMotivoDeNoVenta.html',
          controller: 'EditarMotivoNoVentaCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.editarMotivoDevolucion', {
      url: '/editarMotivoDevolucion',
      params: {
        MtvEnviado: null
      },
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Motivos/editarMotivoDeDevolucion.html',
          controller: 'EditarMotivoDevolucionCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.editarRol', {
      url: '/editarRol/:ID_Rol',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Roles/editarRol.html',
          controller: 'EditarRolCtrl'
        }
      }
    })

  $stateProvider
    .state('dashboard.editarRuta', {
      url: '/editarRuta/:ID_Ruta',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Rutas/editarRuta.html',
          controller: 'EditarRutaCtrl'
        }
      }
    })
    
  $stateProvider
    .state('dashboard.monitoreo', {
      url: '/monitoreo/:ID_Monitoreo',
      cache: false,
      views: {
        '': {
          templateUrl: 'templates/Monitoreo/Monitoreo.html',
          controller: 'MonitoreoCtrl'
        }
      }
    })

  $urlRouterProvider.otherwise('/login');
})
