app.controller('RespuestasCtrl', function ($scope, 
    $state, 
    $filter, 
    AppService_Encuestas ) {

    $scope.listaRespuestas = [];
    $scope.vistaPor = 10;
    $scope.paginaActual = 1;
    $scope.itemsPorPagina = $scope.vistaPor;
    $scope.objetoRespuesta = {
        ID_Empresa: objetoSesion.ID_Empresa,
        Filtro_Cliente: null,
        Fecha_Inicio: null,
        Fecha_Finalizacion: null
    };

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.statusProceso = 0;

    $scope.setItemsPerPage = function (num) {
        $scope.itemsPorPagina = num;
        $scope.paginaActual = 1;
    }

    $scope.pageChanged = function () {
        console.log('Page changed to: ' + $scope.paginaActual);
    }

    $scope.obtenerRespuestas = function () {

        var jsonValidado = validarJSON($scope.objetoRespuesta);
        if (jsonValidado === true) {
            $scope.statusProceso = 200;
        }
        else {
            var Fecha_Inicio = $filter('date')($scope.objetoRespuesta.Fecha_Inicio, "yyyy-MM-dd HH:mm:ss");
            var Fecha_Finalizacion = $filter('date')($scope.objetoRespuesta.Fecha_Finalizacion, "yyyy-MM-dd HH:mm:ss");
            $scope.objetoRespuesta.Fecha_Inicio = Fecha_Inicio;
            $scope.objetoRespuesta.Fecha_Finalizacion = Fecha_Finalizacion;
            var objetoEnviar = { peticion: JSON.stringify($scope.objetoRespuesta) };
            AppService_Encuestas.HTTPObtenerRespuestasEncuesta(objetoEnviar).then(function (response) {
                if (response.data.Respuesta === null) { $scope.statusProceso = 300; }
                else {
                    $scope.statusProceso = 0;
                    var respuesta = JSON.parse(response.data.Respuesta);
                    $scope.listaRespuestas = respuesta.resultado;
                    $scope.totalItems = $scope.listaRespuestas.length;
                }
            }, function (error) { console.log(error); });
        }

    }
});