app.controller('MotivosDevolucionCtrl', function ($scope, 
    $state, 
    $filter, 
    AppService_MotivosDevolucion) {

    $scope.listaMotivos = [];
    $scope.objetoMotivos = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Motivo: "" };

    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    $scope.Filtrar_Entidad = function () { return $filter('filter')($scope.listaMotivos, $scope.objetoMotivos.Filtro_Motivo); }
    $scope.Calcular_Paginacion = function () { return Math.ceil($scope.Filtrar_Entidad().length / $scope.Cantidad_Items); }

    $scope.obtenerMotivos = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoMotivos) };
        AppService_MotivosDevolucion.HTTPObtenerMotivosDevolucion(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaMotivos = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    $scope.EliminarMotivosDevolucion = function (Motivo_Devolucion) {
        Motivo_Devolucion.Accion = 'e';
        var objetoEnviar = { peticion: JSON.stringify(Motivo_Devolucion) };
        AppService_MotivosDevolucion.HTTPProcesosMotivosDevolucion(objetoEnviar)
            .then(function (response) {
                if (response.data.Respuesta !== null) {
                    var respuesta = JSON.parse(response.data.Respuesta);
                    $scope.obtenerMotivos();
                }
            }, function (error) { console.log(error); });
    }

    $scope.irANuevoMotivoDevolucion = function () {
        $state.go('dashboard.registrarNuevoMotivoDevolucion');
    }

    $scope.editarMotivoDevolucion = function (Motivo_Devolucion) {
        $state.go('dashboard.editarMotivoDevolucion', { MtvEnviado: Motivo_Devolucion });
    }

    angular.element(document).ready(function () {
        $scope.obtenerMotivos();
    });

});

app.controller('RegistrarNuevoMotivoDevolucionCtrl', function ($scope, 
    $state, 
    $timeout, 
    AppService_MotivosDevolucion) {

    $scope.objetoMotivo = { ID_Empresa: objetoSesion.ID_Empresa };
    $scope.nuevoMotivo = { Nombre_Motivo: "", Descripcion: "", FK_ID_Empresa: $scope.objetoMotivo.ID_Empresa, Eliminado: 0, Accion: 'i' };

    $scope.statusProceso = 0;

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.agregarMotivo = function () {
        var jsonValidado = validarJSON($scope.nuevoMotivo);
        if (jsonValidado === true) { $scope.statusProceso = 100; }
        else {
            var objetoEnviar = { peticion: JSON.stringify($scope.nuevoMotivo) };
            AppService_MotivosDevolucion.HTTPProcesosMotivosDevolucion(objetoEnviar).then(function (response) {
                $scope.statusProceso = response.data.Respuesta;
                if ($scope.statusProceso === "200") {
                    $scope.nuevoMotivo = {
                        Nombre_Motivo: "", Descripcion: "", FK_ID_Empresa: $scope.objetoMotivo.ID_Empresa, Eliminado: 0,
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

app.controller('EditarMotivoDevolucionCtrl', function ($scope, 
    $state, 
    $stateParams, 
    AppService_MotivosDevolucion) {

    $scope.Motivo = $stateParams.MtvEnviado;
    $scope.infoJornada = 0;

    $scope.actualizarMotivoDevolucion = function () {

        var objetoEnviar = {
            peticion: JSON.stringify($scope.Motivo)
        };

        AppService_MotivosDevolucion.HTTPProcesoActualizacionMotivosDevolucion(objetoEnviar).then(function (response) {
            var res = JSON.parse(response.data.Respuesta);
            $scope.infoJornada = res.resultado[0];
            if ($scope.infoJornada.Respuesta == 200) {
                $state.go('dashboard.vistaMotivosDevolucion');
            }
        }, function (error) {
            console.log(error);
        });
    }

});  