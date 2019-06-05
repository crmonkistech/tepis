app.controller('BancosCtrl', function ($scope, 
    $state, 
    $filter, 
    AppService_Bancos) {

    $scope.listaBancos = [];
    $scope.objetoBanco = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Banco: "" };

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    $scope.Filtrar_Entidad = function () { return $filter('filter')($scope.listaBancos, $scope.objetoBanco.Filtro_Banco); }
    $scope.Calcular_Paginacion = function () { return Math.ceil($scope.Filtrar_Entidad().length / $scope.Cantidad_Items); }

    $scope.obtenerBancos = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoBanco) };
        AppService_Bancos.HTTPObtenerBancos(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaBancos = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    angular.element(document).ready(function () {
        var jsonValidado = validarJSON(objetoSesion);
        if (jsonValidado === true) { $state.go('login'); }
        else { $scope.obtenerBancos(); }
    });

});