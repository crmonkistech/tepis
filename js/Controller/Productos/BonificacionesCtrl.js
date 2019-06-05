app.controller('BonificacionesCtrl', function ($scope, 
    $state, 
    $filter, 
    AppService_Bonificaciones) {

    $scope.listaBonificaciones = [];
    $scope.objetoBonificacion = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Bonificaciones: "" };

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    $scope.Filtrar_Entidad = function () { return $filter('filter')($scope.listaBonificaciones, $scope.objetoBonificacion.Filtro_Bonificaciones); }
    $scope.Calcular_Paginacion = function () { return Math.ceil($scope.Filtrar_Entidad().length / $scope.Cantidad_Items); }

    $scope.obtenerBonificaciones = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoBonificacion) };
        AppService_Bonificaciones.HTTPObtenerBonificaciones(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaBonificaciones = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    $scope.irANuevaBonificacion = function () { $state.go('dashboard.registrarNuevaBonificacion'); }
    $scope.editarBonificacion = function (ID_Bonificacion) { $state.go('dashboard.editarBonificacion', { ID_Bonificacion_Seleccionada: ID_Bonificacion }); }

    angular.element(document).ready(function () {
        var jsonValidado = validarJSON(objetoSesion);
        if (jsonValidado === true) { $state.go('login'); }
        else { $scope.obtenerBonificaciones(); }
    });

});

