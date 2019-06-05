app.controller('RolesCtrl', function ($scope, 
    $state, 
    $filter, 
    AppService_Roles) {

    $scope.listaRoles = [];
    $scope.objetoRol = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Rol: "", ID_Rol: null };

    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    $scope.FiltrarEntidad = function () { return $filter('filter')($scope.listaRoles, $scope.objetoRol.Filtro_Rol); }
    $scope.CalcularPaginacion = function () { return Math.ceil($scope.FiltrarEntidad().length / $scope.Cantidad_Items); }

    $scope.obtenerRoles = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoRol) };
        AppService_Roles.HTTPObtenerRoles(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaRoles = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    $scope.irANuevoRol = function () { $state.go('dashboard.registrarNuevoRol'); }
    $scope.editarRol = function (ID_Rol_Seleccionado) { $state.go('dashboard.editarRol', { ID_Rol: ID_Rol_Seleccionado }); }

    angular.element(document).ready(function () { $scope.obtenerRoles(); });

});

app.controller('EditarRolCtrl', function ($scope, 
    $state, 
    $stateParams, 
    AppService_Roles) {

    $scope.ID_Rol = $stateParams.ID_Rol;
    $scope.Objeto_Rol = {};

    $scope.Obtener_Informacion_Rol = function () {
        var objetoEnviar = { peticion: JSON.stringify({ ID_Empresa: objetoSesion.ID_Empresa, ID_Rol: $scope.ID_Rol }) };
        AppService_Roles.HTTPObtenerRoles(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.Objeto_Rol = respuesta.resultado[0];
                console.log($scope.Objeto_Rol);
            }
        }, function (error) { console.log(error); });
    }

    angular.element(document).ready(function () { $scope.Obtener_Informacion_Rol(); });

});

app.controller('RegistrarNuevoRolCtrl', function ($scope, 
    $state, 
    $timeout, 
    AppService_Roles,
    AppService_Permisos) {
    console.log('cargando controlador registro de rol');

    $scope.listaPermisos = [];
    console.log(objetoSesion);
    $scope.objetoRol = { ID_Empresa: objetoSesion.ID_Empresa };
    console.log($scope.objetoRol);
    var Lista_Permisos_Rol = [];

    $scope.nuevoRol = {
        Nombre_Rol: "",
        FK_ID_Empresa: $scope.objetoRol.ID_Empresa,
        Eliminado: 0,
        Accion: 'i'
    };

    $scope.statusProceso = 0;

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.obtenerPermisos = function () {
        AppService_Permisos.HTTPObtenerPermisos().then(function (response) {
            console.log(response);
            if (response.data.Respuesta === null) {
                console.log('Permisos NULL');
            }
            else {
                var respuesta = JSON.parse(response.data.Respuesta);
                console.log(respuesta.resultado.length);
                $scope.listaPermisos = respuesta.resultado;
                var total = $scope.listaPermisos.length;
                console.log($scope.listaPermisos);
                console.log('Total items: ' + total);
            }

        }, function (error) {
            console.log(error);
        });
    }

    $scope.agregarRol = function () {
        Lista_Permisos_Rol = [];
        var cantidadPermisos = 0;
        var jsonValidado = validarJSON($scope.nuevoRol);
        for (var i = 0; i < $scope.listaPermisos.length; i++) {
            var permisoActual = $scope.listaPermisos[i].Nombre_Permiso;
            console.log(permisoActual + ': ' + document.getElementById(permisoActual).checked);
            if (document.getElementById(permisoActual).checked === true) {
                console.log('Si estaba marcado');
                cantidadPermisos = cantidadPermisos + 1;
                var json = {
                    FK_ID_Permiso: $scope.listaPermisos[i].ID_Permiso
                };
                Lista_Permisos_Rol.push(json);
            }
            else {
                console.log('No estaba marcado');
            }
        }
        console.log('Cantidad permisos: ' + cantidadPermisos);
        console.log('Lista permisos: ');
        console.log(Lista_Permisos_Rol);
        if (cantidadPermisos === 0) {
            console.log('Debe agregar al menos un permiso al rol');
            $scope.statusProceso = 300;
        }
        else {
            if (jsonValidado === true) {
                //espacios en blanco
                console.log('JSON incorrecto');
                console.log($scope.nuevoRol);
                $scope.statusProceso = 100;
            }
            else {
                $scope.nuevoRol.Lista_Permisos = JSON.stringify(Lista_Permisos_Rol);
                var objetoEnviar = {
                    peticion: JSON.stringify($scope.nuevoRol)
                };
                console.log(objetoEnviar);
                AppService_Roles.HTTPProcesosRoles(objetoEnviar).then(function (response) {
                    console.log(response);
                    $scope.statusProceso = response.data.Respuesta;
                    if ($scope.statusProceso === "200") {
                        $scope.nuevoRol = { Nombre_Rol: "", FK_ID_Empresa: $scope.objetoRol.ID_Empresa, Eliminado: 0, Accion: 'i' };
                        for (var i = 0; i < $scope.listaPermisos.length; i++) {
                            var permisoActual = $scope.listaPermisos[i].Nombre_Permiso;
                            console.log(permisoActual + ': ' + document.getElementById(permisoActual).checked);
                            document.getElementById(permisoActual).checked = false;
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
    }

    angular.element(document).ready(function () {
        $scope.obtenerPermisos();
    });

});