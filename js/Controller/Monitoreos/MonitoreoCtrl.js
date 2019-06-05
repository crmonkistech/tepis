app.controller('MonitoreoCtrl', function ($scope, 
    $state, 
    $stateParams, 
    $filter, 
    AppService_Monitoreo) {

    $scope.ID_Monitoreo = $stateParams.ID_Monitoreo;
    $scope.Objeto_Controlador = { Filtro_Monitoreo: "" };
    $scope.Lista_Encabezados = [];
    $scope.Lista_Informacion = [];
    $scope.Lista_Monitoreos = [];
    $scope.Pagina_Actual_Monitoreos = 0;
    $scope.Pagina_Actual_Resultado = 0;
    $scope.Cantidad_Items = 10;

    $scope.Filtrar_Entidad = function () { return $filter('filter')($scope.Lista_Monitoreos, $scope.Objeto_Controlador.Filtro_Monitoreo); }
    $scope.Calcular_Paginacion_Monitoreos = function () { return Math.ceil($scope.Filtrar_Entidad().length / $scope.Cantidad_Items); }
    $scope.Calcular_Paginacion_Resultado = function () { return Math.ceil($scope.Lista_Informacion.length / $scope.Cantidad_Items); }

    $scope.Obtener_Consulta_Monitoreo = function () {
        var objetoEnviar = { peticion: JSON.stringify({ ID_Monitoreo: null }) };
        AppService_Monitoreo.HTTP_Obtener_Monitoreos(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var res = JSON.parse(response.data.Respuesta);
                $scope.Lista_Monitoreos = res.resultado;
            }
        }, function (error) { console.log(error); });
    }

    $scope.Ejecutar_Query = function (Consulta_SQL) {
        $scope.Lista_Informacion = [];
        $scope.Lista_Encabezados = [];
        var Objeto_SQL = { peticion: Consulta_SQL };
        AppService_Monitoreo.HTTP_Ejecutar_Query_Monitoreo(Objeto_SQL).then(function (response1) {
            if (response1.data.Respuesta.length > 0) {
                var res1 = response1.data.Respuesta;
                var string_resultado = "";
                for (var i = 0; i < res1.length; i++) { string_resultado = string_resultado + res1[i]; }
                $scope.Lista_Informacion = JSON.parse(string_resultado);
                $scope.Lista_Encabezados = Object.keys($scope.Lista_Informacion[0]);
            }
        }, function (error) { console.log(error); });
    }

    angular.element(document).ready(function () { $scope.Obtener_Consulta_Monitoreo(); });

});  