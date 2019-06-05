app.controller('ProcesoPedidosCtrl', function ($scope, 
    $state, 
    AppService_Pedidos,
    AppService_Rutas) {

    /* VARIABLES */
    $scope.CargandoTareas = false;
    $scope.CargandoDocumentos = false;

    $scope.ListaUsuarios = [];
    $scope.ListaRutas_chk = [];
    $scope.ListaRutas_cb = [];
    $scope.ListaDocumentosPedidos = [];
    $scope.ListaDetalleDocumentosPedidos = [];

    $scope.ListaRutas_chkSeleccionadas = [];
    $scope.ListaDocumentosPedidosSeleccionados = [];
    $scope.RutaCBSeleccionada = 0;


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
    $scope.ListarRutas = function () {
        $scope.CargandoTareas = true;
        $scope.ListaRutas_chk = [];
        $scope.ListaRutas_chkSeleccionadas = [];
        var Objeto_Enviar = { peticion: '' };

        AppService_Rutas.HTTPObtenerRutasCompletas(Objeto_Enviar)
            .then(
                function (response) {

                    var respuesta = JSON.parse(response.data.Respuesta);
                    $scope.ListaRutas_chk = respuesta.resultado;
                    $scope.CargandoTareas = false;

                },
                function (error) {
                    $scope.CargandoTareas = false;
                }
            );
    }

    $scope.ObtenerListaDocumentosPedidos = function () {

        /**SE VALIDA QUE EXISTA LA FECHA INICIO */
        if (!$scope.FechaInicio)
            return;

        /**SE VALIDA QUE EXISTA LA FECHA FINAL */
        if (!$scope.FechaFinal)
            return;


        $scope.ObjetoEnviar.fechaInicio = $scope.FechaInicio;
        $scope.ObjetoEnviar.fechaFinal = $scope.FechaFinal;
        $scope.ObjetoEnviar.rutasSeleccionadas = $scope.ListaRutas_chkSeleccionadas;

        $scope.CargandoDocumentos = true;
        $scope.ListaDocumentosPedidos = [];
        $scope.ListaDocumentosPedidosSeleccionados = [];

        var Objeto_Enviar = { peticion: JSON.stringify($scope.ObjetoEnviar) };

        AppService_Pedidos.HTTP_Obtener_Documentos_Pedidos(Objeto_Enviar)
            .then(
                function (response) {
                    var respuesta = JSON.parse(response.data.Respuesta);
                    if (respuesta != null) {
                        $scope.ListaDocumentosPedidos = respuesta.resultado;
                        $scope.CargandoDocumentos = false;
                    }
                    else {
                        $scope.CargandoDocumentos = false;
                    }
                },
                function (error) {
                    $scope.CargandoDocumentos = false;
                }
            );
    }

    $scope.ObtenerDetalleDocumentoPedido = function (id_documento) {
        $scope.ListaDetalleDocumentosPedidos = [];
        var Objeto_Enviar = {
            peticion: JSON.stringify({
                IdDocumento: id_documento
            })
        };
        AppService_Pedidos.HTTP_Obtener_Detalle_Documentos_Pedidos(Objeto_Enviar)
            .then(
                function (response) {
                    var respuesta = JSON.parse(response.data.Respuesta);
                    if (respuesta != null) {
                        $scope.ListaDetalleDocumentosPedidos = respuesta.resultado;
                        $('#mdl_detalle').modal({
                            backdrop: false,
                            focus: true
                        }).modal('show');
                    }
                },
                function (error) {
                }
            );
    }

    $scope.IniciarDatePicker = function () {

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
            date: (moment().format('YYYY/MM/DD')),
            format: 'L'
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
            date: (moment().add(1, 'days').format('YYYY/MM/DD')),
            format: 'L'
        });

        $('#dpFechaInicio').datetimepicker().on("dp.change", function (e) {
            $('#dpFechaFinal').data("DateTimePicker").minDate(e.date);
            $scope.FechaInicio = $('#txt_FI').val();
            /*  *SE AGREGA O QUITA AL ARREGLO LA RUTA SELECCIONADA 
            *SE REALIZA LA CONSULTA DE LOS DOCUMENTOS DE LOS USUARIOS SELECCIONADOS. */
            $scope.ObtenerListaDocumentosPedidos();
        });
        $('#dpFechaFinal').datetimepicker().on("dp.change", function (e) {
            $('#dpFechaInicio').data("DateTimePicker").maxDate(e.date);
            $scope.FechaFinal = $('#txt_FF').val();
            /*  *SE AGREGA O QUITA AL ARREGLO LA RUTA SELECCIONADA 
            *SE REALIZA LA CONSULTA DE LOS DOCUMENTOS DE LOS USUARIOS SELECCIONADOS. */
            $scope.ObtenerListaDocumentosPedidos();
        });

        /** SE CARGAN A LA ENTIDAD CUANDO CARGA */
        $scope.FechaInicio = $('#dpFechaInicio').data("DateTimePicker").viewDate()._i;
        $scope.FechaFinal = $('#dpFechaFinal').data("DateTimePicker").viewDate()._i;

    }

    $scope.ListarRutasParaCombo = function () {
        $scope.CargandoTareas = true;
        $scope.ListaRutas_cb = [];

        var Objeto_Enviar = { peticion: '' };

        AppService_Pedidos.HTTP_Obtener_Rutas_Combo(Objeto_Enviar)
            .then(
                function (response) {

                    var respuesta = JSON.parse(response.data.Respuesta);
                    $scope.ListaRutas_cb = respuesta.resultado;
                    $scope.CargandoTareas = false;
                    $scope.ListarRutas();
                },
                function (error) {
                    $scope.CargandoTareas = false;
                }
            );
    }

    $scope.LimpiarListas = function () {
        $scope.ListaDocumentosPedidosSeleccionados = []
    }

    /* EVENTOS */
    $scope.ProcesarPedido = function (isValid) {
        /**LISTA CON LOS DOCUMENTOS SELECCIONADOS */

        if (isValid) {

            /**SE VALIDA QUE EXISTA LA FECHA INICIO */
            if (!$scope.FechaInicio)
                return;

            /**SE VALIDA QUE EXISTA LA FECHA FINAL */
            if (!$scope.FechaFinal)
                return;

            /*SE VALIDA QUE EXISTA UNA RUTA DEL COMBO SELECCIONADA. */
            if ((!$scope.RutaCBSeleccionada) || ($scope.RutaCBSeleccionada <= 0))
                return;



            var Objeto_Enviar = {
                peticion: JSON.stringify({
                    fechaInicio: $scope.FechaInicio,
                    fechaFinal: $scope.FechaFinal,
                    documentosSeleccionados: $scope.ListaDocumentosPedidosSeleccionados,
                    CB_rutaSeleccionada: $scope.RutaCBSeleccionada,
                    ID_usuarioLogin: objetoSesion.ID_Usuario,
                    ID_Documento: 000
                })
            };

            myLog({ title: 'datos procesar pedido', contenido: JSON.parse(Objeto_Enviar.peticion) });

            AppService_Pedidos.HTTP_Procesar_Documentos_Pedidos(Objeto_Enviar)
                .then(
                    function (response) {
                        var respuesta = JSON.parse(response.data.Respuesta);
                        if (respuesta != null) {
                            myLog({ title: 'Finalizo el proceso', contenido: respuesta });
                            $scope.LimpiarListas();
                        }
                    },
                    function (error) {
                        myLog({ title: 'ocurrió un error en el proceso', contenido: error });
                    }
                );

        }

    }

    $scope.MostrarDetallesMDL = function (id_documento) {
        if (id_documento) {
            $scope.ObtenerDetalleDocumentoPedido(id_documento);
        }
    }

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

    $scope.FiltrarRutasDocumentos = function () {
        $.each($('#lst_documentos')[0].children, function (ind, val) {
            if (!(val.children[0].innerText.toLowerCase().indexOf($scope.Txt_Documentos.toLowerCase()) > -1)) {
                $(val).hide();
            }
            else {
                $(val).show();
            }
        });
    }

    $scope.SeleccionarRutasCHK = function (objRutaUsuario) {
        if ($.inArray(objRutaUsuario, $scope.ListaRutas_chkSeleccionadas) == -1) {
            $scope.ListaRutas_chkSeleccionadas.push(objRutaUsuario);
        }
        else {
            $scope.ListaRutas_chkSeleccionadas.splice($scope.ListaRutas_chkSeleccionadas.indexOf(objRutaUsuario), 1);
        }
        /*  *SE AGREGA O QUITA AL ARREGLO LA RUTA SELECCIONADA 
            *SE REALIZA LA CONSULTA DE LOS DOCUMENTOS DE LOS USUARIOS SELECCIONADOS. */
        $scope.ObtenerListaDocumentosPedidos();
    }

    $scope.MarcarTodasLasRutas = function () {
        $.each($scope.ListaRutas_chk, function (ind, val) {
            if ($.inArray(val.ID_Ruta_Usuario, $scope.ListaRutas_chkSeleccionadas) == -1) {
                $scope.ListaRutas_chkSeleccionadas.push(val.ID_Ruta_Usuario);
            }
        });
        /*  *SE AGREGA O QUITA AL ARREGLO LA RUTA SELECCIONADA 
            *SE REALIZA LA CONSULTA DE LOS DOCUMENTOS DE LOS USUARIOS SELECCIONADOS. */
        $scope.ObtenerListaDocumentosPedidos();
    }

    $scope.SeleccionarDocumentosCHK = function (objDocumento) {
        if ($.inArray(objDocumento, $scope.ListaDocumentosPedidosSeleccionados) == -1) {
            $scope.ListaDocumentosPedidosSeleccionados.push(objDocumento);
        }
        else {
            $scope.ListaDocumentosPedidosSeleccionados.splice($scope.ListaDocumentosPedidosSeleccionados.indexOf(objDocumento), 1);
        }
    }

    $scope.MarcarTodosLosDocumentos = function () {
        $.each($scope.ListaDocumentosPedidos, function (ind, val) {
            if ($.inArray(val.ID_Documento, $scope.ListaDocumentosPedidosSeleccionados) == -1) {
                $scope.ListaDocumentosPedidosSeleccionados.push(val.ID_Documento);
            }
        });
    }

    angular.element(document).ready(function () {
        $scope.ListarRutasParaCombo();
        $scope.IniciarDatePicker();
        $scope.CargandoTareas = false;
        $scope.CargandoDocumentos = false;
    });

});