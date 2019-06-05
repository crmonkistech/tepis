app.controller('RutasCtrl', function ($scope, 
    $state, 
    $filter, 
    $timeout,  
    AppService_Reportes,
    AppService_Rutas) {

    $scope.listaRutas = [];
    $scope.Lista_Recorridos = [];
    $scope.objetoRutas = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Ruta: null };

    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    $scope.Calcular_Paginacion = function () { return Math.ceil($scope.listaRutas.length / $scope.Cantidad_Items); }

    $scope.obtenerRutasInicio = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoRutas) };
        AppService_Rutas.HTTPObtenerRutasInicio(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaRutas = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    $scope.obtenerRutas = function () {
        $scope.listaRutas = [];
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoRutas) };
        AppService_Rutas.HTTPObtenerRutas(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaRutas = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    $scope.Crar_Documento_Recorridos = function (filename) {
        $scope.Lista_Recorridos = [];
        AppService_Reportes.HTTP_Generar_Reporte_Recorridos().then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.Lista_Recorridos = respuesta;
                console.log($scope.Lista_Recorridos);

                var table, row, columna1, columna2, columna3, columna4, columna5, columna6 = null;
                table = document.getElementById("Tabla_Recorridos");
                row = table.insertRow(0);
                columna1 = row.insertCell(0);
                columna2 = row.insertCell(1);
                columna3 = row.insertCell(2);
                columna4 = row.insertCell(3);
                columna5 = row.insertCell(4);
                columna6 = row.insertCell(5);
                columna1.innerHTML = 'Nombre de Ruta';
                columna2.innerHTML = 'Dia';
                columna3.innerHTML = 'Tipo de Recorrido';
                columna4.innerHTML = 'Codigo';
                columna5.innerHTML = 'Nombre';
                columna6.innerHTML = 'Indice de Ordenamiento';
                var table, row, columna1, columna2, columna3, columna4, columna5, columna6 = null;

                for (let i = 0; i < $scope.Lista_Recorridos.length; i++) {
                    table = document.getElementById("Tabla_Recorridos");
                    row = table.insertRow(i + 1);
                    columna1 = row.insertCell(0);
                    columna2 = row.insertCell(1);
                    columna3 = row.insertCell(2);
                    columna4 = row.insertCell(3);
                    columna5 = row.insertCell(4);
                    columna6 = row.insertCell(5);
                    columna1.innerHTML = $scope.Lista_Recorridos[i]['Nombre_Ruta'];
                    columna2.innerHTML = $scope.Lista_Recorridos[i]['Dia'];
                    columna3.innerHTML = $scope.Lista_Recorridos[i]['Tipo_Recorrido'];
                    columna4.innerHTML = $scope.Lista_Recorridos[i]['Codigo_Cliente'];
                    columna5.innerHTML = $scope.Lista_Recorridos[i]['Nombre_Cliente'];
                    columna6.innerHTML = $scope.Lista_Recorridos[i]['Indice_Ordenamiento'];
                }
                var downloadLink;
                var dataType = 'application/vnd.ms-excel';
                var tableSelect = document.getElementById("Tabla_Recorridos");
                var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
                filename = filename ? filename + '.xls' : 'excel_data.xls';
                downloadLink = document.createElement("a");
                document.body.appendChild(downloadLink);
                if (navigator.msSaveOrOpenBlob) {
                    var blob = new Blob(['\ufeff', tableHTML], {
                        type: dataType
                    });
                    navigator.msSaveOrOpenBlob(blob, filename);
                } else {
                    downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
                    downloadLink.download = filename;
                    downloadLink.click();
                }
            }
        }, function (error) { console.log(error); });
    }

    $scope.buscarRutasEnter = function (keyEvent) { if (keyEvent.which === 13) { $scope.obtenerRutas(); } }

    $scope.irANuevaRuta = function () { $state.go('dashboard.registrarNuevaRuta'); }
    $scope.editarRuta = function (ID_Ruta) { $state.go('dashboard.editarRuta', { ID_Ruta: ID_Ruta }); }

    angular.element(document).ready(function () { $scope.obtenerRutasInicio(); });

});

