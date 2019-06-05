app.controller('BodegasCtrl', function ($scope, 
    $state, 
    $filter, 
    $timeout, 
    AppService_Bodegas) {

    $scope.listaBodegas = [];
    $scope.objetoBodega = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Bodega: "" };
    $scope.Estado_Proceso = null;

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    $scope.Filtrar_Entidad = function () { return $filter('filter')($scope.listaBodegas, $scope.objetoBodega.Filtro_Bodega); }
    $scope.Calcular_Paginacion = function () { return Math.ceil($scope.Filtrar_Entidad().length / $scope.Cantidad_Items); }

    $scope.obtenerBodegas = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoBodega) };
        AppService_Bodegas.HTTPObtenerBodegas(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaBodegas = respuesta.resultado;
                console.log($scope.listaBodegas);
            }
        }, function (error) { console.log(error); });
    }

    $scope.Actualizar_Inventario_Bodega = function (ID_Bodega_Param) {
        console.log(ID_Bodega_Param);
        AppService_Bodegas.HTTP_Actualizar_Inventario_Bodega_Unico({ 'ID_Empresa': objetoSesion.ID_Empresa, 'ID_Bodega': ID_Bodega_Param }).then(function (response) {
            console.log(response);
            if (response['Respuesta'] !== null) {
                $scope.Estado_Proceso = '200';
                $timeout(function () { $scope.Estado_Proceso = 0; }, 3000);
            }
        }, function (error) { console.log(error); })
    }

    angular.element(document).ready(function () {
        var jsonValidado = validarJSON(objetoSesion);
        if (jsonValidado === true) { $state.go('login'); }
        else { $scope.obtenerBodegas(); }
    });
});

app.controller('RegistrarNuevoInventarioBodegaCtrl', function ($scope) {
    console.log('cargando controlador registro de inventario bodega');
    $scope.data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 }, { id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }, { id: 15 }];
    $scope.vistaPor = 10;
    $scope.totalItems = $scope.data.length;
    console.log($scope.totalItems);
    $scope.paginaActual = 1;
    $scope.itemsPorPagina = $scope.vistaPor;

    $scope.setItemsPerPage = function (num) {
        $scope.itemsPorPagina = num;
        $scope.paginaActual = 1;
    }

    $scope.pageChanged = function () {
        console.log('Page changed to: ' + $scope.paginaActual);
    }

});