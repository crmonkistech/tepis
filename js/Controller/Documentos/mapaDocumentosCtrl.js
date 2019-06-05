app.controller('mapaDocumentosCtrl', function ($scope, 
    $state, 
    AppService_Documentos) {
    $scope.ListaUsuarios = [{}];
    $scope.ListaCategoriasMapa = [];
    $scope.FechaInicio = undefined;
    $scope.FechaFinal = undefined;
    $scope.ListaUsuariosSeleccionados = [];
    $scope.TextoFiltrado = '';
    $scope.ObjetoEnviar = {
        fechaInicio: '',
        fechaFinal: '',
        usuariosSeleccionados: []
    };
    $scope.CargandoTareas = false;

    //VARIABLES DE MAPA
    $scope.marker = [];
    var mapOptions = {
        zoom: 9,
        center: new google.maps.LatLng(9.927496, -84.091030),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        zoomControl: true
    };
    $scope.customStyled = [
        {
            featureType: "poi", //QUITAR LOS LABELS DEL API
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        }
    ];

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    $scope.map.set('styles', $scope.customStyled);

    //METODOS
    $scope.FiltrarListaUsr = function () {

        $.each($('#lst_usuarios')[0].children, function (ind, val) {
            if (!(val.children[0].innerText.toLowerCase().indexOf($scope.TextoFiltrado.toLowerCase()) > -1))
                $(val).hide();
            else
                $(val).show();
        });

    }

    $scope.SeleccionarUsuariocCHK = function (objUsuario) {
        if ($.inArray(objUsuario, $scope.ListaUsuariosSeleccionados) == -1) {
            $scope.ListaUsuariosSeleccionados.push(objUsuario);
        }
        else {
            $scope.ListaUsuariosSeleccionados.splice($scope.ListaUsuariosSeleccionados.indexOf(objUsuario), 1);
        }
    }

    $scope.ObtenerMarcadores = function () {
        $scope.ObjetoEnviar.fechaInicio = $scope.FechaInicio;
        $scope.ObjetoEnviar.fechaFinal = $scope.FechaFinal;
        $scope.ObjetoEnviar.usuariosSeleccionados = $scope.ListaUsuariosSeleccionados;

        var Objeto_Enviar = { peticion: JSON.stringify($scope.ObjetoEnviar) };
        AppService_Documentos.HTTP_Obtener_Marcadores_Mapa(Objeto_Enviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.marker = respuesta.resultado;
                $scope.ColocarPuntero();
            }
            else
                $scope.IniciarMapa();
        }, function (error) {
            $scope.IniciarMapa();
            console.log(error);
        });

    }

    $scope.ColocarPuntero = function () {

        $scope.IniciarMapa();
        //$scope.LimpiarMarcadoresMaps(null);

        var usuario = "";
        var arregloRutas = [];

        angular.forEach($scope.marker, function (value, key) {

            if (usuario == value.Nombre_Usuario) { //SI EL NOMBRE DEL USUARIO ES EL MISMO QUE EL ANTERIOR.

                arregloRutas.push(new google.maps.LatLng(value.Latitud, value.Longitud)); //SE AGREGA LAT Y LONG EN EL ARREGLO PARA DIBUJARLO
                if (key == ($scope.marker.length - 1)) {
                    $scope.ColocarRutaDePunteros(arregloRutas, $scope.makeColor(), usuario); //SE ENVÍA EL ARREGLO AL MAPA PARA DIBUJAR LAS LINEAS    
                }

            } else { //EN CASO QUE SEA UN USUARIO DISTINTO.

                if (key != 0) {
                    $scope.ColocarRutaDePunteros(arregloRutas, $scope.makeColor(), usuario); //SE ENVÍA EL ARREGLO AL MAPA PARA DIBUJAR LAS LINEAS    
                }

                arregloRutas = [];//SE REINICIA PARA VALIDAR EL SIGUIENTE USUARIO.
                usuario = value.Nombre_Usuario; //SE ASIGNA EL NOMBRE DEL SIGUIENTE USUARIO.
                arregloRutas.push(new google.maps.LatLng(value.Latitud, value.Longitud));//SE AGREGA EL PRIMER VALOR

            }

            var mrk = new google.maps.Marker({
                 map: $scope.map
                , title: value.Codigo_Documento + '\n' + value.Nombre_Usuario
                , position: new google.maps.LatLng(value.Latitud, value.Longitud)
                , icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    strokeColor: '#2B2B2B', 
                    strokeWeight: 0, 
                    fillColor: value.ColorMarcadorMapa,
                    fillOpacity: 1
                }
                , label: value.Codigo_Documento
                , draggable: true
            })
            .addListener('click', function () {
                new google.maps.InfoWindow({
                    content: '<div><strong>Documento:</strong>' + value.Codigo_Documento + '<hr><p><strong>Cliente: </strong>' + value.Nombre_Cliente + '</p><p><strong>Usuario:</strong>' + value.Nombre_Usuario + '</p><p><strong>Fecha de creación:</strong>' + value.Fecha_Creacion + '</p><p><strong>Monto total: </strong>' + value.Monto_Total + '</p><p><strong>Categoria:</strong>' + value.Nombre_Categoria_Documento + '</p></div>'
                }).open($scope.map, this);
            });
        });

    }

    $scope.ColocarRutaDePunteros = function (arreglo, color) {

        new google.maps.Polyline({
            path: arreglo
            , map: $scope.map
            , strokeColor: color
            , strokeWeight: 3
            , strokeOpacity: 0.7
            , clickable: false
            // , editable: true
        });

    }

    $scope.makeColor = function () {
        var hexVal = "0123456789ABCDEF".split("");
        return '#' + hexVal.sort(function () {
            return (Math.round(Math.random()) - 0.5);
        }).slice(0, 6).join('');
    }

    $scope.IniciarMapa = function () {
        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        $scope.map.set('styles', $scope.customStyled);
    }

    //INI
    $scope.ListarUsr = function () {
        $scope.CargandoTareas = true;
        var Objeto_Enviar = { peticion: '' };
        AppService_Documentos.HTTP_Obtener_Usuarios_Mapa(Objeto_Enviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.ListaUsuarios = respuesta.resultado;
            }
            $scope.CargandoTareas = false;
        }, function (error) {
            $scope.CargandoTareas = false;
        });
    }

    $scope.IniciarCategorias = function () {
        var Objeto_Enviar = { peticion: '' };
        AppService_Documentos.HTTP_Obtener_Descripcion_Cagtegoria_Mapa(Objeto_Enviar)
            .then(function (response) {
                if (response.data.Respuesta !== null) {
                    var respuesta = JSON.parse(response.data.Respuesta);
                    $scope.ListaCategoriasMapa = respuesta.resultado;
                }
            }, function (error) { });
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
            format: 'L'
        });
        $("#txt_FI").keypress(function (event) { event.preventDefault(); });
        $("#txt_FF").keypress(function (event) { event.preventDefault(); });
        $('#dpFechaInicio').datetimepicker().on("dp.change", function (e) {
            $('#dpFechaFinal').data("DateTimePicker").minDate(e.date);
            $scope.FechaInicio = $('#txt_FI').val();
        });
        $('#dpFechaFinal').datetimepicker().on("dp.change", function (e) {
            $('#dpFechaInicio').data("DateTimePicker").maxDate(e.date);
            $scope.FechaFinal = $('#txt_FF').val();
        });

    }

    angular.element(document).ready(function () {
        $scope.ListarUsr();
        $scope.IniciarCategorias();
        $scope.IniciarDatePicker();
    });

});