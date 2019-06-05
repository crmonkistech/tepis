app.controller('GastosRutaCtrl', function ($scope, 
    $state, 
    $filter, 
    AppService_GastosEnRuta) {

    $scope.listaGastosRuta = [];
    $scope.objetoGastoRuta = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Gasto: "" };

    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    $scope.Filtrar_Entidad = function () { return $filter('filter')($scope.listaGastosRuta, $scope.objetoGastoRuta.Filtro_Gasto); }
    $scope.Calcular_Paginacion = function () { return Math.ceil($scope.Filtrar_Entidad().length / $scope.Cantidad_Items); }

    $scope.obtenerCategoriasGastosRuta = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoGastoRuta) };
        AppService_GastosEnRuta.HTTPObtenerCategoriasGastosRuta(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaGastosRuta = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    $scope.irANuevoGastoRuta = function () { $state.go('dashboard.registrarNuevoGastoRuta'); }

    $scope.editarGastoRuta = function (ID_Gasto_Ruta) { $state.go('dashboard.editarGastoRuta', { ID_Gasto_Ruta: ID_Gasto_Ruta }); }

    angular.element(document).ready(function () { $scope.obtenerCategoriasGastosRuta(); });

});

app.controller('RegistrarNuevoGastoRutaCtrl', function ($scope, 
    $state, 
    $timeout, 
    AppService_GastosEnRuta) {

    console.log('cargando controlador registro de gastos de ruta');

    console.log(objetoSesion);
    $scope.objetoGastoRuta = { ID_Empresa: objetoSesion.ID_Empresa };
    console.log($scope.objetoGastoRuta);

    $scope.nuevoGastoRuta = {
        Nombre_Gasto: "",
        Eliminado: 0,
        Accion: 'i'
    };

    $scope.statusProceso = 0;

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.agregarGastoRuta = function () {
        console.log($scope.nuevoGastoRuta);
        var jsonValidado = validarJSON($scope.nuevoGastoRuta);
        if (jsonValidado === true) {
            //espacios en blanco
            console.log('JSON incorrecto');
            console.log($scope.nuevoGastoRuta);
            $scope.statusProceso = 100;
        }
        else {
            var objetoEnviar = {
                peticion: JSON.stringify($scope.nuevoGastoRuta)
            };
            console.log(objetoEnviar);
            AppService_GastosEnRuta.HTTPProcesosGastosRuta(objetoEnviar).then(function (response) {
                console.log(response);
                $scope.statusProceso = response.data.Respuesta;
                console.log($scope.statusProceso);
                if ($scope.statusProceso === "200") {
                    $scope.nuevoGastoRuta = {
                        Nombre_Gasto: "",
                        Eliminado: 0,
                        Accion: 'i'
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
});

app.controller('EditarGastoRutaCtrl', function ($scope, 
    $state, 
    $timeout, 
    $stateParams, 
    AppService_GastosEnRuta) {

    $scope.ID_Gasto_Ruta = $stateParams.ID_Gasto_Ruta;
    console.log($scope.ID_Gasto_Ruta);
    console.log(objetoSesion);
    $scope.objetoGastoRuta = { ID_Empresa: objetoSesion.ID_Empresa };
    console.log($scope.objetoGastoRuta);

    $scope.infoGastoRuta = null;

    $scope.statusProceso = 0;

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.obtenerInformacionGastoRuta = function () {
        var objetoEnviar = {
            peticion: JSON.stringify({ ID_Gasto_Ruta: $scope.ID_Gasto_Ruta })
        };
        console.log(objetoEnviar);
        AppService_GastosEnRuta.HTTPObtenerGastoRutaID(objetoEnviar).then(function (response) {
            console.log(response);
            var res = JSON.parse(response.data.Respuesta);
            $scope.infoGastoRuta = res.resultado[0];
            console.log($scope.infoGastoRuta);
        }, function (error) {
            console.log(error);
        });
    }

    $scope.editarGastoRuta = function () {
        console.log($scope.infoGastoRuta);
        var jsonValidado = validarJSON($scope.infoGastoRuta);
        if (jsonValidado === true) {
            //espacios en blanco
            console.log('JSON incorrecto');
            console.log($scope.infoGastoRuta);
            $scope.statusProceso = 100;
        }
        else {
            $scope.infoGastoRuta.Accion = 'a';
            console.log($scope.infoGastoRuta);
            var objetoEnviar = {
                peticion: JSON.stringify($scope.infoGastoRuta)
            };
            console.log(objetoEnviar);
            AppService_GastosEnRuta.HTTPProcesosGastosRuta(objetoEnviar).then(function (response) {
                console.log(response);
                $scope.statusProceso = response.data.Respuesta;
                if ($scope.statusProceso === "200") {
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
        $scope.obtenerInformacionGastoRuta();
    });

});