app.controller('RegistrarNuevaRutaCtrl', function ($scope, 
    $state, 
    $timeout, 
    $filter, 
    AppService_Clientes,
    AppService_Rutas,
    AppService_Usuarios) {

    console.log('cargando controlador registro de ruta');
    $scope.listaClientes = [];
    $scope.listaUsuarios = [];
    $scope.clientesAgregados = [];
    $scope.listaPeriodos = [];
    console.log(objetoSesion);
    $scope.objetoRuta = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Cliente: null, ID_Ruta: 0 };
    $scope.filtroDia = { Dia_Seleccionado: null };
    console.log($scope.objetoRuta);
    $scope.vistaPor = 5;
    $scope.paginaActual = 1;
    $scope.itemsPorPagina = $scope.vistaPor;
    $scope.maximoItemsPagina = 5;
    $scope.busquedaSinResultados = false;
    $scope.obteniendoClientes = false;
    $scope.listaOrdenamientoClientes = {

    };

    //Tabla de usuarios
    $scope.vistaPorUsuarios = 5;
    $scope.paginaActualUsuarios = 1;
    $scope.itemsPorPaginaUsuarios = $scope.vistaPorUsuarios;
    $scope.maximoItemsPaginaUsuarios = 5;

    //tabla de periodos
    $scope.currentPagePeriodos = 0;
    $scope.filtroPeriodos = "";
    $scope.pageSize = 10;


    $scope.setItemsPerPage = function (num) {
        $scope.itemsPorPagina = num;
        $scope.paginaActual = 1;
    }

    $scope.setItemsPerPageUsuarios = function (num) {
        $scope.itemsPorPaginaUsuarios = num;
        $scope.paginaActualUsuarios = 1;
    }

    $scope.pageChanged = function () {
        console.log('Page changed to: ' + $scope.paginaActual);
    }

    $scope.nuevaRuta = {
        Nombre_Ruta: "",
        Codigo_Ruta: "",
        FK_ID_Empresa: $scope.objetoRuta.ID_Empresa,
        Eliminado: 0,
        Accion: 'i'
    };

    $scope.Lista_Usuarios_Seleccionados = {};
    $scope.Lista_Periodos_Seleccionados = {};

    $scope.statusProceso = 0;

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.filtrarPeriodos = function () { return $filter('filter')($scope.listaPeriodos, $scope.filtroPeriodos); }

    $scope.numeroPaginasPeriodos = function () { return Math.ceil($scope.filtrarPeriodos().length / $scope.pageSize); }

    $scope.obtenerClientes = function () {
        $scope.obteniendoClientes = true;
        $scope.listaClientes = [];
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoRuta)
        };
        AppService_Clientes.HTTPObtenerClientes(objetoEnviar).then(function (response) {
            $scope.obteniendoClientes = false;
            if (response.data.Respuesta === null) {
                $scope.busquedaSinResultados = true;
                $scope.totalItems = 0;
            }
            else {
                $scope.busquedaSinResultados = false;
                $scope.paginaActual = 1;
                $scope.itemsPorPagina = $scope.vistaPor;
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaClientes = respuesta.resultado;
                $scope.totalItems = $scope.listaClientes.length;
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerUsuarios = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoRuta)
        };
        AppService_Usuarios.HTTPObtenerUsuarios(objetoEnviar).then(function (response) {
            if (response.data.Respuesta === null) {
            }
            else {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaUsuarios = respuesta.resultado;
                $scope.totalItemsUsuarios = $scope.listaUsuarios.length;
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerPeriodos = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoRuta)
        };
        AppService_Clientes.HTTPObtenerPeriodosRuta(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaPeriodos = respuesta.resultado;
                console.log($scope.listaPeriodos);
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.buscarClientesEnter = function (keyEvent) {
        if (keyEvent.which === 13) {
            $scope.obtenerClientes();
        }
    }

    $scope.moverPosicionAbajo = function (indice) {
        console.log(indice);
        console.log($scope.clientesAgregados);
        var tamListaClientes = $scope.clientesAgregados.length;
        console.log(tamListaClientes);
        if (tamListaClientes === 1) {
            console.log('Solo hay un cliente. Los botones no sirven');
        }
        else if (tamListaClientes > 1) {
            if (indice === (tamListaClientes - 1)) {
                console.log('Es el ultimo item. No puede bajar mas');
            }
            else {
                console.log('Muevase para abajo');
                var itemSeleccionado = $scope.clientesAgregados[indice];
                var itemAbajo = $scope.clientesAgregados[indice + 1];
                $scope.clientesAgregados[indice] = itemAbajo;
                $scope.clientesAgregados[indice + 1] = itemSeleccionado;
            }
        }
    }

    $scope.moverPosicionArriba = function (indice) {
        console.log(indice);
        console.log($scope.clientesAgregados);
        var tamListaClientes = $scope.clientesAgregados.length;
        console.log(tamListaClientes);
        if (tamListaClientes === 1) {
            console.log('Solo hay un cliente. Los botones no sirven');
        }
        else if (tamListaClientes > 1) {
            if (indice === 0) {
                console.log('Es el primer item. No puede subir mas');
            }
            else {
                console.log('Muevase para arriba');
                var itemSeleccionado = $scope.clientesAgregados[indice];
                var itemArriba = $scope.clientesAgregados[indice - 1];
                $scope.clientesAgregados[indice] = itemArriba;
                $scope.clientesAgregados[indice - 1] = itemSeleccionado;
            }
        }
    }

    $scope.agregarClienteRuta = function (Objeto_Cliente) {
        var cantClientes = $scope.clientesAgregados.length;
        var clienteEncontrado = false;
        for (var i = 0; i < cantClientes; i++) {
            if ($scope.clientesAgregados[i].ID_Cliente === Objeto_Cliente.ID_Cliente) {
                clienteEncontrado = true;
                break;
            }
        }

        if (clienteEncontrado === false) {
            var json = {
                ID_Cliente: Objeto_Cliente.ID_Cliente,
                Nombre_Cliente: Objeto_Cliente.Nombre_Cliente,
                Codigo_Cliente: Objeto_Cliente.Codigo_Cliente,
                Dias_Ruta: { L: false, K: false, M: false, J: false, V: false, S: false, D: false },
                Eliminado: Objeto_Cliente.Eliminado
            };
            $scope.clientesAgregados.push(json);
            $scope.listaOrdenamientoClientes[Objeto_Cliente.ID_Cliente] = 0;
            console.log($scope.listaOrdenamientoClientes);
        }
    }

    $scope.agregarRuta = function () {
        console.log($scope.nuevaRuta);
        console.log($scope.Lista_Periodos_Seleccionados);
        var jsonValidado = validarJSON($scope.nuevaRuta);
        console.log(jsonValidado);
        if (jsonValidado === true) {
            $scope.statusProceso = 100;
        }
        else {
            if ($scope.clientesAgregados.length === 0) {
                $scope.statusProceso = 300;
            }
            else {
                if (angular.equals($scope.Lista_Usuarios_Seleccionados, {})) {
                    $scope.statusProceso = 400;
                }
                else {
                    var Lista_Usuarios_Final = [];
                    for (id_usuario in $scope.Lista_Usuarios_Seleccionados) {
                        if ($scope.Lista_Usuarios_Seleccionados[id_usuario] === true) {
                            var json = { ID_Usuario: id_usuario };
                            Lista_Usuarios_Final.push(json);
                        }
                    }

                    if (Lista_Usuarios_Final.length === 0) {
                        $scope.statusProceso = 400;
                    }
                    else {
                        var cantidadClientesSinOrdenamiento = 0;
                        for (prop in $scope.listaOrdenamientoClientes) {
                            if ($scope.listaOrdenamientoClientes[prop] < 0 || $scope.listaOrdenamientoClientes[prop] === null || $scope.listaOrdenamientoClientes[prop] === "" || angular.isUndefined($scope.listaOrdenamientoClientes[prop])) {
                                cantidadClientesSinOrdenamiento += 1;
                            }
                        }
                        if (cantidadClientesSinOrdenamiento > 0) {
                            console.log('Alguno de los indices de ordenamiento es menor que cero, nulo, vacio o undefined');
                            console.log('Cantidad: ' + cantidadClientesSinOrdenamiento);
                        }
                        else {
                            Lista_Usuarios_Final = JSON.stringify(Lista_Usuarios_Final);
                            var listaRutas = [];
                            var Lista_Rutas = [];
                            var cantClientesAgregados = $scope.clientesAgregados.length;
                            for (var i = 0; i < cantClientesAgregados; i++) {
                                var jsonDias = $scope.clientesAgregados[i].Dias_Ruta;
                                var nuevoJsonDias = {};
                                for (dia in jsonDias) {
                                    if (jsonDias[dia] === true) {
                                        nuevoJsonDias[dia] = true;
                                    }
                                }
                                if (!angular.equals(nuevoJsonDias, {})) {
                                    $scope.clientesAgregados[i].Dias_Ruta = nuevoJsonDias;
                                    listaRutas.push($scope.clientesAgregados[i]);
                                }
                            }
                            //GENERACION FINAL DE LA LISTA DE RUTAS
                            var cantFinalClientesAgregados = listaRutas.length;
                            console.log(listaRutas);
                            for (var j = 0; j < cantFinalClientesAgregados; j++) {
                                var jsonDias = listaRutas[j].Dias_Ruta;
                                for (dia in jsonDias) {
                                    var json = {
                                        ID_Cliente: listaRutas[j].ID_Cliente,
                                        Dia: dia,
                                        Indice_Ordenamiento: $scope.listaOrdenamientoClientes[listaRutas[j].ID_Cliente]
                                    };
                                    Lista_Rutas.push(json);
                                }
                            }
                            console.log(Lista_Rutas);
                            if (Lista_Rutas.length === 0) {
                                $scope.statusProceso = 300;
                            }
                            else {
                                Lista_Rutas = JSON.stringify(Lista_Rutas);
                                var Lista_Periodos_Temporal = [];
                                for (var ID_Periodo in $scope.Lista_Periodos_Seleccionados) {
                                    if ($scope.Lista_Periodos_Seleccionados[ID_Periodo] === true) {
                                        var json = {
                                            ID_Periodo: ID_Periodo
                                        };
                                        Lista_Periodos_Temporal.push(json);
                                    }
                                }
                                if (Lista_Periodos_Temporal.length > 0) {
                                    $scope.nuevaRuta.Lista_Rutas = Lista_Rutas;
                                    $scope.nuevaRuta.Lista_Usuarios_Final = Lista_Usuarios_Final;
                                    $scope.nuevaRuta.Lista_Periodos_Final = JSON.stringify(Lista_Periodos_Temporal);
                                    var objetoEnviar = {
                                        peticion: JSON.stringify($scope.nuevaRuta)
                                    };
                                    console.log(objetoEnviar);
                                    AppService_Rutas.HTTPProcesosRutas(objetoEnviar).then(function (response) {
                                        console.log(response);
                                        $scope.statusProceso = response.data.Respuesta;
                                        if ($scope.statusProceso === "200") {
                                            $timeout(function () {
                                                $scope.statusProceso = 0;
                                                $state.go('dashboard.vistaRutas');
                                            }, 3000);
                                        }
                                    }, function (error) {
                                        console.log(error);
                                    });
                                }
                                else {
                                    console.log('no hay periodos seleccionados');
                                    $scope.statusProceso = 500;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    angular.element(document).ready(function () { $scope.obtenerUsuarios(); $scope.obtenerPeriodos(); });

});

app.controller('EditarRutaCtrl', function ($scope, 
    $state, 
    $stateParams, 
    $timeout, 
    $filter, 
    AppService_Clientes,
    AppService_Rutas,
    AppService_Usuarios) {

    $scope.ID_Ruta = $stateParams.ID_Ruta;
    console.log('ID_Ruta: ' + $scope.ID_Ruta);
    console.log(objetoSesion);
    $scope.objetoRuta = { ID_Empresa: objetoSesion.ID_Empresa, ID_Ruta: parseInt($scope.ID_Ruta), Eliminado: 0, Accion: 'a' };
    $scope.busquedaUsuario = { Filtro_Usuario: '' };
    $scope.busquedaRuta = { Filtro_Cliente: '', ID_Empresa: objetoSesion.ID_Empresa };
    console.log($scope.objetoRuta);
    $scope.infoRuta = null;
    $scope.filtroDia = { Dia_Seleccionado: null };
    $scope.statusProceso = 0;
    $scope.listaClientes = [];
    $scope.listaUsuarios = [];
    $scope.listaPeriodos = [];
    $scope.listaUsuariosFiltrada = [];
    $scope.Lista_Usuarios_Seleccionados = {};
    $scope.Lista_Periodos_Seleccionados = {};
    $scope.clientesAgregados = [];
    $scope.vistaPor = 5;
    $scope.paginaActual = 1;
    $scope.itemsPorPagina = $scope.vistaPor;
    $scope.maximoItemsPagina = 5;
    $scope.busquedaSinResultados = false;
    $scope.obteniendoClientes = false;
    $scope.listaOrdenamientoClientes = {};

    //Tabla de usuarios
    $scope.vistaPorUsuarios = 5;
    $scope.paginaActualUsuarios = 1;
    $scope.itemsPorPaginaUsuarios = $scope.vistaPorUsuarios;
    $scope.maximoItemsPaginaUsuarios = 5;

    $scope.currentPagePeriodos = 0;
    $scope.filtroPeriodos = "";
    $scope.pageSize = 10;


    $scope.setItemsPerPage = function (num) {
        $scope.itemsPorPagina = num;
        $scope.paginaActual = 1;
    }

    $scope.setItemsPerPageUsuarios = function (num) {
        $scope.itemsPorPaginaUsuarios = num;
        $scope.paginaActualUsuarios = 1;
    }

    $scope.pageChanged = function () {
        console.log('Page changed to: ' + $scope.paginaActual);
    }

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.filtrarPeriodos = function () { return $filter('filter')($scope.listaPeriodos, $scope.filtroPeriodos); }

    $scope.numeroPaginasPeriodos = function () { return Math.ceil($scope.filtrarPeriodos().length / $scope.pageSize); }

    $scope.obtenerClientes = function () {
        $scope.obteniendoClientes = true;
        $scope.listaClientes = [];
        var objetoEnviar = {
            peticion: JSON.stringify($scope.busquedaRuta)
        };
        console.log(objetoEnviar);
        AppService_Clientes.HTTPObtenerClientes(objetoEnviar).then(function (response) {
            console.log(response);
            $scope.obteniendoClientes = false;
            if (response.data.Respuesta === null) {
                $scope.busquedaSinResultados = true;
                $scope.totalItems = 0;
            }
            else {
                $scope.busquedaSinResultados = false;
                $scope.paginaActual = 1;
                $scope.itemsPorPagina = $scope.vistaPor;
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaClientes = respuesta.resultado;
                $scope.totalItems = $scope.listaClientes.length;
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerClientesRutaID = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoRuta)
        };
        console.log(objetoEnviar);
        AppService_Rutas.HTTPClientesRutaID(objetoEnviar).then(function (response) {
            console.log(response);
            var res = JSON.parse(response.data.Respuesta);
            var json = null;
            console.log(res);
            console.log(res.resultado);
            $scope.infoRuta = res.resultado;
            console.log($scope.infoRuta);
            $scope.objetoRuta.Nombre_Ruta = res.resultado[0].Nombre_Ruta;
            $scope.objetoRuta.Codigo_Ruta = res.resultado[0].Codigo_Ruta;

            var cantClientesRuta = res.resultado.length;
            console.log(cantClientesRuta);
            console.log($scope.infoRuta);

            //RECORRER LA LISTA PARA SACAR LOS CLIENTES UNICAMENTE
            var clienteEncontrado = false;
            var clienteActual = null;
            for (var i = 0; i < cantClientesRuta; i++) {
                clienteActual = $scope.infoRuta[i];
                if ($scope.clientesAgregados.length === 0) {
                    var json = {
                        ID_Cliente: clienteActual.ID_Cliente,
                        Nombre_Cliente: clienteActual.Nombre_Cliente,
                        Codigo_Cliente: clienteActual.Codigo_Cliente,
                        Dias_Ruta: { L: false, K: false, M: false, J: false, V: false, S: false, D: false },
                        Indice_Ordenamiento: clienteActual.Indice_Ordenamiento,
                        Eliminado: clienteActual.Eliminado
                    };
                    $scope.listaOrdenamientoClientes[clienteActual.ID_Cliente] = clienteActual.Indice_Ordenamiento;
                    $scope.clientesAgregados.push(json);
                }
                else {
                    var cantClientesAgregados = $scope.clientesAgregados.length;
                    var clienteEncontrado = false;
                    for (var j = 0; j < cantClientesAgregados; j++) {
                        if (clienteActual.ID_Cliente === $scope.clientesAgregados[j].ID_Cliente) {
                            clienteEncontrado = true;
                            break;
                        }
                    }

                    if (clienteEncontrado === false) {
                        var json = {
                            ID_Cliente: clienteActual.ID_Cliente,
                            Nombre_Cliente: clienteActual.Nombre_Cliente,
                            Codigo_Cliente: clienteActual.Codigo_Cliente,
                            Dias_Ruta: { L: false, K: false, M: false, J: false, V: false, S: false, D: false },
                            Indice_Ordenamiento: clienteActual.Indice_Ordenamiento,
                            Eliminado: clienteActual.Eliminado
                        };
                        $scope.listaOrdenamientoClientes[clienteActual.ID_Cliente] = clienteActual.Indice_Ordenamiento;
                        $scope.clientesAgregados.push(json);
                    }
                }
            }
            console.log($scope.clientesAgregados);
            for (var i = 0; i < $scope.clientesAgregados.length; i++) {
                for (var j = 0; j < cantClientesRuta; j++) {
                    if ($scope.clientesAgregados[i].ID_Cliente === $scope.infoRuta[j].ID_Cliente) {
                        if ($scope.infoRuta[j].Dia === 'L') {
                            $scope.clientesAgregados[i].Dias_Ruta.L = true;
                        }
                        else if ($scope.infoRuta[j].Dia === 'K') {
                            $scope.clientesAgregados[i].Dias_Ruta.K = true;
                        }
                        else if ($scope.infoRuta[j].Dia === 'M') {
                            $scope.clientesAgregados[i].Dias_Ruta.M = true;
                        }
                        else if ($scope.infoRuta[j].Dia === 'J') {
                            $scope.clientesAgregados[i].Dias_Ruta.J = true;
                        }
                        else if ($scope.infoRuta[j].Dia === 'V') {
                            $scope.clientesAgregados[i].Dias_Ruta.V = true;
                        }
                        else if ($scope.infoRuta[j].Dia === 'S') {
                            $scope.clientesAgregados[i].Dias_Ruta.S = true;
                        }
                        else if ($scope.infoRuta[j].Dia === 'D') {
                            $scope.clientesAgregados[i].Dias_Ruta.D = true;
                        }
                    }
                }
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerUsuariosRuta = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoRuta)
        };
        console.log(objetoEnviar);
        AppService_Rutas.HTTPUsuariosRutaID(objetoEnviar).then(function (response) {
            console.log(response);
            if (response.data.Respuesta === null) {
                console.log('Usuarios NULL');
            }
            else {
                var respuesta = JSON.parse(response.data.Respuesta);
                console.log(respuesta.resultado.length);
                $scope.listaUsuarios = respuesta.resultado;
                console.log($scope.listaUsuarios);
                var cantUsuariosRuta = $scope.listaUsuarios.length;
                for (var i = 0; i < cantUsuariosRuta; i++) {
                    $scope.Lista_Usuarios_Seleccionados[$scope.listaUsuarios[i].ID_Usuario] = true;
                }

                console.log($scope.objetoRuta);

            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerPeriodos = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoRuta)
        };
        console.log(objetoEnviar);
        AppService_Clientes.HTTPObtenerPeriodosRuta(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaPeriodos = respuesta.resultado;
                console.log($scope.listaPeriodos);
                for (var i = 0; i < $scope.listaPeriodos.length; i++) {
                    if ($scope.listaPeriodos[i].Seleccionado === 1) {
                        $scope.Lista_Periodos_Seleccionados[$scope.listaPeriodos[i].ID_Periodo] = true;
                    }
                }
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerUsuariosFiltro = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.busquedaUsuario)
        };
        console.log(objetoEnviar);
        AppService_Usuarios.HTTPObtenerUsuariosFiltro(objetoEnviar).then(function (response) {
            console.log(response);
            if (response.data.Respuesta === null) {
                console.log('Usuarios NULL');
            }
            else {
                $scope.paginaActualUsuarios = 1;
                $scope.itemsPorPaginaUsuarios = $scope.vistaPorUsuarios;
                var respuesta = JSON.parse(response.data.Respuesta);
                console.log(respuesta.resultado.length);
                $scope.listaUsuariosFiltrada = respuesta.resultado;
                console.log($scope.listaUsuariosFiltrada);
                $scope.totalItemsUsuarios = $scope.listaUsuariosFiltrada.length;
                console.log($scope.listaUsuariosFiltrada);
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.moverPosicionAbajo = function (indice) {
        console.log(indice);
        console.log($scope.clientesAgregados);
        var tamListaClientes = $scope.clientesAgregados.length;
        console.log(tamListaClientes);
        if (tamListaClientes === 1) {
            console.log('Solo hay un cliente. Los botones no sirven');
        }
        else if (tamListaClientes > 1) {
            if (indice === (tamListaClientes - 1)) {
                console.log('Es el ultimo item. No puede bajar mas');
            }
            else {
                console.log('Muevase para abajo');
                var itemSeleccionado = $scope.clientesAgregados[indice];
                var itemAbajo = $scope.clientesAgregados[indice + 1];
                $scope.clientesAgregados[indice] = itemAbajo;
                $scope.clientesAgregados[indice + 1] = itemSeleccionado;
            }
        }
    }

    $scope.moverPosicionArriba = function (indice) {
        console.log(indice);
        console.log($scope.clientesAgregados);
        var tamListaClientes = $scope.clientesAgregados.length;
        console.log(tamListaClientes);
        if (tamListaClientes === 1) {
            console.log('Solo hay un cliente. Los botones no sirven');
        }
        else if (tamListaClientes > 1) {
            if (indice === 0) {
                console.log('Es el primer item. No puede subir mas');
            }
            else {
                console.log('Muevase para arriba');
                var itemSeleccionado = $scope.clientesAgregados[indice];
                var itemArriba = $scope.clientesAgregados[indice - 1];
                $scope.clientesAgregados[indice] = itemArriba;
                $scope.clientesAgregados[indice - 1] = itemSeleccionado;
            }
        }
    }

    $scope.agregarClienteRuta = function (Objeto_Cliente) {
        console.log(Objeto_Cliente);
        var cantClientes = $scope.clientesAgregados.length;
        var clienteEncontrado = false;
        for (var i = 0; i < cantClientes; i++) {
            if ($scope.clientesAgregados[i].ID_Cliente === Objeto_Cliente.ID_Cliente) {
                clienteEncontrado = true;
                break;
            }
        }

        if (clienteEncontrado === false) {
            var json = {
                ID_Cliente: Objeto_Cliente.ID_Cliente,
                Nombre_Cliente: Objeto_Cliente.Nombre_Cliente,
                Codigo_Cliente: Objeto_Cliente.Codigo_Cliente,
                Dias_Ruta: { L: false, K: false, M: false, J: false, V: false, S: false, D: false },
                Eliminado: Objeto_Cliente.Eliminado
            };
            $scope.clientesAgregados.push(json);
        }
    }

    $scope.agregarRuta = function () {
        var jsonValidado = validarJSON($scope.objetoRuta);
        if (jsonValidado === true) {
            $scope.statusProceso = 100;
        }
        else {
            if ($scope.clientesAgregados.length === 0) {
                $scope.statusProceso = 300;
            }
            else {
                if (angular.equals($scope.Lista_Usuarios_Seleccionados, {})) {
                    $scope.statusProceso = 400;
                }
                else {
                    var Lista_Usuarios_Final = [];
                    for (id_usuario in $scope.Lista_Usuarios_Seleccionados) {
                        if ($scope.Lista_Usuarios_Seleccionados[id_usuario] === true) {
                            var json = { ID_Usuario: id_usuario };
                            Lista_Usuarios_Final.push(json);
                        }
                    }
                    if (Lista_Usuarios_Final.length === 0) {
                        $scope.statusProceso = 400;
                    }
                    else {
                        var cantidadClientesSinOrdenamiento = 0;
                        for (prop in $scope.listaOrdenamientoClientes) {
                            if ($scope.listaOrdenamientoClientes[prop] < 0 || $scope.listaOrdenamientoClientes[prop] === null || $scope.listaOrdenamientoClientes[prop] === "" || angular.isUndefined($scope.listaOrdenamientoClientes[prop])) {
                                cantidadClientesSinOrdenamiento += 1;
                            }
                        }
                        if (cantidadClientesSinOrdenamiento > 0) {
                            console.log('Alguno de los indices de ordenamiento es menor que cero, nulo, vacio o undefined');
                            console.log('Cantidad: ' + cantidadClientesSinOrdenamiento);
                        }
                        else {
                            Lista_Usuarios_Final = JSON.stringify(Lista_Usuarios_Final);
                            var listaRutas = [];
                            var Lista_Rutas = [];
                            var cantClientesAgregados = $scope.clientesAgregados.length;
                            for (var i = 0; i < cantClientesAgregados; i++) {
                                var jsonDias = $scope.clientesAgregados[i].Dias_Ruta;
                                var nuevoJsonDias = {};
                                for (dia in jsonDias) {
                                    if (jsonDias[dia] === true) {
                                        nuevoJsonDias[dia] = true;
                                    }
                                }
                                if (!angular.equals(nuevoJsonDias, {})) {
                                    $scope.clientesAgregados[i].Dias_Ruta = nuevoJsonDias;
                                    listaRutas.push($scope.clientesAgregados[i]);
                                }
                            }

                            //GENERACION FINAL DE LA LISTA DE RUTAS
                            var cantFinalClientesAgregados = listaRutas.length;
                            for (var j = 0; j < cantFinalClientesAgregados; j++) {
                                var jsonDias = listaRutas[j].Dias_Ruta;
                                for (dia in jsonDias) {
                                    var json = {
                                        ID_Cliente: listaRutas[j].ID_Cliente,
                                        Dia: dia,
                                        Indice_Ordenamiento: j
                                    };
                                    Lista_Rutas.push(json);
                                }
                            }
                            if (Lista_Rutas.length === 0) {
                                $scope.statusProceso = 300;
                            }
                            else {
                                Lista_Rutas = JSON.stringify(Lista_Rutas);
                                var Lista_Periodos_Temporal = [];
                                for (var ID_Periodo in $scope.Lista_Periodos_Seleccionados) {
                                    if ($scope.Lista_Periodos_Seleccionados[ID_Periodo] === true) {
                                        var json = {
                                            ID_Periodo: ID_Periodo
                                        };
                                        Lista_Periodos_Temporal.push(json);
                                    }
                                }
                                if (Lista_Periodos_Temporal.length > 0) {
                                    $scope.objetoRuta.Lista_Rutas = Lista_Rutas;
                                    $scope.objetoRuta.Lista_Usuarios_Final = Lista_Usuarios_Final;
                                    $scope.objetoRuta.Lista_Periodos_Final = JSON.stringify(Lista_Periodos_Temporal);
                                    var objetoEnviar = {
                                        peticion: JSON.stringify($scope.objetoRuta)
                                    };
                                    AppService_Rutas.HTTPProcesosRutas(objetoEnviar).then(function (response) {
                                        $scope.statusProceso = response.data.Respuesta;
                                        if ($scope.statusProceso === "200") {
                                            $timeout(function () {
                                                $scope.statusProceso = 0;
                                                $state.go('dashboard.vistaRutas');
                                            }, 3000);
                                        }
                                    }, function (error) { console.log(error); });
                                }
                                else {
                                    $scope.statusProceso = 500;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    angular.element(document).ready(function () {
        $scope.obtenerClientesRutaID();
        $scope.obtenerUsuariosRuta();
        $scope.obtenerPeriodos();
    });
});