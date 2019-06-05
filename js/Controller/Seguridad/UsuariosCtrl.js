app.controller('UsuariosCtrl', function ($scope, 
    $state, 
    $timeout, 
    $filter, 
    AppService_Usuarios) {

    $scope.listaUsuarios = [];
    $scope.objetoUsuario = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Usuario: "" };

    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    $scope.FiltrarEntidad = function () { return $filter('filter')($scope.listaUsuarios, $scope.objetoUsuario.Filtro_Usuario); }

    $scope.CalcularPaginacion = function () { return Math.ceil($scope.FiltrarEntidad().length / $scope.Cantidad_Items); }

    $scope.editarUsuario = function (ID_Usuario) { $state.go('dashboard.editarUsuario', { ID_Usuario: ID_Usuario }); }

    $scope.Ir_A_Crear_Usuario = function () { $state.go('dashboard.registrarNuevoUsuario'); }

    $scope.obtenerUsuarios = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoUsuario) };
        AppService_Usuarios.HTTPObtenerUsuarios(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaUsuarios = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    angular.element(document).ready(function () { $scope.obtenerUsuarios(); });
});

app.controller('EditarUsuarioCtrl', function ($scope, 
    $state, 
    $timeout, 
    $stateParams, 
    AppService_Roles,
    AppService_Usuarios) {

    $scope.ID_Usuario = $stateParams.ID_Usuario;
    $scope.Lista_Roles = [];

    $scope.Objeto_Usuario = {};
    $scope.Estado_Proceso = 0;
    $scope.Tipo_Input = 'password';
    $scope.Mostrar_Ocultar_Pass = { Valor: false };

    $scope.Obtener_Informacion_Usuario = function () {
        var objetoEnviar = { peticion: JSON.stringify({ ID_Usuario: $scope.ID_Usuario }) };
        AppService_Usuarios.HTTPObtenerUsuarioID(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.Objeto_Usuario = respuesta.resultado[0];
                $scope.Objeto_Usuario.Accion = 'a';
                console.log($scope.Objeto_Usuario);
            }
        }, function (error) { console.log(error); });
    }

    $scope.Obtener_Roles = function () {
        var objetoEnviar = { peticion: JSON.stringify({ ID_Empresa: objetoSesion.ID_Empresa, ID_Rol: null }) };
        AppService_Roles.HTTPObtenerRoles(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.Lista_Roles = respuesta.resultado;
                console.log($scope.Lista_Roles);
            }
        }, function (error) { console.log(error); });
    }

    $scope.Funcionalidad_Checkbox = function () { if ($scope.Tipo_Input === 'password') { $scope.Tipo_Input = 'text' } else { $scope.Tipo_Input = 'password'; } }

    $scope.Actualizar_Usuario = function () {
        console.log($scope.Objeto_Usuario);
        var objetoEnviar = { peticion: JSON.stringify($scope.Objeto_Usuario) };
        AppService_Usuarios.HTTPProcesosUsuarios(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.Estado_Proceso = respuesta;
                console.log($scope.Estado_Proceso);
                if ($scope.Estado_Proceso === 200) { $timeout(function () { $state.go('dashboard.vistaUsuarios') }, 2000); }
            }
        }, function (error) { console.log(error); });
    }

    angular.element(document).ready(function () { $scope.Obtener_Informacion_Usuario(); $scope.Obtener_Roles(); });

});

app.controller('RegistrarNuevoUsuarioCtrl', function ($scope, 
    $state, 
    $timeout, 
    AppService_Roles,
    AppService_Usuarios) {

    $scope.Lista_Roles = [];

    $scope.Objeto_Usuario = { Accion: 'i', Nombre: null, Apellidos: null, Nombre_Usuario: null, Telefono: null, Correo: null, Contrasena: null, FK_ID_Rol: null };
    $scope.Estado_Proceso = 0;
    $scope.Tipo_Input = 'password';
    $scope.Mostrar_Ocultar_Pass = { Valor: false };

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.Obtener_Roles = function () {
        var objetoEnviar = { peticion: JSON.stringify({ ID_Empresa: objetoSesion.ID_Empresa, ID_Rol: null }) };
        AppService_Roles.HTTPObtenerRoles(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.Lista_Roles = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    $scope.Funcionalidad_Checkbox = function () { if ($scope.Tipo_Input === 'password') { $scope.Tipo_Input = 'text' } else { $scope.Tipo_Input = 'password'; } }

    $scope.Crear_Usuario = function () {
        var Resultado_Validacion = validarJSON($scope.Objeto_Usuario);
        if (Resultado_Validacion) { $scope.Estado_Proceso = '100'; }
        else {
            var objetoEnviar = { peticion: JSON.stringify($scope.Objeto_Usuario) };
            AppService_Usuarios.HTTPProcesosUsuarios(objetoEnviar).then(function (response) {
                if (response.data.Respuesta !== null) {
                    var respuesta = JSON.parse(response.data.Respuesta);
                    $scope.Estado_Proceso = respuesta;
                    if ($scope.Estado_Proceso === 200) { $timeout(function () { $state.go('dashboard.vistaUsuarios') }, 2000); }
                }
            }, function (error) { console.log(error); });
        }
    }

    angular.element(document).ready(function () { $scope.Obtener_Roles(); });

});