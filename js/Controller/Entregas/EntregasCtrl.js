app.controller('EntregasCtrl', function ($scope, 
    $state, 
    $filter, 
    AppService_RutasEntrega) {

    $scope.Lista_Entregas = [];
    $scope.Objeto_Entrega = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Entrega: "" };

    /*Controles para la paginacion*/
    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.FiltrarEntidad = function () { return $filter('filter')($scope.Lista_Entregas, $scope.Objeto_Entrega.Filtro_Entrega); }

    $scope.CalcularPaginacion = function () { return Math.ceil($scope.FiltrarEntidad().length / $scope.Cantidad_Items); }

    $scope.obtenerEntregas = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.Objeto_Entrega) };
        AppService_RutasEntrega.HTTPObtenerRutasEntrega(objetoEnviar).then(function (response) {
            console.log(response);
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.Lista_Entregas = respuesta.resultado;
                console.log($scope.Lista_Entregas);
            }
        }, function (error) { console.log(error); });
    }

    $scope.irANuevaEntrega = function () { $state.go('dashboard.registrarNuevaEntrega'); }
    $scope.editarEntrega = function (ID_Entrega_Seleccionada) { $state.go('dashboard.editarEntrega', { ID_Ruta_Entrega: ID_Entrega_Seleccionada }); }

    angular.element(document).ready(function () {
        var jsonValidado = validarJSON(objetoSesion);
        if (jsonValidado === true) { $state.go('login'); }
        else { $scope.obtenerEntregas(); }
    });

});

