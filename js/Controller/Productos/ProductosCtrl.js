app.controller('ProductosCtrl', function ($scope, 
    $state, 
    $filter, 
    AppService_Productos) {

    $scope.listaProductos = [];
    $scope.objetoProducto = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Producto: null };

    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    $scope.Calcular_Paginacion = function () { return Math.ceil($scope.listaProductos.length / $scope.Cantidad_Items); }

    $scope.obtenerProductosInicio = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoProducto) };
        AppService_Productos.HTTPObtenerProductos(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaProductos = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    $scope.obtenerProductos = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoProducto) };
        AppService_Productos.HTTPObtenerProductosFiltro(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaProductos = respuesta.resultado;
                $scope.totalItems = $scope.listaProductos.length;
            }
        }, function (error) { console.log(error); });
    }

    $scope.buscarProductosEnter = function (keyEvent) { if (keyEvent.which === 13) { $scope.obtenerProductos(); } }

    angular.element(document).ready(function () { $scope.obtenerProductosInicio(); });

});

app.controller('RegistrarNuevoProductoCtrl', function ($scope, 
    $timeout, 
    AppService_Impuestos,
    AppService_Productos){

    console.log('cargando controlador registro de producto');
    $scope.listaImpuestos = [];
    var listaImpuestosSeleccionados = [];
    console.log(objetoSesion);
    $scope.objetoProducto = { ID_Empresa: objetoSesion.ID_Empresa };
    console.log($scope.objetoProducto);

    $scope.nuevoProducto = {
        Nombre_Producto: "",
        Codigo_Producto: "",
        Descripcion: "",
        Estado: 1,
        Exento: false,
        Puede_Devolverse: false,
        FK_ID_Empresa: $scope.objetoProducto.ID_Empresa,
        Eliminado: 0,
        Accion: 'i',
        Lista_Impuestos: []
    };

    $scope.statusProceso = 0;

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.obtenerImpuestos = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoProducto)
        };
        AppService_Impuestos.HTTPObtenerImpuestos(objetoEnviar).then(function (response) {
            if (response.data.Respuesta === null) {
                console.log('Impuestos NULL');
            }
            else {
                var respuesta = JSON.parse(response.data.Respuesta);
                console.log(respuesta.resultado.length);
                $scope.listaImpuestos = respuesta.resultado;
                var total = $scope.listaImpuestos.length;
                console.log($scope.listaImpuestos);
                console.log('Total items: ' + total);
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.agregarProducto = function () {
        console.log($scope.nuevoProducto);
        var jsonValidado = validarJSON($scope.nuevoProducto);
        if (jsonValidado === true) {
            //espacios en blanco
            console.log('JSON incorrecto');
            console.log($scope.nuevoProducto);
            $scope.statusProceso = 100;
        }
        else {
            if ($scope.nuevoProducto.Exento === true) {
                $scope.nuevoProducto.Exento = 1;
            }
            else {
                $scope.nuevoProducto.Exento = 0;
            }
            if ($scope.nuevoProducto.Puede_Devolverse === true) {
                $scope.nuevoProducto.Puede_Devolverse = 1;
            }
            else {
                $scope.nuevoProducto.Puede_Devolverse = 0;
            }

            var tamannoListaImpuestos = $scope.listaImpuestos.length;
            var impuestoActual = null;
            for (var i = 0; i < tamannoListaImpuestos; i++) {
                console.log($scope.listaImpuestos[i].Nombre_Impuesto);
                impuestoActual = $scope.listaImpuestos[i].Nombre_Impuesto;
                console.log(impuestoActual + ': ' + document.getElementById(impuestoActual).checked);
                if (document.getElementById(impuestoActual).checked === true) {
                    console.log('Si estaba marcado');
                    var json = {
                        FK_ID_Impuesto: $scope.listaImpuestos[i].ID_Impuesto
                    };
                    listaImpuestosSeleccionados.push(json);
                }
                else {
                    console.log('No estaba marcado');
                }
            }
            impuestoActual = null;
            console.log(listaImpuestosSeleccionados);
            $scope.nuevoProducto.Lista_Impuestos = JSON.stringify(listaImpuestosSeleccionados);
            console.log($scope.nuevoProducto);

            var objetoEnviar = {
                peticion: JSON.stringify($scope.nuevoProducto)
            };
            console.log(objetoEnviar);
            AppService_Productos.HTTPProcesosProductos(objetoEnviar).then(function (response) {
                console.log(response);
                $scope.statusProceso = response.data.Respuesta;
                if ($scope.statusProceso === "200") {
                    $scope.nuevoProducto = {
                        Nombre_Producto: "", Codigo_Producto: "", Descripcion: "", Estado: 1, Exento: false, Puede_Devolverse: false,
                        FK_ID_Empresa: $scope.objetoProducto.ID_Empresa, Eliminado: 0, Accion: 'i', Lista_Impuestos: []
                    };

                    for (var i = 0; i < tamannoListaImpuestos; i++) {
                        impuestoActual = $scope.listaImpuestos[i].Nombre_Impuesto;
                        console.log(impuestoActual + ': ' + document.getElementById(impuestoActual).checked);
                        document.getElementById(impuestoActual).checked = false;
                    }

                    $timeout(function () {
                        $scope.statusProceso = 0;
                    }, 3000);
                }
            }, function (error) {
                console.log(error);
            });
        }
    }

    angular.element(document).ready(function () {
        $scope.obtenerImpuestos();
    });

});