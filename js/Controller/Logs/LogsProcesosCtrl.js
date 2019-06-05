app.controller('LogsProcesosCtrl', function ($scope, 
    $state, 
    $timeout, 
    AppService_SAP) {

    $scope.ListaProcesos = [];
    $scope.ListaEmpresas = [];
    $scope.ListaBodegas = [];
    $scope.ListaParametros = [];
    $scope.ListaCompanias = [];
    $scope.ProcesoCargando = false;
    $scope.ObjetoEnvioProcedimiento = {
        Procedimiento: '',
        Bodega: undefined,
        Empresa: undefined,
        FechaInicio: undefined,
        FechaFinal: undefined
    };
    $scope.ObjRespuestaProceso = {
        Estado: false,
        Mensaje: '',
        attr: 'alert-info'
    };

    $scope.ReiniciarValores = function () {
        $scope.ObjetoEnvioProcedimiento.Bodega = undefined;
        $scope.ObjetoEnvioProcedimiento.Empresa = undefined;
        $scope.ObjetoEnvioProcedimiento.FechaInicio = undefined;
        $scope.ObjetoEnvioProcedimiento.FechaFinal = undefined;

        $scope.ObjRespuestaProceso.Estado = false;
        $scope.ObjRespuestaProceso.Mensaje = '';
        $scope.ObjRespuestaProceso.attr = 'alert-info';

        $scope.ProcesoCargando = false;
    }

    $scope.ListarProcesos = function () {
        AppService_SAP.HTTP_Obtener_Logs_Procedimientos().then(function (response) {
            if (response.data.Respuesta !== null) {
                var jsResult = JSON.parse(response.data.Respuesta);
                $scope.ListaProcesos = jsResult.resultado;
            }
        }, function (error) { console.log(error) });
    }

    $scope.ListarBodegas = function () {
        AppService_SAP.HTTP_Obtener_Logs_Bodegas().then(function (response) {
            if (response.data.Respuesta !== null) {
                var jsResult = JSON.parse(response.data.Respuesta);
                $scope.ListaBodegas = jsResult.resultado;
            }
        }, function (error) { console.log(error) });
    }

    $scope.ListarCompanias = function () {
        AppService_SAP.HTTP_Obtener_Logs_Compannias().then(function (response) {
            if (response.data.Respuesta !== null) {
                var jsResult = JSON.parse(response.data.Respuesta);
                $scope.ListaCompanias = jsResult.resultado;
            }
        }, function (error) { console.log(error) });
    }

    $scope.ListarEmpresas = function () {
        AppService_SAP.HTTP_Obtener_Logs_Empresas().then(function (response) {
            if (response.data.Respuesta !== null) {
                var jsResult = JSON.parse(response.data.Respuesta);
                $scope.ListaEmpresas = jsResult.resultado;
            }
        }, function (error) { console.log(error) });
    }

    $scope.BuscarParametros = function () {
        if ($scope.ObjetoEnvioProcedimiento.Procedimiento) {
            $scope.ListaParametros = [];
            var Objeto_Enviar = { peticion: JSON.stringify($scope.ObjetoEnvioProcedimiento) };
            AppService_SAP.HTTP_Obtener_Logs_Parametros_Procedimientos(Objeto_Enviar)
                .then(function (response) {
                    if (response.data.Respuesta !== null) {
                        var jsResult = JSON.parse(response.data.Respuesta);
                        $.each(jsResult.resultado, function (ind, val) {
                            $scope.ListaParametros.push(val.nombreParametro);
                        });
                        $scope.ReiniciarValores();
                    }
                }, function (error) { console.log('Error al listar parametros', error) });
        }
    }

    $scope.EventoActualizar = function (isValid) {
        if (isValid) {
            $scope.ProcesoCargando = true;

            var castParametros = {
                Procedimiento: $scope.ObjetoEnvioProcedimiento.Procedimiento,
                ProcedimientoIN: `${$scope.ObjetoEnvioProcedimiento.Empresa != undefined ? '@ID_Empresa=' + $scope.ObjetoEnvioProcedimiento.Empresa + ',' : ''}`
                    + `${$scope.ObjetoEnvioProcedimiento.Bodega != undefined ? '@ID_Bodega=' + $scope.ObjetoEnvioProcedimiento.Bodega + ',' : ''}`
                    + `${$scope.ObjetoEnvioProcedimiento.FechaInicio != undefined ? '@FECHAINICIAL=\'' + $scope.ObjetoEnvioProcedimiento.FechaInicio + '\',' : ''}`
                    + `${$scope.ObjetoEnvioProcedimiento.FechaFinal != undefined ? '@FECHAFINAL=\'' + $scope.ObjetoEnvioProcedimiento.FechaFinal + '\',' : ''}`
            };

            castParametros.ProcedimientoIN = castParametros.ProcedimientoIN.substr(0, (castParametros.ProcedimientoIN.length - 1));
            var Objeto_Enviar = { peticion: JSON.stringify(castParametros) };

            // myLog({ title: 'Envio a la api', contenido: Objeto_Enviar });

            AppService_SAP.HTTP_Obtener_Logs_Ejecutar_Procedimientos(Objeto_Enviar)
                .then(function (response) {
                    if (response.data.Respuesta !== null) {
                        var jsResult = JSON.parse(response.data.Respuesta);
                        jsResult = jsResult.resultado[0];

                        if (jsResult.Estado == 1) {
                            $scope.ObjRespuestaProceso.Estado = 1;
                            $scope.ObjRespuestaProceso.Mensaje = jsResult.Respuesta;
                            $scope.ObjRespuestaProceso.attr = 'alert-info';
                        }
                        else {
                            $scope.ObjRespuestaProceso.Estado = 1;
                            $scope.ObjRespuestaProceso.Mensaje = jsResult.Respuesta;
                            $scope.ObjRespuestaProceso.attr = 'alert-danger';
                            myLog({ title: 'Error:Ejecutar procedimiento', contenido: jsResult.MensajeError });
                        }
                    }
                    $scope.ProcesoCargando = false;
                }, function (error) {
                    myLog({ title: 'Error:Ejecutar API', contenido: error });
                    $scope.ProcesoCargando = false;
                });
        }
    }

    $scope.IniciarDatePicker = function () {

        $('#dpFechaInicio').datetimepicker({
            locale: 'es',
            icons: {
                time: "icon-clock",
                date: "icon-calendar",
                up: "icon-arrow-up",
                down: "icon-arrow-down",
                previous: 'icon-arrow-left',
                next: 'icon-arrow-right',
                today: 'glyphicon glyphicon-screenshot',
                clear: 'glyphicon glyphicon-trash',
                close: 'icon-close'
            },
            format: 'YYYY/MM/DD'
        });
        $('#dpFechaFinal').datetimepicker({
            locale: 'es',
            icons: {
                time: "icon-clock",
                date: "icon-calendar",
                up: "icon-arrow-up",
                down: "icon-arrow-down",
                previous: 'icon-arrow-left',
                next: 'icon-arrow-right',
                today: 'glyphicon glyphicon-screenshot',
                clear: 'glyphicon glyphicon-trash',
                close: 'icon-close'
            },
            useCurrent: false,
            format: 'YYYY/MM/DD'
        });

        $("#txt_FI").keypress(function (event) { event.preventDefault(); });
        $("#txt_FF").keypress(function (event) { event.preventDefault(); });

        $('#dpFechaInicio').datetimepicker()
            .on("dp.change", function (e) {
                $('#dpFechaFinal').data("DateTimePicker").minDate(e.date);
                $scope.ObjetoEnvioProcedimiento.FechaInicio = $('#txt_FI').val();
            });

        $('#dpFechaFinal').datetimepicker()
            .on("dp.change", function (e) {
                $('#dpFechaInicio').data("DateTimePicker").maxDate(e.date);
                $scope.ObjetoEnvioProcedimiento.FechaFinal = $('#txt_FF').val();
            });

    }

    angular.element(document).ready(function () {
        $scope.ListarProcesos();
        $scope.ListarBodegas();
        $scope.ListarEmpresas();
        $scope.ListarCompanias();
        $scope.IniciarDatePicker();
    });

});  