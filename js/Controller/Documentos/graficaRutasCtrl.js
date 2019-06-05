app.controller('graficaRutasCtrl', function ($scope,
    $state,
    AppService_GraficoRutas,
    AppService_Rutas) {

    /* VARIABLES */
    $scope.CargandoTareas = false;
    $scope.CargandoGrafica = false;

    $scope.usuarioDefinido = '';
    $scope.ListaRutas = [];
    $scope.ListaRutasSeleccionadas = [];
    $scope.ListaDetallesDocumentosGrafico = [];

    $scope.Txt_Rutas = '';
    $scope.Txt_Documentos = '';
    $scope.FechaInicio = undefined;
    $scope.FechaFinal = undefined;

    $scope.ObjetoEnviar = {
        fechaInicio: '',
        fechaFinal: '',
        rutasSeleccionadas: []
    };

    /* FUNCIONES - METODOS */
    $scope.ListarRutas_dnv = function () {
        $scope.CargandoTareas = true;
        $scope.ListaRutas = [];
        $scope.ListaRutasSeleccionadas = [];
        var objetoEnviar = { peticion: '' };

        AppService_Rutas.HTTPObtenerRutasCompletas(objetoEnviar)
            .then(
                function (response) {

                    var respuesta = JSON.parse(response.data.Respuesta);
                    $scope.ListaRutas = respuesta.resultado;
                    $scope.CargandoTareas = false;

                },
                function (error) {
                    $scope.CargandoTareas = false;
                }
            );
    }

    $scope.IniciarDatePicker_dnv = function () {

        $("#txt_FI").keypress(function (event) { event.preventDefault(); });
        $("#txt_FF").keypress(function (event) { event.preventDefault(); });

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
            format: 'L',
            date: (moment().format('YYYY/MM/DD'))
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
            format: 'L',
            date: (moment().add(1, 'days').format('YYYY/MM/DD'))
        });

        $('#dpFechaInicio').datetimepicker().on("dp.change", function (e) {
            $('#dpFechaFinal').data("DateTimePicker").minDate(e.date);
            $scope.FechaInicio = $('#txt_FI').val();

            //$scope.FechaFinal = moment($scope.FechaInicio, "DD/MM/YYYY").add(1, 'days').format('DD/MM/YYYY');
            // $scope.FechaFinal = $('#txt_FF').val();

            /*  *SE AGREGA O QUITA AL ARREGLO LA RUTA SELECCIONADA 
            *SE REALIZA LA CONSULTA DE LOS DETALLES DE LAS GRAFICAS. */
            $scope.ProcesoObtenerDatosRutas();
        });
        $('#dpFechaFinal').datetimepicker().on("dp.change", function (e) {
            $('#dpFechaInicio').data("DateTimePicker").maxDate(e.date);
            $scope.FechaFinal = $('#txt_FF').val();
            /*  *SE AGREGA O QUITA AL ARREGLO LA RUTA SELECCIONADA 
            *SE REALIZA LA CONSULTA DE LOS DETALLES DE LAS GRAFICAS. */
            $scope.ProcesoObtenerDatosRutas();
        });

        /** SE CARGAN A LA ENTIDAD CUANDO CARGA */
        $scope.FechaInicio = $('#dpFechaInicio').data("DateTimePicker").viewDate()._i;
        //$scope.FechaFinal = moment($scope.FechaInicio, "DD/MM/YYYY").add(1, 'days').format('DD/MM/YYYY');

        $scope.FechaFinal = $('#dpFechaFinal').data("DateTimePicker").viewDate()._i;

    }

    $scope.ProcesoObtenerDatosRutas = function () {
        /**SE VALIDA QUE EXISTA LA FECHA INICIO */
        if (!$scope.FechaInicio)
            return;

        /**SE VALIDA QUE EXISTA LA FECHA FINAL */
        if (!$scope.FechaFinal)
            return;

        $scope.ObjetoEnviar.fechaInicio = $scope.FechaInicio;
        $scope.ObjetoEnviar.fechaFinal = $scope.FechaFinal;
        $scope.ObjetoEnviar.rutasSeleccionadas = $scope.ListaRutasSeleccionadas;
        $scope.CargandoGrafica = true;
        var objetoEnviar = { peticion: JSON.stringify($scope.ObjetoEnviar) };

        AppService_GraficoRutas.HTTP_Obtener_Datos_Grafico_Rutas(objetoEnviar)
            .then(
                function (response) {
                    var respuesta = JSON.parse(response.data.Respuesta);
                    if (respuesta) {
                        var data = [];
                        data.push(['Rutas', 'Porcentaje']); /**ESTRUCTURA DE LOS DATOS*/

                        $.each(respuesta.resultado, function (indx, val) {
                            data.push([val.Ruta + '-' + val.Nombre, val.Porcentaje]);
                        });

                        $scope.ProcesoCargarGraficaRutas(data);
                        $scope.CargandoGrafica = false;
                    }
                    else {
                        $scope.ProcesoCargarGraficaRutas([]);
                        $scope.CargandoGrafica = false;
                    }
                },
                function (error) {
                    $scope.ProcesoCargarGraficaRutas([]);
                    $scope.CargandoGrafica = false;
                });
    }

    $scope.ProcesoCargarGraficaRutas = function (datosParaProcesar) {

        if (datosParaProcesar) {

            document.getElementById("error_msg").innerHTML = "";
            google.charts.load('current', { 'packages': ['bar'] });

            var data = google.visualization.arrayToDataTable(datosParaProcesar);

            var options = {
                chart: {
                    title: 'Gráfica  de documentos por rutas',
                    subtitle: '% de rutas con documentos asignados del ' + $scope.FechaInicio + ' al ' + $scope.FechaFinal,
                },
                bars: 'vertical',
                hAxis: {
                    title: 'Rutas'
                },
                vAxis: {
                    format: 'decimal',
                    title: 'Porcentaje'
                },
                height: 400,
                colors: ['#1b9e77', '#d95f02', '#7570b3']
            };

            var chart = new google.charts.Bar($('#chart_div')[0]);

            /**
             * EVENTO CLICK
             */
            function SeleccionarBarra() {
                var itmSeleccionado = chart.getSelection()[0];
                if (itmSeleccionado) {
                    var valorSeleccionado = data.getValue(itmSeleccionado.row, 0);
                    $scope.ProcesoModal(valorSeleccionado);
                }
            }

            google.visualization.events.addListener(chart, 'select', SeleccionarBarra);

            google.visualization.events.addListener(chart, 'error', function (googleError) {
                google.visualization.errors.removeError(googleError.id);
                document.getElementById("error_msg").innerHTML = "La consulta buscada, no devolvieron datos.";
            });

            chart.draw(data, google.charts.Bar.convertOptions(options));
        }
    }

    $scope.ProcesoModal = function (elmento_seleccionado) {
        if (elmento_seleccionado) {
            $scope.CargandoGrafica = true;

            var dato = elmento_seleccionado.split('-');
            var idRuta = dato[0];
            $scope.usuarioDefinido = dato[1];
            if (idRuta) {

                var objetoEnviar = {
                    peticion: JSON.stringify({
                        fechaInicio: $scope.FechaInicio,
                        fechaFinal: $scope.FechaFinal,
                        ruta: idRuta
                    })
                };
                $scope.ListaDetallesDocumentosGrafico = [];

                AppService_GraficoRutas.HTTP_Obtener_Detalle_Ruta_Grafico(objetoEnviar)
                    .then(
                        function (response) {
                            var respuesta = JSON.parse(response.data.Respuesta);
                            if (respuesta) {
                                $scope.ListaDetallesDocumentosGrafico = respuesta.resultado;
                                $('#mdl_detalle').modal({
                                    backdrop: false,
                                    focus: true
                                }).modal('show');
                            }
                            $scope.CargandoGrafica = false;
                        },
                        function (error) {
                            $scope.CargandoGrafica = false;
                        });
            }
        }
    }

    /* EVENTOS */
    $scope.FiltrarRutas = function () {
        $.each($('#lst_rutas')[0].children, function (ind, val) {
            if (!(val.children[0].innerText.toLowerCase().indexOf($scope.Txt_Rutas.toLowerCase()) > -1)) {
                $(val).hide();
            }
            else {
                $(val).show();
            }
        });
    }

    $scope.SeleccionarRutasCHK = function (objRutaUsuario) {
        if ($.inArray(objRutaUsuario, $scope.ListaRutasSeleccionadas) == -1) {
            $scope.ListaRutasSeleccionadas.push(objRutaUsuario);
        }
        else {
            $scope.ListaRutasSeleccionadas.splice($scope.ListaRutasSeleccionadas.indexOf(objRutaUsuario), 1);
        }

        /*  *SE AGREGA O QUITA AL ARREGLO LA RUTA SELECCIONADA 
            *SE REALIZA LA CONSULTA DE LOS DETALLES DE LAS GRAFICAS. */
        $scope.ProcesoObtenerDatosRutas();
    }

    $scope.MarcarTodasLasRutas = function () {
        $.each($scope.ListaRutas, function (ind, val) {
            if ($.inArray(val.ID_Ruta_Usuario, $scope.ListaRutasSeleccionadas) == -1) {
                $scope.ListaRutasSeleccionadas.push(val.ID_Ruta_Usuario);
            }
        });

        /*  *SE AGREGA O QUITA AL ARREGLO LA RUTA SELECCIONADA 
            *SE REALIZA LA CONSULTA DE LOS DETALLES DE LAS GRAFICAS. */
        $scope.ProcesoObtenerDatosRutas();
    }

    angular.element(document).ready(function () {
        $scope.ListarRutas_dnv();
        $scope.IniciarDatePicker_dnv();
        $scope.CargandoTareas = false;
        $scope.CargandoGrafica = false;

        $scope.ProcesoCargarGraficaRutas([]);
    });

});