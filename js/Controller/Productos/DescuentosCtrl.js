app.controller('DescuentosCtrl', function ($scope, 
    $state, 
    $filter,  
    AppService_Descuentos) {

    $scope.listaDescuentos = [];
    $scope.objetoDescuento = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Descuento: "" };

    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    $scope.Filtrar_Entidad = function () { return $filter('filter')($scope.listaDescuentos, $scope.objetoDescuento.Filtro_Descuento); }
    $scope.Calcular_Paginacion = function () { return Math.ceil($scope.Filtrar_Entidad().length / $scope.Cantidad_Items); }

    $scope.obtenerDescuentos = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoDescuento) };
        AppService_Descuentos.HTTPObtenerDescuentos(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaDescuentos = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    angular.element(document).ready(function () { $scope.obtenerDescuentos(); });

});

app.controller('EditarDescuentoCtrl', function ($scope, 
    $state,
    $timeout, 
    $stateParams, 
    $filter,  
    AppService_Clientes, 
    AppService_Descuentos,
    AppService_Categorias) {

    $scope.ID_Descuento = $stateParams.ID_Descuento;
    console.log($scope.ID_Descuento);
    console.log(objetoSesion);
    $scope.objetoDescuento = { ID_Empresa: objetoSesion.ID_Empresa };
    console.log($scope.objetoDescuento);
    $scope.listaCategoriasCliente = [];
    $scope.listaCategoriasProductos = [];
    $scope.FK_ID_Familia_Cliente = 0;
    $scope.FK_ID_Categoria_Producto = 0;

    $scope.infoDescuento = null;

    $scope.statusProceso = 0;

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.obtenerInformacionDescuento = function () {
        var objetoEnviar = {
            peticion: JSON.stringify({ ID_Descuento: $scope.ID_Descuento })
        };
        AppService_Descuentos.HTTPObtenerInfoDescuento(objetoEnviar).then(function (response) {
            console.log(response);
            var res = JSON.parse(response.data.Respuesta);
            $scope.infoDescuento = res.resultado[0];
            var Fecha_Inicio_Filtrada = new Date($scope.infoDescuento.Fecha_Inicio);
            var Fecha_Final_Filtrada = new Date($scope.infoDescuento.Fecha_Finalizacion);
            $scope.infoDescuento.Fecha_Inicio = Fecha_Inicio_Filtrada;
            $scope.infoDescuento.Fecha_Finalizacion = Fecha_Final_Filtrada;
            console.log($scope.infoDescuento);
            $scope.FK_ID_Familia_Cliente = $scope.infoDescuento.FK_ID_Familia_Cliente;
            $scope.FK_ID_Categoria_Producto = $scope.infoDescuento.FK_ID_Categoria_Producto;
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerCategoriasClientes = function () {
        AppService_Clientes.HTTPObtenerCategoriasCliente().then(function (response) {
            console.log(response);
            //$scope.listaCategoriasCliente = JSON.parse(response.data.Respuesta);
            console.log(response.data.Respuesta);
            var json = JSON.parse(response.data.Respuesta);
            console.log(json);
            console.log(json.resultado);
            $scope.listaCategoriasCliente = json.resultado;
            console.log($scope.listaCategoriasCliente);
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerCategoriasProductos = function () {
        AppService_Categorias.HTTPObtenerCategoriasProductos().then(function (response) {
            console.log(response);
            //$scope.listaCategoriasCliente = JSON.parse(response.data.Respuesta);
            console.log(response.data.Respuesta);
            var json = JSON.parse(response.data.Respuesta);
            console.log(json);
            console.log(json.resultado);
            $scope.listaCategoriasProductos = json.resultado;
            console.log($scope.listaCategoriasProductos);
        }, function (error) {
            console.log(error);
        });
    }

    $scope.guardarDescuento = function () {
        console.log($scope.infoDescuento);
        var jsonValidado = validarJSON($scope.infoDescuento);
        if (jsonValidado === true) {
            //espacios en blanco
            console.log('JSON incorrecto');
            console.log($scope.infoDescuento);
            $scope.statusProceso = 100;
        }
        else {
            if ($scope.infoDescuento.Fecha_Inicio < $scope.infoDescuento.Fecha_Finalizacion) {
                $scope.infoDescuento.Accion = 'a';
                var Fecha_Inicio_Final = $filter('date')($scope.infoDescuento.Fecha_Inicio, "yyyy-MM-dd HH:mm:ss");
                var Fecha_Finalizacion_Final = $filter('date')($scope.infoDescuento.Fecha_Finalizacion, "yyyy-MM-dd HH:mm:ss");
                $scope.infoDescuento.Fecha_Inicio = Fecha_Inicio_Final;
                $scope.infoDescuento.Fecha_Finalizacion = Fecha_Finalizacion_Final;
                console.log($scope.infoDescuento);
                var objetoEnviar = {
                    peticion: JSON.stringify($scope.infoDescuento)
                };
                AppService_Descuentos.HTTPProcesosDescuentos(objetoEnviar).then(function (response) {
                    console.log(response);
                    $scope.statusProceso = response.data.Respuesta;
                    if ($scope.statusProceso === "200") {
                        $timeout(function () {
                            $scope.statusProceso = 0;
                        }, 3000);
                    }
                }, function (error) {
                    console.log(error);
                });
            }
            else {
                $scope.statusProceso = 300;
            }
        }
    }

    angular.element(document).ready(function () {
        $scope.obtenerInformacionDescuento();
        $scope.obtenerCategoriasClientes();
        $scope.obtenerCategoriasProductos();
    });

});

app.controller('RegistrarNuevoDescuentoCtrl', function ($scope, 
    $state, 
    $timeout, 
    $filter,  
    AppService_Clientes, 
    AppService_Descuentos,
    AppService_Categorias) {

    console.log('cargando controlador registro de descuento');

    $scope.listaCategoriasCliente = [];
    $scope.listaCategoriasProductos = [];
    console.log(objetoSesion);
    $scope.objetoDescuento = { ID_Empresa: objetoSesion.ID_Empresa };
    console.log($scope.objetoDescuento);

    $scope.nuevoDescuento = {
        Nombre_Descuento: "",
        Descripcion: "",
        Valor_Descuento: "",
        Fecha_Inicio: "",
        Fecha_Finalizacion: "",
        Automatico: false,
        FK_ID_Empresa: $scope.objetoDescuento.ID_Empresa,
        FK_ID_Categoria_Descuento: 1,
        Eliminado: false,
        FK_ID_Familia_Cliente: "",
        FK_ID_Categoria_Producto: ""
    };

    $scope.statusProceso = 0;

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.obtenerCategoriasClientes = function () {
        AppService_Clientes.HTTPObtenerCategoriasCliente().then(function (response) {
            console.log(response);
            //$scope.listaCategoriasCliente = JSON.parse(response.data.Respuesta);
            console.log(response.data.Respuesta);
            var json = JSON.parse(response.data.Respuesta);
            console.log(json);
            console.log(json.resultado);
            $scope.listaCategoriasCliente = json.resultado;
            console.log($scope.listaCategoriasCliente);
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerCategoriasProductos = function () {
        AppService_Categorias.HTTPObtenerCategoriasProductos().then(function (response) {
            console.log(response);
            //$scope.listaCategoriasCliente = JSON.parse(response.data.Respuesta);
            console.log(response.data.Respuesta);
            var json = JSON.parse(response.data.Respuesta);
            console.log(json);
            console.log(json.resultado);
            $scope.listaCategoriasProductos = json.resultado;
            console.log($scope.listaCategoriasProductos);
        }, function (error) {
            console.log(error);
        });
    }

    $scope.guardarDescuento = function () {
        console.log($scope.nuevoDescuento);
        var jsonValidado = validarJSON($scope.nuevoDescuento);
        if (jsonValidado === true) {
            //espacios en blanco
            console.log('JSON incorrecto');
            console.log($scope.nuevoDescuento);
            $scope.statusProceso = 100;
        }
        else {
            if ($scope.nuevoDescuento.Fecha_Inicio < $scope.nuevoDescuento.Fecha_Finalizacion) {
                $scope.nuevoDescuento.Accion = 'i';
                var Fecha_Inicio_Final = $filter('date')($scope.nuevoDescuento.Fecha_Inicio, "yyyy-MM-dd HH:mm:ss");
                var Fecha_Finalizacion_Final = $filter('date')($scope.nuevoDescuento.Fecha_Finalizacion, "yyyy-MM-dd HH:mm:ss");
                $scope.nuevoDescuento.Fecha_Inicio = Fecha_Inicio_Final;
                $scope.nuevoDescuento.Fecha_Finalizacion = Fecha_Finalizacion_Final;
                console.log($scope.nuevoDescuento);
                var objetoEnviar = {
                    peticion: JSON.stringify($scope.nuevoDescuento)
                };
                AppService_Descuentos.HTTPProcesosDescuentos(objetoEnviar).then(function (response) {
                    console.log(response);
                    $scope.statusProceso = response.data.Respuesta;
                    if ($scope.statusProceso === "200") {
                        $timeout(function () {
                            $scope.nuevoDescuento = {
                                Nombre_Descuento: "", Descripcion: "", Valor_Descuento: "", Fecha_Inicio: "", Fecha_Finalizacion: "",
                                Automatico: false, FK_ID_Empresa: $scope.objetoDescuento.ID_Empresa, FK_ID_Categoria_Descuento: 1, Eliminado: false,
                                FK_ID_Familia_Cliente: "", FK_ID_Categoria_Producto: ""
                            };
                            $scope.statusProceso = 0;
                        }, 3000);
                    }
                }, function (error) {
                    console.log(error);
                });
            }
            else {
                $scope.statusProceso = 300;
            }
        }
    }

    angular.element(document).ready(function () {
        $scope.obtenerCategoriasClientes();
        $scope.obtenerCategoriasProductos();
    });

});