app.controller('RegistrarNuevaEntregaCtrl', function ($scope, 
    $timeout, 
    $filter, 
    $state, 
    AppService_Rutas,
    AppService_RutasEntrega,
    AppService_Estados) {

    $scope.Objeto_Ruta = { Nombre_Ruta: "", Codigo_Ruta: "", ID_Empresa: objetoSesion.ID_Empresa, FK_ID_Ruta: null, Accion: 'i', FK_ID_Estado: null, ID_Ruta_Entrega: 0 };
    $scope.Objeto_Filtro = { Filtro_Usuario: "", Filtro_Entrega: "" };
    $scope.Lista_Rutas = [];
    $scope.Lista_Clientes = [];
    $scope.Lista_Entregas = [];
    $scope.Lista_Clientes_Seleccionados = [];
    $scope.Lista_Usuarios = [];
    $scope.Lista_Estados = [];
    $scope.Lista_Usuarios_Asignados = {};
    $scope.Lista_Entregas_Asignadas = {};

    $scope.Estado_Proceso = 0;

    /*Variables de paginacion para Documentos de entrega*/
    $scope.Pagina_Actual_Entregas = 0;
    $scope.Cantidad_Items_Entregas = 10;

    /*Variables de paginacion para Usuarios*/
    $scope.Pagina_Actual_Usuarios = 0;
    $scope.Cantidad_Items_Usuarios = 10;

    /*Creacion del Mapa*/
    $scope.markers = [];
    $scope.listaMarcadores = [];
    $scope.figura = null;
    var infoWindow = new google.maps.InfoWindow();
    var mapOptions = { zoom: 8, center: new google.maps.LatLng(9.927496, -84.091030), mapTypeId: google.maps.MapTypeId.ROADMAP };

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    $scope.drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: { position: google.maps.ControlPosition.TOP_CENTER, drawingModes: ['circle', 'polygon', 'rectangle'] },
        circleOptions: { fillColor: '#898989', fillOpacity: 0.5, strokeWeight: 1, clickable: false, editable: true }
    });

    /*Eventos sobre el mapa*/
    google.maps.event.addListener($scope.drawingManager, 'circlecomplete', function (circle) {
        $scope.figura = circle;
        $scope.Obtener_Documentos_Entrega_Clientes_Seleccionados();
    });
    google.maps.event.addListener($scope.drawingManager, 'polygoncomplete', function (polygon) {
        $scope.figura = polygon;
        $scope.Obtener_Documentos_Entrega_Clientes_Seleccionados();
    });
    google.maps.event.addListener($scope.drawingManager, 'rectanglecomplete', function (rectangle) {
        $scope.figura = rectangle;
        $scope.Obtener_Documentos_Entrega_Clientes_Seleccionados();
    });

    $scope.drawingManager.setMap($scope.map);

    $scope.openInfoWindow = function (e, selectedMarker) {
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }

    var figuraContiene = function (figura, latLng) {
        if (figura instanceof google.maps.Circle) {
            return figura.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(figura.getCenter(), latLng) <= figura.getRadius();
        }
        else if (figura instanceof google.maps.Rectangle) {
            return figura.getBounds().contains(latLng);
        }
        else if (figura instanceof google.maps.Polygon) {
            return google.maps.geometry.poly.containsLocation(latLng, figura);
        }
        else {
            throw new Error('Contains no es soportado en la figura')
        }
    }

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.FiltrarEntidadUsuarios = function () { return $filter('filter')($scope.Lista_Usuarios, $scope.Objeto_Filtro.Filtro_Usuario); }

    $scope.FiltrarEntidadEntregas = function () { return $filter('filter')($scope.Lista_Entregas, $scope.Objeto_Filtro.Filtro_Entrega); }

    $scope.CalcularPaginacionUsuarios = function () { return Math.ceil($scope.FiltrarEntidadUsuarios().length / $scope.Cantidad_Items_Usuarios); }

    $scope.CalcularPaginacionEntregas = function () { return Math.ceil($scope.FiltrarEntidadEntregas().length / $scope.Cantidad_Items_Entregas); }

    /*Busqueda de Clientes con Entrega en la figura realizada*/
    $scope.Obtener_Documentos_Entrega_Clientes_Seleccionados = function () {
        //var bounds = $scope.figura.getBounds();
        var Seleccion_Incluye_Clientes = false;
        var Lista_Clientes_Length = $scope.Lista_Clientes.length;
        var Cliente_Actual = null;
        for (var i = 0; i < Lista_Clientes_Length; i++) {
            Cliente_Actual = $scope.Lista_Clientes[i];
            var latLng = new google.maps.LatLng(Cliente_Actual.Latitud, Cliente_Actual.Longitud);
            if (figuraContiene($scope.figura, latLng)) {
                Seleccion_Incluye_Clientes = true;
                console.log('El cliente ' + Cliente_Actual.Nombre_Cliente + ' si esta dentro de la figura seleccionada');
                var json = { FK_ID_Cliente: Cliente_Actual.ID_Cliente };
                $scope.Lista_Clientes_Seleccionados.push(json);
            }
        }

        if (Seleccion_Incluye_Clientes === true) {
            console.log('Si habian clientes dentro de la figura dibujada');
            console.log($scope.Lista_Clientes_Seleccionados);
            $scope.Lista_Entregas = [];
            var Objeto_Enviar = { peticion: JSON.stringify({ Lista_Clientes_Seleccionados: JSON.stringify($scope.Lista_Clientes_Seleccionados) }) };
            console.log(Objeto_Enviar);
            AppService_RutasEntrega.HTTPObtenerDocumentosEntrega(Objeto_Enviar).then(function (response) {
                console.log(response);
                if (response.data.Respuesta != null) {
                    var respuesta = JSON.parse(response.data.Respuesta);
                    $scope.Lista_Entregas = respuesta.resultado;
                    $scope.Lista_Clientes_Seleccionados = [];
                }
            }, function (error) { console.log(error) });
        }
        else {
            console.log('No habian clientes dentro de la figura seleccionada');
            $scope.Lista_Entregas = [];
            $scope.Lista_Clientes_Seleccionados = [];
        }
    }

    $scope.Eliminar = function () {
        $scope.figura.setMap(null);
    }

    $scope.Obtener_Rutas_Empresa = function () {
        var objetoEnviar = { peticion: JSON.stringify({ ID_Empresa: objetoSesion.ID_Empresa, Filtro_Rutas: '' }) };
        AppService_Rutas.HTTPObtenerRutas(objetoEnviar).then(function (response) {
            if (response.data.Respuesta != null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.Lista_Rutas = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    $scope.Obtener_Clientes_Ruta_Entregas = function () {
        var objetoEnviar = { peticion: JSON.stringify({ ID_Empresa: objetoSesion.ID_Empresa, ID_Ruta: $scope.Objeto_Ruta.FK_ID_Ruta }) };
        AppService_RutasEntrega.HTTPClientesRutaEntregaID(objetoEnviar).then(function (response) {
            if (response.data.Respuesta != null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.Lista_Clientes = respuesta.resultado;
                console.log($scope.Lista_Clientes);
                var Lista_CLientes_Length = $scope.Lista_Clientes.length;
                var Cliente_Actual = null;
                for (var i = 0; i < Lista_CLientes_Length; i++) {
                    Cliente_Actual = $scope.Lista_Clientes[i];
                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        position: new google.maps.LatLng(Cliente_Actual.Latitud, Cliente_Actual.Longitud),
                        title: Cliente_Actual.Nombre_Cliente
                    });
                    marker.content = '<div class="infoWindowContent">' + Cliente_Actual.Nombre_Fantasia + '<br />' + Cliente_Actual.Latitud + ' E,' + Cliente_Actual.Longitud + ' N, </div>';
                    google.maps.event.addListener(marker, 'click', function () {
                        infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                        infoWindow.open($scope.map, marker);
                    });
                    $scope.markers.push(marker);
                }
                console.log($scope.markers);
            }
        }, function (error) { console.log(error); });
    }

    $scope.Obtener_Usuarios_Ruta_Entrega = function () {
        var objetoEnviar = { peticion: JSON.stringify({ ID_Ruta_Entrega: 0 }) };
        AppService_RutasEntrega.HTTPObtenerUsuariosRutaEntrega(objetoEnviar).then(function (response) {
            console.log(response);
            if (response.data.Respuesta != null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.Lista_Usuarios = respuesta.resultado;
            }
        }, function (error) { console.log(error) });
    }

    $scope.Obtener_Estados_Entrega = function () {
        var objetoEnviar = { peticion: JSON.stringify({ ID_Ruta: 0 }) };
        AppService_Estados.HTTPObtenerEstadosEntrega(objetoEnviar).then(function (response) {
            console.log(response);
            if (response.data.Respuesta != null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.Lista_Estados = respuesta.resultado;
            }
        }, function (error) { console.log(error) });
    }

    $scope.Crear_Ruta = function () {
        console.log($scope.Objeto_Ruta);
        console.log($scope.Lista_Entregas_Asignadas);
        console.log($scope.Lista_Usuarios_Asignados);

        var Cantidad_Entregas_Asignadas = 0;
        var Cantidad_Usuarios_Asignados = 0;
        var Lista_Entregas_Temporal = [];
        var Lista_Usuarios_Temporal = [];

        var jsonValidado = validarJSON($scope.Objeto_Ruta);
        if (jsonValidado === true) {
            $scope.Estado_Proceso = '100';
        }
        else {
            for (ID_Documento in $scope.Lista_Entregas_Asignadas) {
                if ($scope.Lista_Entregas_Asignadas[ID_Documento] === true) {
                    Cantidad_Entregas_Asignadas += 1;
                    var json = { FK_ID_Documento: ID_Documento };
                    Lista_Entregas_Temporal.push(json);
                }
            }

            for (ID_Usuario in $scope.Lista_Usuarios_Asignados) {
                if ($scope.Lista_Usuarios_Asignados[ID_Usuario] === true) {
                    Cantidad_Usuarios_Asignados += 1;
                    var json = { FK_ID_Usuario: ID_Usuario };
                    Lista_Usuarios_Temporal.push(json);
                }
            }

            console.log(Lista_Entregas_Temporal);
            console.log(Lista_Usuarios_Temporal);

            if (Cantidad_Entregas_Asignadas > 0) {
                if (Cantidad_Usuarios_Asignados > 0) {
                    $scope.Objeto_Ruta.Lista_Entregas_Asignadas = JSON.stringify(Lista_Entregas_Temporal);
                    $scope.Objeto_Ruta.Lista_Usuarios_Asignados = JSON.stringify(Lista_Usuarios_Temporal);
                    var Objeto_Enviar = { peticion: JSON.stringify($scope.Objeto_Ruta) };
                    console.log(Objeto_Enviar);
                    AppService_RutasEntrega.HTTPProcesosRutasEntrega(Objeto_Enviar).then(function (response) {
                        console.log(response);
                        $scope.Estado_Proceso = response.data.Respuesta;
                        if ($scope.Estado_Proceso === "200") {
                            $timeout(function () {
                                $scope.Estado_Proceso = 0;
                                $state.go('dashboard.vistaEntregas');
                            }, 3000);
                        }
                    }, function (error) { console.log(error); });
                }
                else {
                    $scope.Estado_Proceso = '400';
                }
            }
            else {
                $scope.Estado_Proceso = '300';
            }
        }

    }

    angular.element(document).ready(function () {
        $scope.Obtener_Rutas_Empresa();
        $scope.Obtener_Usuarios_Ruta_Entrega();
        $scope.Obtener_Estados_Entrega();
    });


});

