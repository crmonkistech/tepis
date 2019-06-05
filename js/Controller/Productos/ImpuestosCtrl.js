app.controller('ImpuestosCtrl', function ($scope, 
    $state, 
    $filter, 
    AppService_Impuestos) {

    $scope.listaImpuestos = [];
    $scope.objetoImpuesto = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Impuesto: "" };

    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    $scope.Filtrar_Entidad = function () { return $filter('filter')($scope.listaImpuestos, $scope.objetoImpuesto.Filtro_Impuesto); }
    $scope.Calcular_Paginacion = function () { return Math.ceil($scope.Filtrar_Entidad().length / $scope.Cantidad_Items); }

    $scope.obtenerImpuestos = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoImpuesto) };
        AppService_Impuestos.HTTPObtenerImpuestos(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaImpuestos = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    angular.element(document).ready(function () {
        $scope.obtenerImpuestos();
    });

});

app.controller('EditarImpuestoCtrl', function ($scope, 
    $state, 
    $timeout, 
    $stateParams, 
    AppService_Impuestos) {

    $scope.ID_Impuesto = $stateParams.ID_Impuesto;
    console.log($scope.ID_Impuesto);
    console.log(objetoSesion);
    $scope.objetoImpuesto = { ID_Empresa: objetoSesion.ID_Empresa };
    console.log($scope.objetoImpuesto);

    $scope.infoImpuesto = null;

    $scope.statusProceso = 0;

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.obtenerInformacionImpuesto = function () {
        var objetoEnviar = {
            peticion: JSON.stringify({ ID_Impuesto: $scope.ID_Impuesto })
        };
        AppService_Impuestos.HTTPObtenerInfoImpuesto(objetoEnviar).then(function (response) {
            console.log(response);
            var res = JSON.parse(response.data.Respuesta);
            $scope.infoImpuesto = res.resultado[0];
            console.log($scope.infoImpuesto);
        }, function (error) {
            console.log(error);
        });
    }

    $scope.guardarImpuesto = function () {
        console.log($scope.infoImpuesto);
        var jsonValidado = validarJSON($scope.infoImpuesto);
        if (jsonValidado === true) {
            //espacios en blanco
            console.log('JSON incorrecto');
            console.log($scope.infoImpuesto);
            $scope.statusProceso = 100;
        }
        else {
            $scope.infoImpuesto.Accion = 'a';
            console.log($scope.infoImpuesto);
            var objetoEnviar = {
                peticion: JSON.stringify($scope.infoImpuesto)
            };
            AppService_Impuestos.HTTPProcesosImpuestos(objetoEnviar).then(function (response) {
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
    }

    angular.element(document).ready(function () {
        $scope.obtenerInformacionImpuesto();
    });

});

app.controller('RegistrarNuevoImpuestoCtrl', function ($scope, 
    $state, 
    $timeout, 
    AppService_Impuestos) {

    console.log('cargando controlador registro de impuesto');

    console.log(objetoSesion);
    $scope.objetoImpuesto = { ID_Empresa: objetoSesion.ID_Empresa };
    console.log($scope.objetoImpuesto);

    $scope.nuevoImpuesto = {
        Nombre_Impuesto: "",
        Descripcion: "",
        Valor_Impuesto: "",
        FK_ID_Empresa: $scope.objetoImpuesto.ID_Empresa,
        Eliminado: 0,
        Accion: 'i'
    };

    $scope.statusProceso = 0;

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.agregarImpuesto = function () {
        console.log($scope.nuevoImpuesto);
        var jsonValidado = validarJSON($scope.nuevoImpuesto);
        if (jsonValidado === true) {
            //espacios en blanco
            console.log('JSON incorrecto');
            console.log($scope.nuevoImpuesto);
            $scope.statusProceso = 100;
        }
        else {
            var objetoEnviar = {
                peticion: JSON.stringify($scope.nuevoImpuesto)
            };
            console.log(objetoEnviar);
            AppService_Impuestos.HTTPProcesosImpuestos(objetoEnviar).then(function (response) {
                console.log(response);
                $scope.statusProceso = response.data.Respuesta;
                if ($scope.statusProceso === "200") {
                    $scope.nuevoImpuesto = {
                        Nombre_Impuesto: "", Descripcion: "", Valor_Impuesto: "", FK_ID_Empresa: $scope.objetoImpuesto.ID_Empresa,
                        Eliminado: 0, Accion: 'i'
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