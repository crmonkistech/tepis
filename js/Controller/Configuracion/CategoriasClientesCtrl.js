app.controller('CategoriasClientesCtrl', function ($scope, 
    $state, 
    $filter, 
    AppService_Categorias) {

    $scope.listaCategorias = [];
    $scope.objetoCategoria = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Categoria: null };

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    $scope.Calcular_Paginacion = function () { return Math.ceil($scope.listaCategorias.length / $scope.Cantidad_Items); }

    $scope.obtenerCategoriasInicio = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoCategoria) };
        AppService_Categorias.HTTPObtenerFamiliasClienteInicio(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaCategorias = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    $scope.obtenerCategorias = function () {
        $scope.listaCategorias = [];
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoCategoria) };
        AppService_Categorias.HTTPObtenerFamiliasCliente(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaCategorias = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    $scope.buscarCategoriasEnter = function (keyEvent) { if (keyEvent.which === 13) { $scope.obtenerCategorias(); } }
    $scope.irANuevaCategoria = function () { $state.go('dashboard.registrarNuevaCategoriaCliente'); }
    $scope.editarCategoria = function (ID_Categoria) { $state.go('dashboard.editarFamiliaCliente', { ID_Familia_Cliente: ID_Categoria }); }

    angular.element(document).ready(function () {
        var jsonValidado = validarJSON(objetoSesion);
        if (jsonValidado === true) { $state.go('login'); }
        else { $scope.obtenerCategoriasInicio(); }
    });

});

app.controller('RegistrarNuevaCategoriaClienteCtrl', function ($scope, 
    $state, 
    $timeout, 
    $filter, 
    AppService_Categorias,
    AppService_Clientes) {

    $scope.objetoCategoria = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Cliente: null };
    $scope.Lista_Clientes = [];
    $scope.Lista_Clientes_Seleccionados = {};
    $scope.Lista_Clientes_Final = [];

    $scope.nuevaCategoria = {
        Nombre_Familia: "",
        FK_ID_Empresa: objetoSesion.ID_Empresa,
        Eliminado: 0,
        Accion: 'i'
    };

    $scope.statusProceso = 0;
    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.CalcularPaginacion = function () {
        return Math.ceil($scope.Lista_Clientes.length / $scope.Cantidad_Items);
    }

    $scope.buscarClientesEnter = function (keyEvent) {
        if (keyEvent.which === 13) {
            $scope.obtenerClientes();
        }
    }

    $scope.obtenerClientes = function () {
        $scope.Lista_Clientes = [];
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoCategoria)
        };
        AppService_Clientes.HTTPObtenerClientes(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.Lista_Clientes = respuesta.resultado;
                console.log($scope.Lista_Clientes);
            }
        }, function (error) { console.log(error); });
    }

    $scope.agregarCategoria = function () {
        var jsonValidado = validarJSON($scope.nuevaCategoria);
        if (jsonValidado === true) { $scope.statusProceso = 100; }
        else {
            if (angular.equals({}, $scope.Lista_Clientes_Seleccionados)) { $scope.statusProceso = 300; }
            else {
                for (var ID_Cliente in $scope.Lista_Clientes_Seleccionados) {
                    if ($scope.Lista_Clientes_Seleccionados[ID_Cliente] === true) {
                        var json = { ID_Cliente: parseInt(ID_Cliente) };
                        $scope.Lista_Clientes_Final.push(json);
                    }
                }

                console.log($scope.Lista_Clientes_Final);
                $scope.nuevaCategoria.Lista_Clientes = JSON.stringify($scope.Lista_Clientes_Final);

                var objetoEnviar = { peticion: JSON.stringify($scope.nuevaCategoria) };
                console.log(objetoEnviar);
                AppService_Categorias.HTTPProcesosFamiliasClientes(objetoEnviar).then(function (response) {
                    console.log(response);
                    $scope.statusProceso = response.data.Respuesta;
                    if ($scope.statusProceso === "200") {
                        $timeout(function () {
                            $scope.statusProceso = 0;
                            $state.go('dashboard.vistaCategoriasClientes')
                        }, 3000);
                    }
                }, function (error) { console.log(error); });
            }
        }
    }

});

