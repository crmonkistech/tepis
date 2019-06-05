app.controller('LogsCtrl', function ($scope, 
    $state, 
    $timeout, 
    AppService_SAP) {

    $scope.Lista_Logs = [];
    $scope.Obteniendo_Informacion_Logs = false;
    $scope.Texto_Boton_Logs_Lectura = 'Prueba de interface';
    $scope.Texto_Boton_Logs_Escritura = 'Interfaces de Escritura';

    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 20;

    $scope.Calcular_Paginacion = function () { return Math.ceil($scope.Lista_Logs.length / $scope.Cantidad_Items); }

    $scope.SAP_Lectura = function () {
        AppService_SAP.HTTP_ERP_Sap_Lectura().then(function (response) {
            if (response.data.Respuesta !== null) {
                $scope.Obtener_Logs();
            }
        }, function (error) { console.log(error) });
    }

    $scope.SAP_Escritura = function () {
        AppService_SAP.HTTP_ERP_Sap_Escritura().then(function (response) {
            if (response.data.Respuesta !== null) {
                $scope.Obtener_Logs();
            }
        }, function (error) { console.log(error) });
    }

    $scope.Obtener_Logs = function () {
        AppService_SAP.HTTP_ERP_Obtener_Logs_Sap().then(function (response) {
            if (response.data.Respuesta !== null) {
                $scope.Lista_Logs = [];
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.Lista_Logs = respuesta.resultado;
            }
        }, function (error) { console.log(error) });
    }

    $scope.Hola = function () {
        $scope.Obteniendo_Informacion_Logs = true;
        $scope.Texto_Boton_Logs_Lectura = 'Ejecutando interface ...';
        $timeout(function () {
            console.log('Hola');
            $scope.Obteniendo_Informacion_Logs = false;
            $scope.Texto_Boton_Logs_Lectura = 'Prueba de interface';
        }, 3000);
    }

    angular.element(document).ready(function () { $scope.Obtener_Logs(); });

});