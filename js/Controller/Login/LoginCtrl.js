app.controller('LoginCtrl', function ($scope, 
    $state, 
    AppServiceLG, 
    AppService_Empresas) {

    $scope.usuario = { Nombre_Usuario: "", Contrasena: "" };
    $scope.mensajeError = '';
    $scope.inicioSesion = false;

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.iniciarSesion = function () {
        $scope.mensajeError = '';
        var jsonValidado = validarJSON($scope.usuario);
        if (jsonValidado === false) {
            $scope.inicioSesion = true;
            var objetoJSON = { peticion: JSON.stringify($scope.usuario) };
            AppServiceLG.HTTPInicioSesion(objetoJSON).then(function (response) {
                var respuesta = JSON.parse(response.data.Respuesta);
                objetoSesion.ID_Usuario = respuesta.resultado[0].id_usuario;
                objetoSesion.Nombre_Usuario = respuesta.resultado[0].nombre_usuario;
                objetoSesion.Estado = respuesta.resultado[0].estado;
                var estadoSesion = respuesta.resultado[0].estado;
                $scope.inicioSesion = false;
                if (estadoSesion === 'A') {
                    $scope.mensajeError = '';
                    var objetoEmpresa = { peticion: JSON.stringify({ ID_Usuario: objetoSesion.ID_Usuario, Version_Fila: '' }) };
                    AppService_Empresas.HTTPObtenerEmpresas(objetoEmpresa).then(function (response1) {
                        var respuesta1 = JSON.parse(response1.data.Respuesta);
                        objetoSesion.ID_Empresa = respuesta1.resultado[0].ID_Empresa;
                        objetoSesion.Nombre_Empresa = respuesta1.resultado[0].Nombre_Empresa;
                        $state.go('dashboard.principal');
                    }, function (error) {
                        console.log(error);
                    });
                }
                else if (estadoSesion === 'F') {
                    $scope.mensajeError = 'Inicio de sesión incorrecto. Por favor, revise el nombre de usuario y la contraseña';
                }
            }, function (error) {
                console.log(error);
            })
        }
        else {
            $scope.mensajeError = 'Inicio de sesión incorrecto. Por favor, complete los campos del formulario, ambos son requeridos.';
        }
    }

});