app.controller('EditarEntregaCtrl', function ($scope, 
    $state, 
    $filter, 
    $stateParams, 
    $timeout, 
    AppService_Rutas,
    AppService_RutasEntrega,
    AppService_Estados) {

    $scope.ID_Ruta_Entrega = $stateParams.ID_Ruta_Entrega;
    console.log($scope.ID_Ruta_Entrega);
    $scope.Objeto_Ruta = {};
    //Nombre_Ruta: "", Codigo_Ruta: "", ID_Empresa: objetoSesion.ID_Empresa, FK_ID_Ruta: null, Accion: 'a', FK_ID_Estado: null
    $scope.Objeto_Filtro = { Filtro_Usuario: "", Filtro_Entrega: "" };
    $scope.Lista_Rutas = [];
    $scope.Lista_Clientes = [];
    $scope.Lista_Entregas = [];
    $scope.Lista_Clientes_Seleccionados = [];
    $scope.Lista_Usuarios = [];
    $scope.Lista_Estados = [];
    $scope.Lista_Usuarios_Asignados = {};
    $scope.Lista_Entregas_Asignadas = {};

    $scope.Estado_Proceso = 0;

    $scope.Deshabilitar_Seleccion = false;
    $scope.Deshabilitar_Seleccion_Estado = false;

    /*Variables de paginacion para Documentos de entrega*/
    $scope.Pagina_Actual_Entregas = 0;
    $scope.Cantidad_Items_Entregas = 10;

    /*Variables de paginacion para Usuarios*/
    $scope.Pagina_Actual_Usuarios = 0;
    $scope.Cantidad_Items_Usuarios = 10;

    /*Creacion del Mapa*/
    $scope.markers = [];
    $scope.listaMarcadores = [];
    $scope.figura = null;
    var infoWindow = new google.maps.InfoWindow();
    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(9.927496, -84.091030),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    $scope.drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['circle', 'polygon', 'rectangle']
        },
        circleOptions: {
            fillColor: '#898989',
            fillOpacity: 0.5,
            strokeWeight: 1,
            clickable: false,
            editable: true
        }
    });

    /*Eventos sobre el mapa*/
    google.maps.event.addListener($scope.drawingManager, 'circlecomplete', function (circle) {
        console.log('Se creo un circulo');
        $scope.figura = circle;
        $scope.Obtener_Documentos_Entrega_Clientes_Seleccionados();
    });
    google.maps.event.addListener($scope.drawingManager, 'polygoncomplete', function (polygon) {
        console.log('Se creo un poligono');
        $scope.figura = polygon;
        $scope.Obtener_Documentos_Entrega_Clientes_Seleccionados();
    });
    google.maps.event.addListener($scope.drawingManager, 'rectanglecomplete', function (rectangle) {
        console.log('Se creo un rectangulo');
        $scope.figura = rectangle;
        $scope.Obtener_Documentos_Entrega_Clientes_Seleccionados();
    });

    $scope.drawingManager.setMap($scope.map);

    $scope.openInfoWindow = function (e, selectedMarker) {
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }

    var figuraContiene = function (figura, latLng) {
        console.log(figura);
        console.log(latLng);
        if (figura instanceof google.maps.Circle) {
            return figura.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(figura.getCenter(), latLng) <= figura.getRadius();
        }
        else if (figura instanceof google.maps.Rectangle) {
            return figura.getBounds().contains(latLng);
        }
        else if (figura instanceof google.maps.Polygon) {
            //return figura.getBounds().contains(latLng);
            return google.maps.geometry.poly.containsLocation(latLng, figura);
        }
        else {
            throw new Error('Contains no es soportado en la figura')
        }
    }

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.FiltrarEntidadUsuarios = function () { return $filter('filter')($scope.Lista_Usuarios, $scope.Objeto_Filtro.Filtro_Usuario); }

    $scope.FiltrarEntidadEntregas = function () { return $filter('filter')($scope.Lista_Entregas, $scope.Objeto_Filtro.Filtro_Entrega); }

    $scope.CalcularPaginacionUsuarios = function () { return Math.ceil($scope.FiltrarEntidadUsuarios().length / $scope.Cantidad_Items_Usuarios); }

    $scope.CalcularPaginacionEntregas = function () { return Math.ceil($scope.FiltrarEntidadEntregas().length / $scope.Cantidad_Items_Entregas); }

    $scope.Obtener_Informacion_Ruta_Entrega = function () {
        var objetoEnviar = { peticion: JSON.stringify({ ID_Ruta_Entrega: $scope.ID_Ruta_Entrega }) };
        AppService_RutasEntrega.HTTPInfoRutaEntregaID(objetoEnviar).then(function (response) {
            console.log(response);
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.Objeto_Ruta = respuesta.resultado[0];
                console.log($scope.Objeto_Ruta);
                if ($scope.Objeto_Ruta.FK_ID_Estado === 1) {
                    $scope.Deshabilitar_Seleccion = false;
                }
                else {
                    $scope.Deshabilitar_Seleccion = true;
                }

                if ($scope.Objeto_Ruta.FK_ID_Estado === 1 || $scope.Objeto_Ruta.FK_ID_Estado === 2) {
                    $scope.Deshabilitar_Seleccion_Estado = false;
                }
                else {
                    $scope.Deshabilitar_Seleccion_Estado = true;
                }
            }
        }, function (error) { console.log(error); });
    }

    $scope.Obtener_Documentos_Entrega_Ruta_Seleccionada = function () {
        var objetoEnviar = { peticion: JSON.stringify({ ID_Ruta_Entrega: $scope.ID_Ruta_Entrega }) };
        AppService_RutasEntrega.HTTPObtenerDocumentosRutaEntregaID(objetoEnviar).then(function (response) {
            console.log(response);
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.Lista_Entregas = respuesta.resultado;
                console.log($scope.Lista_Entregas);
                var Entrega_Actual = null;
                var Cliente_Encontrado = false;
                var Lista_Temporal = [];
                for (var i = 0; i < $scope.Lista_Entregas.length; i++) {
                    Entrega_Actual = $scope.Lista_Entregas[i];
                    Cliente_Encontrado = false;
                    $scope.Lista_Entregas_Asignadas[$scope.Lista_Entregas[i].ID_Documento] = true;

                    for (var j = 0; j < Lista_Temporal.length; j++) {
                        if (Entrega_Actual.Latitud === Lista_Temporal[j].Latitud && Entrega_Actual.Longitud === Lista_Temporal[j].Longitud) {
                            console.log('Si lo encontre');
                            Cliente_Encontrado = true;
                            break;
                        }
                    }

                    if (Cliente_Encontrado === false) {
                        console.log('Hola');
                        var marker = new google.maps.Marker({
                            map: $scope.map,
                            position: new google.maps.LatLng(Entrega_Actual.Latitud, Entrega_Actual.Longitud),
                            title: Entrega_Actual.Nombre_Cliente
                        });
                        marker.content = '<div class="infoWindowContent">' + Entrega_Actual.Nombre_Fantasia + '<br />' + Entrega_Actual.Latitud + ' E,' + Entrega_Actual.Longitud + ' N, </div>';
                        google.maps.event.addListener(marker, 'click', function () {
                            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                            infoWindow.open($scope.map, marker);
                        });
                        $scope.markers.push(marker);
                        Lista_Temporal.push(Entrega_Actual);
                    }
                }
            }
        }, function (error) { console.log(error); });
    }

    $scope.Obtener_Documentos_Entrega_Clientes_Seleccionados = function () {
        var Seleccion_Incluye_Clientes = false;
        var Lista_Clientes_Length = $scope.Lista_Clientes.length;
        var Cliente_Actual = null;
        for (var i = 0; i < Lista_Clientes_Length; i++) {
            Cliente_Actual = $scope.Lista_Clientes[i];
            var latLng = new google.maps.LatLng(Cliente_Actual.Latitud, Cliente_Actual.Longitud);
            if (figuraContiene($scope.figura, latLng)) {
                Seleccion_Incluye_Clientes = true;
                console.log('El cliente ' + Cliente_Actual.Nombre_Cliente + ' si esta dentro de la figura seleccionada');
                var json = { FK_ID_Cliente: Cliente_Actual.ID_Cliente };
                $scope.Lista_Clientes_Seleccionados.push(json);
            }
        }

        if (Seleccion_Incluye_Clientes === true) {
            var Objeto_Enviar = { peticion: JSON.stringify({ Lista_Clientes_Seleccionados: JSON.stringify($scope.Lista_Clientes_Seleccionados) }) };
            AppService_RutasEntrega.HTTPObtenerDocumentosEntrega(Objeto_Enviar).then(function (response) {
                if (response.data.Respuesta != null) {
                    var respuesta = JSON.parse(response.data.Respuesta);
                    for (var i = 0; i < respuesta.resultado.length; i++) {
                        $scope.Lista_Entregas.push(respuesta.resultado[i]);
                    }
                    $scope.Lista_Clientes_Seleccionados = [];
                }
            }, function (error) { console.log(error) });
        }
        else {
            $scope.Lista_Clientes_Seleccionados = [];
        }
    }

    $scope.Eliminar = function () {
        $scope.figura.setMap(null);
    }

    $scope.Obtener_Rutas_Empresa = function () {
        var objetoEnviar = { peticion: JSON.stringify({ ID_Empresa: objetoSesion.ID_Empresa, Filtro_Rutas: '' }) };
        AppService_Rutas.HTTPObtenerRutas(objetoEnviar).then(function (response) {
            if (response.data.Respuesta != null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.Lista_Rutas = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    $scope.Obtener_Clientes_Ruta_Entregas = function () {
        var objetoEnviar = { peticion: JSON.stringify({ ID_Empresa: objetoSesion.ID_Empresa, ID_Ruta: $scope.Objeto_Ruta.FK_ID_Ruta }) };
        AppService_RutasEntrega.HTTPClientesRutaEntregaID(objetoEnviar).then(function (response) {
            if (response.data.Respuesta != null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.Lista_Clientes = respuesta.resultado;
                var Lista_Clientes_Length = $scope.Lista_Clientes.length;
                var Cliente_Actual = null;
                for (var i = 0; i < Lista_Clientes_Length; i++) {
                    Cliente_Actual = $scope.Lista_Clientes[i];
                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        position: new google.maps.LatLng(Cliente_Actual.Latitud, Cliente_Actual.Longitud),
                        title: Cliente_Actual.Nombre_Cliente
                    });
                    marker.content = '<div class="infoWindowContent">' + Cliente_Actual.Nombre_Fantasia + '<br />' + Cliente_Actual.Latitud + ' E,' + Cliente_Actual.Longitud + ' N, </div>';
                    google.maps.event.addListener(marker, 'click', function () {
                        infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                        infoWindow.open($scope.map, marker);
                    });
                    $scope.markers.push(marker);
                }
            }
        }, function (error) { console.log(error); });
    }

    $scope.Obtener_Usuarios_Ruta_Entrega = function () {
        var objetoEnviar = { peticion: JSON.stringify({ ID_Ruta_Entrega: $scope.ID_Ruta_Entrega }) };
        AppService_RutasEntrega.HTTPObtenerUsuariosRutaEntrega(objetoEnviar).then(function (response) {
            if (response.data.Respuesta != null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.Lista_Usuarios = respuesta.resultado;
                for (var i = 0; i < $scope.Lista_Usuarios.length; i++) {
                    if ($scope.Lista_Usuarios[i].Seleccionado === 1) {
                        $scope.Lista_Usuarios_Asignados[$scope.Lista_Usuarios[i].ID_Usuario] = true;
                    }
                    else {
                        $scope.Lista_Usuarios_Asignados[$scope.Lista_Usuarios[i].ID_Usuario] = false;
                    }
                }
            }
        }, function (error) { console.log(error) });
    }

    $scope.Obtener_Estados_Entrega = function () {
        var objetoEnviar = { peticion: JSON.stringify({ ID_Ruta: 0 }) };
        AppService_Estados.HTTPObtenerEstadosEntrega(objetoEnviar).then(function (response) {
            if (response.data.Respuesta != null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.Lista_Estados = respuesta.resultado;
            }
        }, function (error) { console.log(error) });
    }

    $scope.Crear_Ruta = function () {
        var Cantidad_Entregas_Asignadas = 0;
        var Cantidad_Usuarios_Asignados = 0;
        var Lista_Entregas_Temporal = [];
        var Lista_Usuarios_Temporal = [];

        var jsonValidado = validarJSON($scope.Objeto_Ruta);
        if (jsonValidado === true) {
            $scope.Estado_Proceso = '100';
        }
        else {
            for (ID_Documento in $scope.Lista_Entregas_Asignadas) {
                if ($scope.Lista_Entregas_Asignadas[ID_Documento] === true) {
                    Cantidad_Entregas_Asignadas += 1;
                    var json = { FK_ID_Documento: ID_Documento };
                    Lista_Entregas_Temporal.push(json);
                }
            }

            for (ID_Usuario in $scope.Lista_Usuarios_Asignados) {
                if ($scope.Lista_Usuarios_Asignados[ID_Usuario] === true) {
                    Cantidad_Usuarios_Asignados += 1;
                    var json = { FK_ID_Usuario: ID_Usuario };
                    Lista_Usuarios_Temporal.push(json);
                }
            }

            if (Cantidad_Entregas_Asignadas > 0) {
                if (Cantidad_Usuarios_Asignados > 0) {
                    $scope.Objeto_Ruta.Lista_Entregas_Asignadas = JSON.stringify(Lista_Entregas_Temporal);
                    $scope.Objeto_Ruta.Lista_Usuarios_Asignados = JSON.stringify(Lista_Usuarios_Temporal);
                    var Objeto_Enviar = { peticion: JSON.stringify($scope.Objeto_Ruta) };
                    AppService_RutasEntrega.HTTPProcesosRutasEntrega(Objeto_Enviar).then(function (response) {
                        $scope.Estado_Proceso = response.data.Respuesta;
                        if ($scope.Estado_Proceso === "200") {
                            $timeout(function () {
                                $scope.Estado_Proceso = 0;
                                $state.go('dashboard.vistaEntregas');
                            }, 3000);
                        }
                    }, function (error) { console.log(error); });
                }
                else {
                    $scope.Estado_Proceso = '400';
                }
            }
            else {
                $scope.Estado_Proceso = '300';
            }
        }
    }

    angular.element(document).ready(function () {
        $scope.Obtener_Informacion_Ruta_Entrega();
        $scope.Obtener_Rutas_Empresa();
        $scope.Obtener_Usuarios_Ruta_Entrega();
        $scope.Obtener_Estados_Entrega();
        $scope.Obtener_Documentos_Entrega_Ruta_Seleccionada();
    });

});