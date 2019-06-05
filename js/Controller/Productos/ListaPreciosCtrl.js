app.controller('ListaPreciosCtrl', function ($scope, 
    $state, 
    $filter, 
    AppService_Precios) {

    $scope.listaListasPrecios = [];
    $scope.objetoListaPrecios = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Lista_Precios: "" };

    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    $scope.Filtrar_Entidad = function () { return $filter('filter')($scope.listaListasPrecios, $scope.objetoListaPrecios.Filtro_Lista_Precios); }
    $scope.Calcular_Paginacion = function () { return Math.ceil($scope.Filtrar_Entidad().length / $scope.Cantidad_Items); }

    $scope.obtenerListasPrecios = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoListaPrecios) };
        AppService_Precios.HTTPObtenerListasPrecios(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaListasPrecios = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    angular.element(document).ready(function () { $scope.obtenerListasPrecios(); });

});  