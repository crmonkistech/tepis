app.controller('detalleNoVentaCtrl', function ($scope, 
    $state, 
    AppService_DetallesNoVenta,
    AppService_Rutas) {

    /* VARIABLES */
    $scope.CargandoTareas = false;
    $scope.CargandoDetallesNoVenta = false;

    $scope.ListaUsuarios = [];
    $scope.ListaRutas = [];
    $scope.ListaRutasSeleccionadas = [];

    $scope.ListaDetalleNoVenta = [];

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
        var Objeto_Enviar = { peticion: '' };

        AppService_Rutas.HTTPObtenerRutasCompletas(Objeto_Enviar)
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
            date: (moment().add(1, 'days').format('YYYY/MM/DD'))
        });

        $('#dpFechaInicio').datetimepicker().on("dp.change", function (e) {
            $('#dpFechaFinal').data("DateTimePicker").minDate(e.date);
            $scope.FechaInicio = $('#txt_FI').val();
            /*  *SE AGREGA O QUITA AL ARREGLO LA RUTA SELECCIONADA 
           *SE REALIZA LA CONSULTA DE LOS DETALLES DE NO VENTA SELECCIONADOS. */
            $scope.ProcesoObtenerDetallesNoVenta();
        });
        $('#dpFechaFinal').datetimepicker().on("dp.change", function (e) {
            $('#dpFechaInicio').data("DateTimePicker").maxDate(e.date);
            $scope.FechaFinal = $('#txt_FF').val();
            /*  *SE AGREGA O QUITA AL ARREGLO LA RUTA SELECCIONADA 
           *SE REALIZA LA CONSULTA DE LOS DETALLES DE NO VENTA SELECCIONADOS. */
            $scope.ProcesoObtenerDetallesNoVenta();
        });

        /** SE CARGAN A LA ENTIDAD CUANDO CARGA */
        $scope.FechaInicio = $('#dpFechaInicio').data("DateTimePicker").viewDate()._i;
        $scope.FechaFinal = $('#dpFechaFinal').data("DateTimePicker").viewDate()._i;

    }

    $scope.ProcesoObtenerDetallesNoVenta = function () {
        /**SE VALIDA QUE EXISTA LA FECHA INICIO */
        if (!$scope.FechaInicio)
            return;

        /**SE VALIDA QUE EXISTA LA FECHA FINAL */
        if (!$scope.FechaFinal)
            return;

        $scope.ListaDetalleNoVenta = [];
        $scope.ObjetoEnviar.fechaInicio = $scope.FechaInicio;
        $scope.ObjetoEnviar.fechaFinal = $scope.FechaFinal;
        $scope.ObjetoEnviar.rutasSeleccionadas = $scope.ListaRutasSeleccionadas;
        $scope.CargandoDetallesNoVenta = true;
        var Objeto_Enviar = { peticion: JSON.stringify($scope.ObjetoEnviar) };

        AppService_DetallesNoVenta.HTTP_Obtener_Detalles_No_Venta(Objeto_Enviar)
            .then(
                function (response) {
                    var respuesta = JSON.parse(response.data.Respuesta);
                    if (respuesta) {
                        $scope.ListaDetalleNoVenta = respuesta.resultado;
                        $scope.CargandoDetallesNoVenta = false;
                    }
                    else
                        $scope.CargandoDetallesNoVenta = false;
                },
                function (error) {
                    $scope.CargandoDetallesNoVenta = false;
                });

    }

    $scope.ProcesoExcel = function () {
        var tmpElemento = document.createElement('a');
        var data_type = 'data:application/vnd.ms-excel';
        var tabla_div = document.getElementById('tblReporte');
        var tabla_html = tabla_div.outerHTML.replace(/ /g, '%20');
        tmpElemento.href = data_type + ', ' + tabla_html;
        tmpElemento.download = 'ReporteDetalleNoVenta.xls';
        tmpElemento.click();
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
            *SE REALIZA LA CONSULTA DE LOS DETALLES DE NO VENTA SELECCIONADOS. */
        $scope.ProcesoObtenerDetallesNoVenta();
    }

    $scope.MarcarTodasLasRutas = function () {
        $.each($scope.ListaRutas, function (ind, val) {
            if ($.inArray(val.ID_Ruta_Usuario, $scope.ListaRutasSeleccionadas) == -1) {
                $scope.ListaRutasSeleccionadas.push(val.ID_Ruta_Usuario);
            }
        });

        /*  *SE AGREGA O QUITA AL ARREGLO LA RUTA SELECCIONADA 
            *SE REALIZA LA CONSULTA DE LOS DETALLES DE NO VENTA SELECCIONADOS. */
        $scope.ProcesoObtenerDetallesNoVenta();
    }

    angular.element(document).ready(function () {
        $scope.ListarRutas_dnv();
        $scope.IniciarDatePicker_dnv();
        $scope.CargandoTareas = false;
        $scope.CargandoDetallesNoVenta = false;
    });

});