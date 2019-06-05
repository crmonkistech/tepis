app.controller('PeriodosCtrl', function ($scope, 
    $state, 
    $timeout, 
    $filter, 
    AppService_Clientes) {

    $scope.Lista_Periodos = [];
    $scope.Objeto_Periodo = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Periodo: "" };

    /*Controles para la paginacion*/
    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    $scope.FiltrarEntidad = function () {
        return $filter('filter')($scope.Lista_Periodos, $scope.Objeto_Periodo.Filtro_Periodo);
    }

    $scope.CalcularPaginacion = function () {
        return Math.ceil($scope.FiltrarEntidad().length / $scope.Cantidad_Items);
    }

    $scope.ObtenerPeriodos = function () {
        $scope.Lista_Periodos = [];
        var Objeto_Enviar = { peticion: JSON.stringify($scope.Objeto_Periodo) };
        AppService_Clientes.HTTPObtenerPeriodos(Objeto_Enviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var Respuesta_API = JSON.parse(response.data.Respuesta);
                $scope.Lista_Periodos = Respuesta_API.resultado;
            }
        }, function (error) { console.log(error); });
    }

    $scope.NuevoPeriodo = function () {
        $state.go('dashboard.nuevoPeriodo')
    }

    $scope.EditarPeriodo = function (ID_Periodo_Param) {
        console.log(ID_Periodo_Param);
        $state.go('dashboard.editarPeriodo', { ID_Periodo: ID_Periodo_Param });
    }

    angular.element(document).ready(function () {
        $scope.ObtenerPeriodos();
    });

});

app.controller('RegistrarNuevoPeriodoCtrl', function ($scope, 
    $timeout, 
    $state, 
    AppService_Clientes) {

    $scope.Objeto_Periodo = { ID_Periodo: 0, Nombre_Periodo: "", Codigo_Periodo: "", FK_ID_Empresa: objetoSesion.ID_Empresa, Accion: 'i' };
    $scope.statusProceso = 0;

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.agregarPeriodo = function () {
        var jsonValidado = validarJSON($scope.Objeto_Periodo);
        if (jsonValidado === true) { $scope.statusProceso = 100; }
        else {
            var objetoEnviar = { peticion: JSON.stringify($scope.Objeto_Periodo) };
            AppService_Clientes.HTTPProcesosPeriodos(objetoEnviar).then(function (response) {
                $scope.statusProceso = response.data.Respuesta;
                if ($scope.statusProceso === "200") { $timeout(function () { $scope.statusProceso = 0; $state.go('dashboard.periodos'); }, 3000); }
            }, function (error) { console.log(error); });
        }
    }

});

app.controller('EditarPeriodoCtrl', function ($scope, 
    $state, 
    $stateParams, 
    $filter, 
    $timeout, 
    AppService_Clientes) {

    $scope.ID_Periodo = parseInt($stateParams.ID_Periodo);
    $scope.Objeto_Periodo = { ID_Periodo: $scope.ID_Periodo, Nombre_Periodo: "", Codigo_Periodo: "", ID_Empresa: objetoSesion.ID_Empresa, Accion: 'a' };

    $scope.statusProceso = 0;

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.obtenerInformacionPeriodo = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.Objeto_Periodo)
        };
        AppService_Clientes.HTTPObtenerPeriodoID(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                var res = respuesta.resultado;
                $scope.Objeto_Periodo.Nombre_Periodo = res[0].Nombre_Periodo;
                $scope.Objeto_Periodo.Codigo_Periodo = res[0].Codigo_Periodo;
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.agregarPeriodo = function () {
        var jsonValidado = validarJSON($scope.Objeto_Periodo);
        if (jsonValidado === true) {
            console.log($scope.Objeto_Periodo);
            $scope.statusProceso = 100;
        }
        else {
            console.log($scope.Objeto_Periodo);
            var objetoEnviar = {
                peticion: JSON.stringify($scope.Objeto_Periodo)
            };
            AppService_Clientes.HTTPProcesosPeriodos(objetoEnviar).then(function (response) {
                console.log(response);
                $scope.statusProceso = response.data.Respuesta;
                if ($scope.statusProceso === "200") {
                    $timeout(function () {
                        $scope.statusProceso = 0;
                        $state.go('dashboard.periodos');
                    }, 3000);
                }

            }, function (error) {
                console.log(error);
            });
        }
    }

    angular.element(document).ready(function () {
        $scope.obtenerInformacionPeriodo();
    });
});