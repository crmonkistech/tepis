app.controller('CuentasCtrl', function ($scope, 
    $state, 
    $filter, 
    AppService_Cuentas) {

    $scope.listaCuentas = [];
    $scope.objetoCuenta = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Cuenta: "" };

    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    $scope.Filtrar_Entidad = function () { return $filter('filter')($scope.listaCuentas, $scope.objetoCuenta.Filtro_Cuenta); }
    $scope.Calcular_Paginacion = function () { return Math.ceil($scope.Filtrar_Entidad().length / $scope.Cantidad_Items); }

    $scope.obtenerCuentas = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoCuenta) };
        AppService_Cuentas.HTTPObtenerCuentas(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaCuentas = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    angular.element(document).ready(function () { $scope.obtenerCuentas(); });

});