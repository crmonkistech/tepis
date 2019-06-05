app.controller('ClientesCtrl', function ($scope, 
    $state, 
    $filter, 
    AppService_Clientes) {

    $scope.listaClientes = [];
    $scope.objetoCliente = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Cliente: "" };

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    /*Controles para la paginacion*/
    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    $scope.FiltrarEntidad = function () { return $filter('filter')($scope.listaClientes, $scope.objetoCliente.Filtro_Cliente); }

    $scope.CalcularPaginacion = function () { return Math.ceil($scope.FiltrarEntidad().length / $scope.Cantidad_Items); }

    $scope.obtenerClientesInicio = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoCliente) };
        AppService_Clientes.HTTPObtenerClientesInicio(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaClientes = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    $scope.obtenerClientes = function () {
        $scope.listaClientes = [];
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoCliente) };
        AppService_Clientes.HTTPObtenerClientes(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaClientes = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    $scope.buscarClientesEnter = function (keyEvent) { if (keyEvent.which === 13) { $scope.obtenerClientes(); } }

    angular.element(document).ready(function () {
        var jsonValidado = validarJSON(objetoSesion);
        if (jsonValidado === true) { $state.go('login'); }
        else { $scope.obtenerClientesInicio(); }
    });

});

app.controller('RegistrarNuevoClienteCtrl', function ($scope, 
    $timeout, 
    AppService_Precios,
    AppService_Categorias,
    AppService_Clientes) {
        
    console.log('cargando controlador registro de cliente');

    $scope.listaCategorias = [];
    $scope.listaListasPrecios = [];
    $scope.listaFormasPago = [];
    console.log(objetoSesion);
    $scope.objetoCliente = { ID_Empresa: objetoSesion.ID_Empresa };
    console.log($scope.objetoCliente);

    $scope.nuevoCliente = {
        Nombre_Cliente: "",
        Cedula: "",
        Codigo_Cliente: "",
        FK_ID_Empresa: objetoSesion.ID_Empresa,
        FK_ID_Forma_Pago: "",
        FK_ID_Lista_Precios: "",
        Eliminado: 0,
        Accion: 'i',
        Numero_Telefonico: "",
        Direccion_Exacta: "",
        NIT: "",
        Limite_Credito_Maximo: "",
        Descuento_Aplicable: "",
        Plazo_Dias: "",
        Exento: false,
        Aceptar_Cheque: false
    };

    $scope.statusProceso = 0;

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.obtenerListasPrecios = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoCliente)
        };
        console.log(objetoEnviar);
        AppService_Precios.HTTPObtenerListasPrecios(objetoEnviar).then(function (response) {
            console.log(response);
            if (response.data.Respuesta === null) {
                console.log('LISTAS PRECIOS NULL');
            }
            else {
                var respuesta = JSON.parse(response.data.Respuesta);
                console.log(respuesta.resultado.length);
                $scope.listaListasPrecios = respuesta.resultado;
                $scope.totalItems = $scope.listaListasPrecios.length;
                console.log($scope.listaListasPrecios);
                console.log('Total items: ' + $scope.totalItems);
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerFormasPago = function () {
        AppService_Categorias.HTTPObtenerFormasPago().then(function (response) {
            console.log(response);
            if (response.data.Respuesta === null) {
                console.log('LISTAS PRECIOS NULL');
            }
            else {
                var respuesta = JSON.parse(response.data.Respuesta);
                console.log(respuesta.resultado.length);
                $scope.listaFormasPago = respuesta.resultado;
                $scope.totalItems = $scope.listaFormasPago.length;
                console.log($scope.listaFormasPago);
                console.log('Total items: ' + $scope.totalItems);
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerCategoriasClientes = function () {
        AppService_Categorias.HTTPObtenerCategoriasClientes().then(function (response) {
            console.log(response);
            if (response.data.Respuesta === null) {
                console.log('CATEGORIAS Clientes NULL');
            }
            else {
                var respuesta = JSON.parse(response.data.Respuesta);
                console.log(respuesta.resultado.length);
                $scope.listaCategorias = respuesta.resultado;
                var total = $scope.listaCategorias.length;
                console.log($scope.listaCategorias);
                console.log('Total items: ' + total);
            }

        }, function (error) {
            console.log(error);
        });
    }

    $scope.agregarCliente = function () {
        var jsonValidado = validarJSON($scope.nuevoCliente);
        if (jsonValidado === true) {
            //espacios en blanco
            console.log('JSON incorrecto');
            console.log($scope.nuevoCliente);
            $scope.statusProceso = 100;
        }
        else {
            console.log($scope.nuevoCliente);
            if ($scope.nuevoCliente.Exento === true) {
                $scope.nuevoCliente.Exento = 1;
            }
            else {
                $scope.nuevoCliente.Exento = 0;
            }
            if ($scope.nuevoCliente.Aceptar_Cheque === true) {
                $scope.nuevoCliente.Aceptar_Cheque = 1;
            }
            else {
                $scope.nuevoCliente.Aceptar_Cheque = 0;
            }
            var objetoEnviar = {
                peticion: JSON.stringify($scope.nuevoCliente)
            };
            console.log(objetoEnviar);
            AppService_Clientes.HTTPProcesosClientes(objetoEnviar).then(function (response) {
                console.log(response);
                $scope.statusProceso = response.data.Respuesta;
                if ($scope.statusProceso === "200") {
                    $scope.nuevoCliente = {
                        Nombre_Cliente: "", Cedula: "", Codigo_Cliente: "", FK_ID_Empresa: objetoSesion.ID_Empresa, FK_ID_Forma_Pago: 0,
                        FK_ID_Lista_Precios: 0, Eliminado: 0, Accion: 'i', Numero_Telefonico: "", Direccion_Exacta: "", NIT: "", Limite_Credito_Maximo: 0,
                        Descuento_Aplicable: 0, Plazo_Dias: 0, Exento: false, Aceptar_Cheque: false
                    };
                    $timeout(function () {
                        $scope.statusProceso = 0;
                    }, 3000);
                }
            }, function (error) {
                console.log(error);
            });
        }
    }

    angular.element(document).ready(function () {
        $scope.obtenerCategoriasClientes();
        $scope.obtenerFormasPago();
        $scope.obtenerListasPrecios();
    });

});