app.controller('EditarFamiliaClienteCtrl', function ($scope, 
    $state, 
    $stateParams, 
    $timeout, 
    $filter, 
    AppService_Categorias,
    AppService_Clientes) {

    $scope.ID_Familia_Cliente = $stateParams.ID_Familia_Cliente;

    $scope.infoCategoria = [];
    $scope.Lista_Clientes = [];
    $scope.Lista_Clientes_Seleccionados = {};
    $scope.Lista_Clientes_Final = [];

    $scope.busquedaCliente = { Filtro_Cliente: "", ID_Empresa: objetoSesion.ID_Empresa };
    $scope.statusProceso = 0;

    $scope.objetoCategoria = {
        ID_Familia_Cliente: parseInt($scope.ID_Familia_Cliente),
        Nombre_Familia: null,
        ID_Empresa: objetoSesion.ID_Empresa,
        Accion: 'a',
        Eliminado: null,
        Lista_Clientes: []
    };

    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    $scope.CalcularPaginacion = function () {
        return Math.ceil($scope.objetoCategoria.Lista_Clientes.length / $scope.Cantidad_Items);
    }

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.buscarClientesEnter = function (keyEvent) { if (keyEvent.which === 13) { $scope.obtenerClientes(); } }

    $scope.obtenerClientes = function () {
        $scope.Lista_Clientes = [];
        var objetoEnviar = { peticion: JSON.stringify($scope.busquedaCliente) };
        AppService_Clientes.HTTPObtenerClientes(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.Lista_Clientes = respuesta.resultado;
                var Cliente_Encontrado = false;
                for (var i = 0; i < $scope.Lista_Clientes.length; i++) {
                    Cliente_Encontrado = false;
                    for (var k = 0; k < $scope.objetoCategoria.Lista_Clientes.length; k++) {
                        if ($scope.Lista_Clientes[i].ID_Cliente === $scope.objetoCategoria.Lista_Clientes[k].FK_ID_Cliente) {
                            Cliente_Encontrado = true;
                            break;
                        }
                    }

                    if (Cliente_Encontrado === false) {
                        var json = {
                            ID_Cliente: $scope.Lista_Clientes[i].ID_Cliente, Codigo_Cliente: $scope.Lista_Clientes[i].Codigo_Cliente,
                            Nombre_Cliente: $scope.Lista_Clientes[i].Nombre_Cliente, ID_Familia_Cliente: $scope.ID_Familia_Cliente
                        };
                        $scope.objetoCategoria.Lista_Clientes.push(json);
                        $scope.Lista_Clientes_Seleccionados[$scope.Lista_Clientes[i].ID_Cliente] = false;
                    }
                }
            }
        }, function (error) { console.log(error); });
    }

    $scope.obtenerInformacionCategoria = function () {
        var objetoEnviar = { peticion: JSON.stringify({ ID_Familia_Cliente: $scope.ID_Familia_Cliente }) };
        AppService_Categorias.HTTPObtenerInformacionFamiliaClienteID(objetoEnviar).then(function (response) {
            var res = JSON.parse(response.data.Respuesta);
            $scope.infoCategoria = res.resultado;
            $scope.objetoCategoria.Nombre_Familia = $scope.infoCategoria[0].Nombre_Familia;
            $scope.objetoCategoria.Lista_Clientes = $scope.infoCategoria;
            $scope.objetoCategoria.Eliminado = $scope.infoCategoria[0].Eliminado;
            var cantClientes = $scope.objetoCategoria.Lista_Clientes.length;
            for (var i = 0; i < cantClientes; i++) {
                $scope.Lista_Clientes_Seleccionados[$scope.objetoCategoria.Lista_Clientes[i].FK_ID_Cliente] = true;
            }
        }, function (error) { console.log(error); });
    }

    $scope.guardarCategoria = function () {
        var jsonValidado = validarJSON($scope.objetoCategoria);
        if (jsonValidado === true) { $scope.statusProceso = 100; }
        else {
            for (var ID_Cliente in $scope.Lista_Clientes_Seleccionados) {
                if ($scope.Lista_Clientes_Seleccionados[ID_Cliente] === true) {
                    var json = { ID_Cliente: parseInt(ID_Cliente) };
                    $scope.Lista_Clientes_Final.push(json);
                }
            }
            $scope.objetoCategoria.Lista_Clientes_Final = JSON.stringify($scope.Lista_Clientes_Final);

            var objetoEnviar = {
                peticion: JSON.stringify($scope.objetoCategoria)
            };

            AppService_Categorias.HTTPProcesosFamiliasClientes(objetoEnviar).then(function (response) {
                $scope.statusProceso = response.data.Respuesta;
                if ($scope.statusProceso === "200") {
                    $timeout(function () {
                        $scope.statusProceso = 0;
                        $state.go('dashboard.vistaCategoriasClientes')
                    }, 3000);
                }
            }, function (error) { console.log(error); });
        }
    }

    angular.element(document).ready(function () {
        $scope.obtenerInformacionCategoria();
    });

});