app.controller('RegistrarNuevaBonificacionCtrl', function ($scope, 
    $timeout, 
    $filter, 
    $state,  
    AppService_Bonificaciones,
    AppService_Precios,
    AppService_Rutas,
    AppService_Productos) {
        
    console.log('cargando controlador registro de bodega');

    $scope.listaHoras = [{ 'id': 1, 'valor': '01:00 AM' }, { 'id': 2, 'valor': '02:00 AM' }, { 'id': 3, 'valor': '03:00 AM' }, { 'id': 4, 'valor': '04:00 AM' }, { 'id': 5, 'valor': '05:00 AM' },
    { 'id': 6, 'valor': '06:00 AM' }, { 'id': 7, 'valor': '07:00 AM' }, { 'id': 8, 'valor': '08:00 AM' }, { 'id': 9, 'valor': '09:00 AM' }, { 'id': 10, 'valor': '10:00 AM' },
    { 'id': 11, 'valor': '11:00 AM' }, { 'id': 12, 'valor': '12:00 MD' }, { 'id': 13, 'valor': '01:00 PM' }, { 'id': 14, 'valor': '02:00 PM' }, { 'id': 15, 'valor': '03:00 PM' },
    { 'id': 16, 'valor': '04:00 PM' }, { 'id': 17, 'valor': '05:00 PM' }, { 'id': 18, 'valor': '06:00 PM' }, { 'id': 19, 'valor': '07:00 PM' }, { 'id': 20, 'valor': '08:00 PM' },
    { 'id': 21, 'valor': '09:00 PM' }, { 'id': 22, 'valor': '10:00 PM' }, { 'id': 23, 'valor': '11:00 PM' }, { 'id': 24, 'valor': '12:00 PM' }];

    $scope.listaProductos = [];
    $scope.listaRutas = [];
    $scope.listaCategoriasCliente = [];
    $scope.listaListasPrecios = [];
    $scope.listaCategoriasProductos = [];
    $scope.statusProceso = 0;
    $scope.statusProcesoProductos = 0;
    $scope.objetoProducto = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Producto: null };
    $scope.listaIDProductos = {};
    $scope.listaRutasSeleccionadas = {};
    $scope.listaListasPreciosSeleccionadas = {};
    $scope.listaCategorasClientesSeleccionadas = {};
    $scope.listaCategoriasProductosSeleccionadas = {};
    $scope.listaListasPreciosProductosSeleccionadas = {};
    $scope.objetoBonificacion = {
        ID_Empresa: objetoSesion.ID_Empresa,
        Cantidad_Padre: null,
        Nombre_Bonificacion: null,
        Codigo_Bonificacion: null,
        Fecha_Inicio: null,
        Fecha_Finalizacion: null,
        Accion: 'i',
        Lista_Productos_Bonificados: [],
        Lista_Rutas_Seleccionadas: [],
        Lista_Precios_Seleccionadas: [],
        Lista_Categorias_Clientes_Seleccionadas: [],
        Lista_Categorias_Productos_Seleccionadas: [],
        Lista_Precios_Productos_Seleccionadas: [],
        Todos_Clientes_Seleccionados: false,
        Todos_Productos_Seleccionados: false
    };

    //modelos de prueba
    $scope.currentPageRutas = 0;
    $scope.currentPageListasPrecios = 0;
    $scope.currentPageCategoriasClientes = 0;
    $scope.currentPageCategoriasProductos = 0;
    $scope.currentPageListasPreciosProductos = 0;
    $scope.filtroRutas = "";
    $scope.filtroListasPrecios = "";
    $scope.filtroCategoriasClientes = "";
    $scope.filtroCategoriasProductos = "";
    $scope.filtroListaPreciosProductos = "";
    $scope.pageSize = 10;

    $scope.horaInicio = null;
    $scope.horaFinalizacion = null;

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.obtenerRutasEmpresa = function () {
        var objetoEnviar = {
            peticion: JSON.stringify({ ID_Empresa: objetoSesion.ID_Empresa, Filtro_Rutas: '' })
        };
        AppService_Rutas.HTTPObtenerRutas(objetoEnviar).then(function (response) {
            console.log(response);
            if (response.data.Respuesta != null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaRutas = respuesta.resultado;
                $scope.totalRutas = $scope.listaRutas.length;
                console.log($scope.listaRutas);
                console.log('Hay ' + $scope.totalRutas + ' rutas en total');
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.filtrarRutas = function () {
        return $filter('filter')($scope.listaRutas, $scope.filtroRutas);
    }

    $scope.filtrarListasPrecios = function () {
        return $filter('filter')($scope.listaListasPrecios, $scope.filtroListasPrecios);
    }

    $scope.filtrarCategoriasClientes = function () {
        return $filter('filter')($scope.listaCategoriasCliente, $scope.filtroCategoriasClientes);
    }

    $scope.filtrarCategoriasProductos = function () {
        return $filter('filter')($scope.listaCategoriasProductos, $scope.filtroCategoriasProductos);
    }

    $scope.filtrarListasPreciosProductos = function () {
        return $filter('filter')($scope.listaListasPrecios, $scope.filtroListaPreciosProductos);
    }

    $scope.numeroPaginasRutas = function () {
        return Math.ceil($scope.filtrarRutas().length / $scope.pageSize);
    }

    $scope.numeroPaginasListasPrecios = function () {
        return Math.ceil($scope.filtrarListasPrecios().length / $scope.pageSize);
    }

    $scope.numeroPaginasCategoriasClientes = function () {
        return Math.ceil($scope.filtrarCategoriasClientes().length / $scope.pageSize);
    }

    $scope.numeroPaginasCategoriasProductos = function () {
        return Math.ceil($scope.filtrarCategoriasProductos().length / $scope.pageSize);
    }

    $scope.numeroPaginasListasPreciosProductos = function () {
        return Math.ceil($scope.filtrarListasPreciosProductos().length / $scope.pageSize);
    }

    $scope.obtenerCategoriasClientesEmpresa = function () {
        var objetoEnviar = {
            peticion: JSON.stringify({ ID_Empresa: objetoSesion.ID_Empresa })
        };
        AppService_Bonificaciones.HTTPObtenerFamiliasClientesBonificaciones(objetoEnviar).then(function (response) {
            console.log(response);
            if (response.data.Respuesta != null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaCategoriasCliente = respuesta.resultado;
                $scope.totalCategoriasCliente = $scope.listaCategoriasCliente.length;
                console.log($scope.listaCategoriasCliente);
                console.log('Hay ' + $scope.totalCategoriasCliente + ' categorias de clientes en total');
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerListasPrecioEmpresa = function () {
        var objetoEnviar = {
            peticion: JSON.stringify({ ID_Empresa: objetoSesion.ID_Empresa })
        };
        AppService_Precios.HTTPObtenerListasPrecios(objetoEnviar).then(function (response) {
            console.log(response);
            if (response.data.Respuesta != null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaListasPrecios = respuesta.resultado;
                console.log($scope.listaListasPrecios);
                $scope.totalListaPrecios = $scope.listaListasPrecios.length;
                console.log('Hay ' + $scope.totalListaPrecios + ' listas de precios en total');
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerCategoriasProductos = function () {
        var objetoEnviar = {
            peticion: JSON.stringify({ ID_Empresa: objetoSesion.ID_Empresa })
        };
        AppService_Bonificaciones.HTTPObtenerCategoriasProductosBonificaciones(objetoEnviar).then(function (response) {
            console.log(response);
            if (response.data.Respuesta != null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaCategoriasProductos = respuesta.resultado;
                console.log($scope.listaCategoriasProductos);
                $scope.totalCategoriasProductos = $scope.listaCategoriasProductos.length;
                console.log('Hay ' + $scope.totalCategoriasProductos + ' listas de precios en total');
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerProductosFiltro = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoProducto)
        };
        AppService_Productos.HTTPObtenerProductosFiltro(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaProductos = respuesta.resultado;
                $scope.statusProcesoProductos = 0;
            }
            else {
                $scope.statusProcesoProductos = 100;
                $scope.listaProductos = [];
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerProductosEnter = function (keyEvent) {
        if (keyEvent.which === 13) {
            $scope.obtenerProductosFiltro();
        }
    }

    function validarJSONListas(json) {
        var cantidad = 0;
        for (member in json) {
            if (json[member] === true)
                cantidad += 1;
        }
        return cantidad;
    }


    $scope.guardarBonificacion = function () {
        console.log($scope.objetoBonificacion);
        console.log($scope.listaIDProductos);
        console.log($scope.listaListasPreciosSeleccionadas);
        console.log($scope.listaRutasSeleccionadas);
        console.log($scope.listaCategorasClientesSeleccionadas);
        console.log($scope.listaCategoriasProductosSeleccionadas);
        console.log($scope.listaListasPreciosProductosSeleccionadas);

        var Fecha_Inicio = new Date($scope.objetoBonificacion.Fecha_Inicio);
        if ($scope.horaInicio === null) {
            Fecha_Inicio.setHours(0);
        }
        else {
            Fecha_Inicio.setHours($scope.horaInicio);
        }
        var Fecha_Finalizacion = new Date($scope.objetoBonificacion.Fecha_Finalizacion);
        if ($scope.horaFinalizacion === null) {
            Fecha_Finalizacion.setHours(0);
        }
        else {
            Fecha_Finalizacion.setHours($scope.horaFinalizacion);
        }
        var cantidadProductosBonificados = 0;
        console.log(Fecha_Inicio);
        console.log(Fecha_Finalizacion);
        var jsonValidado = validarJSON($scope.objetoBonificacion);
        if (jsonValidado === true) {
            //HAY CAMPOS NULOS O EN BLANCO
            $scope.statusProceso = 100;
        }
        else {
            if (Fecha_Inicio <= Fecha_Finalizacion) {
                $scope.objetoBonificacion.Lista_Productos_Bonificados = [];
                for (var ID_Producto in $scope.listaIDProductos) {
                    if ($scope.listaIDProductos[ID_Producto] === null || $scope.listaIDProductos[ID_Producto] === "") {
                        console.log('Es null o vacio');
                    }
                    else {
                        var json = {
                            ID_Producto: parseInt(ID_Producto),
                            Cantidad_Bonificada: $scope.listaIDProductos[ID_Producto],
                            Porcentaje_Descuento: 100,
                        };
                        $scope.objetoBonificacion.Lista_Productos_Bonificados.push(json);
                    }
                }
                if ($scope.objetoBonificacion.Lista_Productos_Bonificados.length > 0) {
                    $scope.listaRutasSeleccionadas[0] = false;
                    $scope.listaCategoriasProductosSeleccionadas[0] = false;
                    if ($scope.objetoBonificacion.Todos_Clientes_Seleccionados === true) {
                        console.log('APLICA PARA TODOS LOS CLIENTES');
                        $scope.listaRutasSeleccionadas[0] = true;
                    }

                    if ($scope.objetoBonificacion.Todos_Productos_Seleccionados === true) {
                        console.log('APLICA PARA TODOS LOS PRODUCTOS');
                        $scope.listaCategoriasProductosSeleccionadas[0] = true;
                    }

                    console.log($scope.listaRutasSeleccionadas);
                    console.log($scope.listaCategoriasProductosSeleccionadas);

                    var jsonResultadoR = validarJSONListas($scope.listaRutasSeleccionadas);
                    var jsonResultadoLP = validarJSONListas($scope.listaListasPreciosSeleccionadas);
                    var jsonResultadoCC = validarJSONListas($scope.listaCategorasClientesSeleccionadas);

                    if (jsonResultadoR > 0 || jsonResultadoLP > 0 || jsonResultadoCC > 0) {
                        console.log('todo bien con las reglas de clientes');
                        $scope.objetoBonificacion.Fecha_Inicio = $filter('date')(Fecha_Inicio, "yyyy-MM-dd HH:mm:ss");
                        $scope.objetoBonificacion.Fecha_Finalizacion = $filter('date')(Fecha_Finalizacion, "yyyy-MM-dd HH:mm:ss");

                        var jsonResultadoCPS = validarJSONListas($scope.listaCategoriasProductosSeleccionadas);
                        var jsonResultadoLPS = validarJSONListas($scope.listaListasPreciosProductosSeleccionadas);

                        if (jsonResultadoCPS > 0 || jsonResultadoLPS > 0) {
                            console.log('todo bien con las reglas de productos');
                            $scope.objetoBonificacion.Lista_Rutas_Seleccionadas = [];
                            $scope.objetoBonificacion.Lista_Precios_Seleccionadas = [];
                            $scope.objetoBonificacion.Lista_Categorias_Clientes_Seleccionadas = [];
                            $scope.objetoBonificacion.Lista_Categorias_Productos_Seleccionadas = [];
                            $scope.objetoBonificacion.Lista_Precios_Productos_Seleccionadas = [];
                            for (var ID_Ruta_S in $scope.listaRutasSeleccionadas) {
                                if ($scope.listaRutasSeleccionadas[ID_Ruta_S] === true) {
                                    var json = {
                                        ID_Ruta: parseInt(ID_Ruta_S)
                                    };
                                    $scope.objetoBonificacion.Lista_Rutas_Seleccionadas.push(json);
                                }
                            }
                            for (var ID_Lista_Precios_S in $scope.listaListasPreciosSeleccionadas) {
                                if ($scope.listaListasPreciosSeleccionadas[ID_Lista_Precios_S] === true) {
                                    var json = {
                                        ID_Lista_Precios: parseInt(ID_Lista_Precios_S)
                                    };
                                    $scope.objetoBonificacion.Lista_Precios_Seleccionadas.push(json);
                                }
                            }
                            for (var ID_Categoria_S in $scope.listaCategorasClientesSeleccionadas) {
                                if ($scope.listaCategorasClientesSeleccionadas[ID_Categoria_S] === true) {
                                    var json = {
                                        ID_Categoria: parseInt(ID_Categoria_S)
                                    };
                                    $scope.objetoBonificacion.Lista_Categorias_Clientes_Seleccionadas.push(json);
                                }
                            }
                            for (var ID_Categoria_S in $scope.listaCategoriasProductosSeleccionadas) {
                                if ($scope.listaCategoriasProductosSeleccionadas[ID_Categoria_S] === true) {
                                    var json = {
                                        ID_Categoria: parseInt(ID_Categoria_S)
                                    };
                                    $scope.objetoBonificacion.Lista_Categorias_Productos_Seleccionadas.push(json);
                                }
                            }
                            for (var ID_Lista_Precios_S in $scope.listaListasPreciosProductosSeleccionadas) {
                                if ($scope.listaListasPreciosProductosSeleccionadas[ID_Lista_Precios_S] === true) {
                                    var json = {
                                        ID_Lista_Precios: parseInt(ID_Lista_Precios_S)
                                    };
                                    $scope.objetoBonificacion.Lista_Precios_Productos_Seleccionadas.push(json);
                                }
                            }
                            console.log($scope.objetoBonificacion);
                            var objetoEnviar = {
                                peticion: JSON.stringify($scope.objetoBonificacion)
                            };
                            console.log(objetoEnviar);
                            AppService_Bonificaciones.HTTPProcesosBonificaciones(objetoEnviar).then(function (response) {
                                console.log(response);
                                $scope.statusProceso = response.data.Respuesta;
                                console.log($scope.statusProceso);
                                if ($scope.statusProceso === '200') {
                                    $timeout(function () {
                                        $state.go('dashboard.vistaBonificaciones');
                                    }, 2000);
                                }
                            }, function (error) {
                                console.log(error);
                            });
                        }
                        else {
                            //TIENE QUE SELECCIONAR ALGUNA DE LAS REGLAS PARA LOS PRODUCTOS
                            $scope.statusProceso = 800;
                        }
                    }
                    else {
                        //TIENE QUE SELECCIONAR ALGUNA DE LAS REGLAS PARA LOS CLIENTES
                        $scope.statusProceso = 600;
                    }
                }
                else {
                    //DEBE INDICAR AL MENOS UNA CANTIDAD PARA UN PRODUCTO BONIFICADO
                    $scope.statusProceso = 700;
                }
            }
            else {
                //LAS FECHAS NO SON CORRECTAS
                $scope.statusProceso = 300;
            }
        }
    }

    angular.element(document).ready(function () {
        $scope.obtenerRutasEmpresa();
        $scope.obtenerListasPrecioEmpresa();
        $scope.obtenerCategoriasClientesEmpresa();
        $scope.obtenerCategoriasProductos();
    });

});

app.controller('EditarBonificacionCtrl', function ($scope, 
    $state, 
    $stateParams, 
    $timeout, 
    $filter, 
    AppService_Productos,
    AppService_Bonificaciones) {

    $scope.ID_Bonificacion = $stateParams.ID_Bonificacion_Seleccionada;
    console.log('ID Bonificacion: ' + $scope.ID_Bonificacion);

    $scope.listaHoras = [{ 'id': 1, 'valor': '01:00 AM' }, { 'id': 2, 'valor': '02:00 AM' }, { 'id': 3, 'valor': '03:00 AM' }, { 'id': 4, 'valor': '04:00 AM' }, { 'id': 5, 'valor': '05:00 AM' },
    { 'id': 6, 'valor': '06:00 AM' }, { 'id': 7, 'valor': '07:00 AM' }, { 'id': 8, 'valor': '08:00 AM' }, { 'id': 9, 'valor': '09:00 AM' }, { 'id': 10, 'valor': '10:00 AM' },
    { 'id': 11, 'valor': '11:00 AM' }, { 'id': 12, 'valor': '12:00 MD' }, { 'id': 13, 'valor': '01:00 PM' }, { 'id': 14, 'valor': '02:00 PM' }, { 'id': 15, 'valor': '03:00 PM' },
    { 'id': 16, 'valor': '04:00 PM' }, { 'id': 17, 'valor': '05:00 PM' }, { 'id': 18, 'valor': '06:00 PM' }, { 'id': 19, 'valor': '07:00 PM' }, { 'id': 20, 'valor': '08:00 PM' },
    { 'id': 21, 'valor': '09:00 PM' }, { 'id': 22, 'valor': '10:00 PM' }, { 'id': 23, 'valor': '11:00 PM' }, { 'id': 24, 'valor': '12:00 PM' }];

    $scope.listaProductosBonificacion = [];

    $scope.listaRutas = [];
    $scope.listaListasPreciosClientes = [];
    $scope.listaCategoriasClientes = [];
    $scope.listaCategoriasProductos = [];
    $scope.listaListasPreciosProductos = [];

    $scope.listaIDProductos = {};
    $scope.listaRutasSeleccionadas = {};
    $scope.listaListasPreciosSeleccionadas = {};
    $scope.listaCategorasClientesSeleccionadas = {};
    $scope.listaCategoriasProductosSeleccionadas = {};
    $scope.listaListasPreciosProductosSeleccionadas = {};

    $scope.informacionBonificacion = {
        ID_Bonificacion: null,
        Nombre_Bonificacion: null,
        Codigo_Bonificacion: null,
        ID_Empresa: null,
        Fecha_Inicio: null,
        Fecha_Finalizacion: null,
        Cantidad_Padre: null,
        Accion: 'a',
        Lista_Productos_Bonificados: [],
        Lista_Rutas_Seleccionadas: [],
        Lista_Precios_Seleccionadas: [],
        Lista_Categorias_Clientes_Seleccionadas: [],
        Lista_Categorias_Productos_Seleccionadas: [],
        Lista_Precios_Productos_Seleccionadas: []
    };

    $scope.horaInicio = null;
    $scope.horaFinalizacion = null;

    $scope.objetoBonificacion = { ID_Bonificacion: $scope.ID_Bonificacion, ID_Empresa: objetoSesion.ID_Empresa, Filtro_Producto: null };

    $scope.statusProceso = 0;

    //modelos de prueba
    $scope.currentPageRutas = 0;
    $scope.currentPageListasPrecios = 0;
    $scope.currentPageCategoriasClientes = 0;
    $scope.currentPageCategoriasProductos = 0;
    $scope.currentPageListasPreciosProductos = 0;
    $scope.filtroRutas = "";
    $scope.filtroListasPrecios = "";
    $scope.filtroCategoriasClientes = "";
    $scope.filtroCategoriasProductos = "";
    $scope.filtroListaPreciosProductos = "";
    $scope.pageSize = 10;

    function validarJSONListas(json) {
        var cantidad = 0;
        for (member in json) {
            if (json[member] === true)
                cantidad += 1;
        }
        return cantidad;
    }

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.filtrarRutas = function () { return $filter('filter')($scope.listaRutas, $scope.filtroRutas); }

    $scope.filtrarListasPrecios = function () { return $filter('filter')($scope.listaListasPreciosClientes, $scope.filtroListasPrecios); }

    $scope.filtrarCategoriasClientes = function () { return $filter('filter')($scope.listaCategoriasClientes, $scope.filtroCategoriasClientes); }

    $scope.filtrarCategoriasProductos = function () { return $filter('filter')($scope.listaCategoriasProductos, $scope.filtroCategoriasProductos); }

    $scope.filtrarListasPreciosProductos = function () { return $filter('filter')($scope.listaListasPreciosProductos, $scope.filtroListaPreciosProductos); }

    $scope.numeroPaginasRutas = function () { return Math.ceil($scope.filtrarRutas().length / $scope.pageSize); }

    $scope.numeroPaginasListasPrecios = function () { return Math.ceil($scope.filtrarListasPrecios().length / $scope.pageSize); }

    $scope.numeroPaginasCategoriasClientes = function () { return Math.ceil($scope.filtrarCategoriasClientes().length / $scope.pageSize); }

    $scope.numeroPaginasCategoriasProductos = function () { return Math.ceil($scope.filtrarCategoriasProductos().length / $scope.pageSize); }

    $scope.numeroPaginasListasPreciosProductos = function () { return Math.ceil($scope.filtrarListasPreciosProductos().length / $scope.pageSize); }

    $scope.obtenerInformacionBonificacion = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoBonificacion)
        };
        AppService_Bonificaciones.HTTPObtenerInformacionBonificacion(objetoEnviar).then(function (response) {
            console.log(response);
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                console.log(respuesta);
                var res = respuesta.resultado;
                console.log(res);
                $scope.informacionBonificacion.ID_Bonificacion = res[0].ID_Bonificacion;
                $scope.informacionBonificacion.Nombre_Bonificacion = res[0].Nombre_Bonificacion;
                $scope.informacionBonificacion.Codigo_Bonificacion = res[0].Codigo_Bonificacion;
                $scope.informacionBonificacion.ID_Empresa = res[0].FK_ID_Empresa;
                $scope.informacionBonificacion.Fecha_Inicio = new Date(res[0].Fecha_Inicio);
                $scope.horaInicio = $scope.informacionBonificacion.Fecha_Inicio.getHours();
                console.log($scope.horaInicio);
                $scope.informacionBonificacion.Fecha_Finalizacion = new Date(res[0].Fecha_Finalizacion);
                $scope.horaFinalizacion = $scope.informacionBonificacion.Fecha_Finalizacion.getHours();
                console.log($scope.horaFinalizacion);
                $scope.informacionBonificacion.Cantidad_Padre = res[0].Cantidad_Padre;
                $scope.informacionBonificacion.Todos_Clientes_Seleccionados = res[0].TodosClientes;
                $scope.informacionBonificacion.Todos_Productos_Seleccionados = res[0].TodosProductos;
                console.log($scope.informacionBonificacion);
                $scope.Categoria_Producto_Seleccionada = $scope.informacionBonificacion.ID_Categoria_Producto;
                $scope.Familia_Cliente_Seleccionada = $scope.informacionBonificacion.ID_Familia_Cliente;
                var cantidadProductosBonificacion = res.length;
                for (var i = 0; i < cantidadProductosBonificacion; i++) {
                    var json = {
                        ID_Producto: res[i].ID_Producto,
                        Codigo_Producto: res[i].Codigo_Producto,
                        Nombre_Producto: res[i].Nombre_Producto,
                        Cantidad_Bonificada: res[i].Cantidad_Bonificada,
                        Descripcion: res[i].Descripcion
                    };

                    $scope.listaIDProductos[res[i].ID_Producto] = res[i].Cantidad_Bonificada;
                    $scope.listaProductosBonificacion.push(json);
                }
                console.log($scope.listaProductosBonificacion);
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerProductosFiltro = function () {
        console.log($scope.objetoBonificacion);
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoBonificacion)
        };
        console.log(objetoEnviar);
        AppService_Productos.HTTPObtenerProductosFiltro(objetoEnviar).then(function (response) {
            console.log(response);
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaProductosBonificacion = respuesta.resultado;
                console.log($scope.listaProductosBonificacion);
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerProductosEnter = function (keyEvent) {
        if (keyEvent.which === 13) {
            $scope.obtenerProductosFiltro();
        }
    }

    $scope.obtenerRutasBonificacion = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoBonificacion)
        };
        AppService_Bonificaciones.HTTPObtenerRutasBonificacion(objetoEnviar).then(function (response) {
            var respuesta = JSON.parse(response.data.Respuesta);
            $scope.listaRutas = respuesta.resultado;
            $scope.totalRutas = $scope.listaRutas.length;
            for (var i = 0; i < $scope.listaRutas.length; i++) {
                if ($scope.listaRutas[i].Seleccionado === 1) {
                    $scope.listaRutasSeleccionadas[$scope.listaRutas[i].ID_Ruta] = true;
                }
            }

        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerListaPreciosClientesBonificacion = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoBonificacion)
        };
        AppService_Bonificaciones.HTTPObtenerListasPreciosClientesBonificacion(objetoEnviar).then(function (response) {
            var respuesta = JSON.parse(response.data.Respuesta);
            $scope.listaListasPreciosClientes = respuesta.resultado;
            $scope.totalListaPrecios = $scope.listaListasPreciosClientes.length;
            console.log($scope.listaListasPreciosClientes);
            for (var i = 0; i < $scope.listaListasPreciosClientes.length; i++) {
                if ($scope.listaListasPreciosClientes[i].Seleccionado === 1) {
                    $scope.listaListasPreciosSeleccionadas[$scope.listaListasPreciosClientes[i].ID_Lista_Precios] = true;
                }
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerCategoriasClientesBonificacion = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoBonificacion)
        };
        AppService_Bonificaciones.HTTPObtenerCategoriasClientesBonificacion(objetoEnviar).then(function (response) {
            console.log(response);
            var respuesta = JSON.parse(response.data.Respuesta);
            $scope.listaCategoriasClientes = respuesta.resultado;
            $scope.totalCategoriasCliente = $scope.listaCategoriasClientes.length;
            for (var i = 0; i < $scope.listaCategoriasClientes.length; i++) {
                if ($scope.listaCategoriasClientes[i].Seleccionado === 1) {
                    $scope.listaCategorasClientesSeleccionadas[$scope.listaCategoriasClientes[i].ID_Familia_Cliente] = true;
                }
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerCategoriasProductosBonificacion = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoBonificacion)
        };
        AppService_Bonificaciones.HTTPObtenerCategoriasProductosBonificacion(objetoEnviar).then(function (response) {
            var respuesta = JSON.parse(response.data.Respuesta);
            $scope.listaCategoriasProductos = respuesta.resultado;
            $scope.totalCategoriasProductos = $scope.listaCategoriasProductos.length;
            for (var i = 0; i < $scope.listaCategoriasProductos.length; i++) {
                if ($scope.listaCategoriasProductos[i].Seleccionado === 1) {
                    $scope.listaCategoriasProductosSeleccionadas[$scope.listaCategoriasProductos[i].ID_Categoria_Producto] = true;
                }
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerListaPreciosProductosBonificacion = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoBonificacion)
        };
        AppService_Bonificaciones.HTTPObtenerListasPreciosProductosBonificacion(objetoEnviar).then(function (response) {
            var respuesta = JSON.parse(response.data.Respuesta);
            $scope.listaListasPreciosProductos = respuesta.resultado;
            for (var i = 0; i < $scope.listaListasPreciosProductos.length; i++) {
                if ($scope.listaListasPreciosProductos[i].Seleccionado === 1) {
                    $scope.listaListasPreciosProductosSeleccionadas[$scope.listaListasPreciosProductos[i].ID_Lista_Precios] = true;
                }
            }
        }, function (error) {
            console.log(error);
        });
    }


    $scope.guardarBonificacion = function () {
        console.log($scope.informacionBonificacion);
        console.log($scope.listaIDProductos);
        console.log($scope.listaListasPreciosSeleccionadas);
        console.log($scope.listaRutasSeleccionadas);
        console.log($scope.listaCategorasClientesSeleccionadas);
        console.log($scope.listaCategoriasProductosSeleccionadas);
        console.log($scope.listaListasPreciosProductosSeleccionadas);

        var Fecha_Inicio = new Date($scope.informacionBonificacion.Fecha_Inicio);
        if ($scope.horaInicio === null) {
            Fecha_Inicio.setHours(0);
        }
        else {
            Fecha_Inicio.setHours($scope.horaInicio);
        }
        var Fecha_Finalizacion = new Date($scope.informacionBonificacion.Fecha_Finalizacion);
        if ($scope.horaFinalizacion === null) {
            Fecha_Finalizacion.setHours(0);
        }
        else {
            Fecha_Finalizacion.setHours($scope.horaFinalizacion);
        }
        var cantidadProductosBonificados = 0;
        console.log(Fecha_Inicio);
        console.log(Fecha_Finalizacion);
        var jsonValidado = validarJSON($scope.informacionBonificacion);
        if (jsonValidado === true) {
            //HAY CAMPOS NULOS O EN BLANCO
            $scope.statusProceso = 100;
        }
        else {
            if (Fecha_Inicio <= Fecha_Finalizacion) {
                $scope.informacionBonificacion.Lista_Productos_Bonificados = [];
                for (var ID_Producto in $scope.listaIDProductos) {
                    if ($scope.listaIDProductos[ID_Producto] === null || $scope.listaIDProductos[ID_Producto] === "") {
                        console.log('Es null o vacio');
                    }
                    else {
                        var json = {
                            ID_Producto: parseInt(ID_Producto),
                            Cantidad_Bonificada: $scope.listaIDProductos[ID_Producto],
                            Porcentaje_Descuento: 100,
                        };
                        $scope.informacionBonificacion.Lista_Productos_Bonificados.push(json);
                    }
                }
                if ($scope.informacionBonificacion.Lista_Productos_Bonificados.length > 0) {
                    $scope.listaRutasSeleccionadas[0] = false;
                    $scope.listaCategoriasProductosSeleccionadas[0] = false;
                    if ($scope.informacionBonificacion.Todos_Clientes_Seleccionados === true) {
                        console.log('APLICA PARA TODOS LOS CLIENTES');
                        $scope.listaRutasSeleccionadas[0] = true;
                    }

                    if ($scope.informacionBonificacion.Todos_Productos_Seleccionados === true) {
                        console.log('APLICA PARA TODOS LOS PRODUCTOS');
                        $scope.listaCategoriasProductosSeleccionadas[0] = true;
                    }

                    console.log($scope.listaRutasSeleccionadas);
                    console.log($scope.listaCategoriasProductosSeleccionadas);

                    var jsonResultadoR = validarJSONListas($scope.listaRutasSeleccionadas);
                    var jsonResultadoLP = validarJSONListas($scope.listaListasPreciosSeleccionadas);
                    var jsonResultadoCC = validarJSONListas($scope.listaCategorasClientesSeleccionadas);

                    if (jsonResultadoR > 0 || jsonResultadoLP > 0 || jsonResultadoCC > 0) {
                        console.log('todo bien con las reglas de clientes');
                        $scope.informacionBonificacion.Fecha_Inicio = $filter('date')(Fecha_Inicio, "yyyy-MM-dd HH:mm:ss");
                        $scope.informacionBonificacion.Fecha_Finalizacion = $filter('date')(Fecha_Finalizacion, "yyyy-MM-dd HH:mm:ss");

                        var jsonResultadoCPS = validarJSONListas($scope.listaCategoriasProductosSeleccionadas);
                        var jsonResultadoLPS = validarJSONListas($scope.listaListasPreciosProductosSeleccionadas);

                        if (jsonResultadoCPS > 0 || jsonResultadoLPS > 0) {
                            console.log('todo bien con las reglas de productos');
                            $scope.informacionBonificacion.Lista_Rutas_Seleccionadas = [];
                            $scope.informacionBonificacion.Lista_Precios_Seleccionadas = [];
                            $scope.informacionBonificacion.Lista_Categorias_Clientes_Seleccionadas = [];
                            $scope.informacionBonificacion.Lista_Categorias_Productos_Seleccionadas = [];
                            $scope.informacionBonificacion.Lista_Precios_Productos_Seleccionadas = [];
                            for (var ID_Ruta_S in $scope.listaRutasSeleccionadas) {
                                if ($scope.listaRutasSeleccionadas[ID_Ruta_S] === true) {
                                    var json = {
                                        ID_Ruta: parseInt(ID_Ruta_S)
                                    };
                                    $scope.informacionBonificacion.Lista_Rutas_Seleccionadas.push(json);
                                }
                            }
                            for (var ID_Lista_Precios_S in $scope.listaListasPreciosSeleccionadas) {
                                if ($scope.listaListasPreciosSeleccionadas[ID_Lista_Precios_S] === true) {
                                    var json = {
                                        ID_Lista_Precios: parseInt(ID_Lista_Precios_S)
                                    };
                                    $scope.informacionBonificacion.Lista_Precios_Seleccionadas.push(json);
                                }
                            }
                            for (var ID_Categoria_S in $scope.listaCategorasClientesSeleccionadas) {
                                if ($scope.listaCategorasClientesSeleccionadas[ID_Categoria_S] === true) {
                                    var json = {
                                        ID_Categoria: parseInt(ID_Categoria_S)
                                    };
                                    $scope.informacionBonificacion.Lista_Categorias_Clientes_Seleccionadas.push(json);
                                }
                            }
                            for (var ID_Categoria_S in $scope.listaCategoriasProductosSeleccionadas) {
                                if ($scope.listaCategoriasProductosSeleccionadas[ID_Categoria_S] === true) {
                                    var json = {
                                        ID_Categoria: parseInt(ID_Categoria_S)
                                    };
                                    $scope.informacionBonificacion.Lista_Categorias_Productos_Seleccionadas.push(json);
                                }
                            }
                            for (var ID_Lista_Precios_S in $scope.listaListasPreciosProductosSeleccionadas) {
                                if ($scope.listaListasPreciosProductosSeleccionadas[ID_Lista_Precios_S] === true) {
                                    var json = {
                                        ID_Lista_Precios: parseInt(ID_Lista_Precios_S)
                                    };
                                    $scope.informacionBonificacion.Lista_Precios_Productos_Seleccionadas.push(json);
                                }
                            }
                            console.log($scope.informacionBonificacion);
                            var objetoEnviar = {
                                peticion: JSON.stringify($scope.informacionBonificacion)
                            };
                            console.log(objetoEnviar);
                            AppService_Bonificaciones.HTTPProcesosBonificaciones(objetoEnviar).then(function (response) {
                                console.log(response);
                                $scope.statusProceso = response.data.Respuesta;
                                console.log($scope.statusProceso);
                                if ($scope.statusProceso === '200') {
                                    $timeout(function () {
                                        $state.go('dashboard.vistaBonificaciones');
                                    }, 2000);
                                }
                            }, function (error) {
                                console.log(error);
                            });
                        }
                        else {
                            //TIENE QUE SELECCIONAR ALGUNA DE LAS REGLAS PARA LOS PRODUCTOS
                            $scope.statusProceso = 800;
                        }
                    }
                    else {
                        //TIENE QUE SELECCIONAR ALGUNA DE LAS REGLAS PARA LOS CLIENTES
                        $scope.statusProceso = 600;
                    }
                }
                else {
                    //DEBE INDICAR AL MENOS UNA CANTIDAD PARA UN PRODUCTO BONIFICADO
                    $scope.statusProceso = 700;
                }
            }
            else {
                //LAS FECHAS NO SON CORRECTAS
                $scope.statusProceso = 300;
            }
        }
    }

    angular.element(document).ready(function () {
        $scope.obtenerInformacionBonificacion();
        $scope.obtenerRutasBonificacion();
        $scope.obtenerListaPreciosClientesBonificacion();
        $scope.obtenerCategoriasClientesBonificacion();
        $scope.obtenerCategoriasProductosBonificacion();
        $scope.obtenerListaPreciosProductosBonificacion();
    });

});