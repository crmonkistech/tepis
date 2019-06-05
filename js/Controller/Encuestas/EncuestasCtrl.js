app.controller('EncuestasCtrl', function ($scope, 
    $state, 
    $filter, 
    AppService_Encuestas) {

    $scope.Lista_Encuestas = [];
    $scope.Objeto_Encuesta = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Encuesta: "" };

    //Paginacion de la vista
    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;
    $scope.Filtrar_Entidad = function () { return $filter('filter')($scope.Lista_Encuestas, $scope.Objeto_Encuesta.Filtro_Encuesta); }
    $scope.Calcular_Paginacion = function () { return Math.ceil($scope.Filtrar_Entidad().length / $scope.Cantidad_Items); }

    $scope.Obtener_Encuestas = function () {
        var Objeto_Enviar = { peticion: JSON.stringify($scope.Objeto_Encuesta) };
        AppService_Encuestas.HTTPObtenerEncuestas(Objeto_Enviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.Lista_Encuestas = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    $scope.irANuevaEncuesta = function () { $state.go('dashboard.registrarNuevaEncuesta'); }
    $scope.editarEncuesta = function (ID_Encuesta) { $state.go('dashboard.editarEncuesta', { ID_Encuesta: ID_Encuesta }); }

    angular.element(document).ready(function () { $scope.Obtener_Encuestas(); });
});

app.controller('EditarEncuestaCtrl', function ($scope, 
    $state, 
    $timeout, 
    $filter, 
    $stateParams, 
    AppService_Encuestas,
    AppService_Categorias,
    AppService_Usuarios) {

    $scope.ID_Encuesta = $stateParams.ID_Encuesta;

    $scope.objetoEncuesta = {
        ID_Encuesta: parseInt($scope.ID_Encuesta), Lista_Usuarios_Seleccionados: {},
        Accion: 'a', FK_ID_Empresa: objetoSesion.ID_Empresa, Encuesta_Cliente_Nuevo: false
    };
    $scope.listaPreguntas = [];
    $scope.listaCategoriasPreguntas = [];
    $scope.listaUsuarios = [];
    $scope.listaUsuariosEncuesta = [];
    $scope.busquedaUsuario = { Filtro_Usuario: '' };

    //Paginacion de la vista
    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;
    $scope.Calcular_Paginacion = function (opcion) {
        if (opcion === 'Usuarios_Encuesta') { return Math.ceil($scope.listaUsuariosEncuesta.length / $scope.Cantidad_Items); }
        else { return Math.ceil($scope.listaUsuarios.length / $scope.Cantidad_Items); }
    }

    $scope.nuevaPregunta = { Pregunta: "", Pregunta_Obligatoria: false, Eliminada: 0, FK_ID_Categoria_Preguntas: "", Nombre_Categoria_Preguntas: "" };

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.obtenerCategoriasPreguntas = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoEncuesta) };
        AppService_Categorias.HTTPObtenerCategoriasPreguntas(objetoEnviar).then(function (response) {
            var res = JSON.parse(response.data.Respuesta);
            $scope.listaCategoriasPreguntas = res.resultado;
        }, function (error) { console.log(error); });
    }

    $scope.obtenerPreguntasEncuesta = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoEncuesta) };
        AppService_Encuestas.HTTPObtenerPreguntasEncuesta(objetoEnviar).then(function (response) {
            var res = JSON.parse(response.data.Respuesta);
            $scope.objetoEncuesta.Nombre_Encuesta = res.resultado[0].Nombre_Encuesta;
            $scope.objetoEncuesta.Encuesta_Cliente_Nuevo = res.resultado[0].Encuesta_Cliente_Nuevo;
            $scope.objetoEncuesta.Descripcion = res.resultado[0].Descripcion;
            $scope.objetoEncuesta.Obligatoria = res.resultado[0].Encuesta_Obligatoria;
            $scope.objetoEncuesta.Eliminado = res.resultado[0].Encuesta_Eliminada;
            $scope.objetoEncuesta.Fecha_Inicio = new Date(res.resultado[0].Fecha_Inicio);
            $scope.objetoEncuesta.Fecha_Finalizacion = new Date(res.resultado[0].Fecha_Finalizacion);
            $scope.listaPreguntas = res.resultado;
            console.log($scope.objetoEncuesta);
        }, function (error) { console.log(error); });
    }

    $scope.obtenerUsuariosEncuesta = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoEncuesta) };
        AppService_Encuestas.HTTPObtenerUsuariosEncuesta(objetoEnviar).then(function (response) {
            var res = JSON.parse(response.data.Respuesta);
            if (res !== null) {
                $scope.listaUsuariosEncuesta = res.resultado;
                var cantUsuariosJson = $scope.listaUsuariosEncuesta.length;
                for (var i = 0; i < cantUsuariosJson; i++) { $scope.objetoEncuesta.Lista_Usuarios_Seleccionados[$scope.listaUsuariosEncuesta[i].ID_Usuario] = true; }
            }
        }, function (error) { console.log(error); });
    }

    $scope.obtenerUsuariosFiltro = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.busquedaUsuario) };
        console.log($scope.busquedaUsuario);
        AppService_Usuarios.HTTPObtenerUsuariosFiltro(objetoEnviar).then(function (response) {
            console.log(response);
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaUsuarios = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    $scope.actualizarNombreCategoria = function () {
        var FK_ID_Categoria_Preguntas = $scope.nuevaPregunta.FK_ID_Categoria_Preguntas;
        var cantCategoriasPreguntas = $scope.listaCategoriasPreguntas.length;
        for (var i = 0; i < cantCategoriasPreguntas; i++) {
            if (FK_ID_Categoria_Preguntas === $scope.listaCategoriasPreguntas[i].ID_Categoria_Preguntas) {
                $scope.nuevaPregunta.Nombre_Categoria_Preguntas = $scope.listaCategoriasPreguntas[i].Nombre_Categoria_Preguntas;
                break;
            }
        }
    }

    $scope.agregarPregunta = function () {
        var jsonValidado = validarJSON($scope.nuevaPregunta);
        if (jsonValidado === true) { $scope.statusProceso = 201; }
        else {
            var json = {
                Pregunta: $scope.nuevaPregunta.Pregunta,
                Pregunta_Obligatoria: $scope.nuevaPregunta.Pregunta_Obligatoria,
                Eliminada: $scope.nuevaPregunta.Eliminada,
                FK_ID_Categoria_Preguntas: $scope.nuevaPregunta.FK_ID_Categoria_Preguntas,
                Nombre_Categoria_Preguntas: $scope.nuevaPregunta.Nombre_Categoria_Preguntas
            }
            $scope.listaPreguntas.push(json);
            $scope.nuevaPregunta = { Pregunta: "", Pregunta_Obligatoria: false, Eliminada: 0, FK_ID_Categoria_Preguntas: $scope.nuevaPregunta.FK_ID_Categoria_Preguntas, Nombre_Categoria_Preguntas: $scope.nuevaPregunta.Nombre_Categoria_Preguntas };
            $scope.statusProceso = 200;
            $timeout(function () { $scope.statusProceso = 0; }, 2000);
        }
    }

    $scope.eliminarPregunta = function (itemPregunta) {
        var index = $scope.listaPreguntas.indexOf(itemPregunta);
        $scope.listaPreguntas.splice(index, 1);
    }

    $scope.guardarEncuesta = function () {
        console.log($scope.objetoEncuesta);
        var jsonValidado = validarJSON($scope.objetoEncuesta);
        if (jsonValidado === true) { $scope.statusProceso = 301; }
        else {
            var cantPreguntas = $scope.listaPreguntas.length;
            if (cantPreguntas === 0) { $scope.statusProceso = 302; }
            else {
                var cantUsuariosJson = 0;
                for (var member in $scope.objetoEncuesta.Lista_Usuarios_Seleccionados) {
                    if ($scope.objetoEncuesta.Lista_Usuarios_Seleccionados[member] === true) { cantUsuariosJson++; }
                }
                if (cantUsuariosJson === 0 && $scope.objetoEncuesta.Encuesta_Cliente_Nuevo === false) { $scope.statusProceso = 303; }
                else {
                    var Fecha_Inicio = $filter('date')($scope.objetoEncuesta.Fecha_Inicio, "yyyy-MM-dd HH:mm:ss");
                    var Fecha_Finalizacion = $filter('date')($scope.objetoEncuesta.Fecha_Finalizacion, "yyyy-MM-dd HH:mm:ss");
                    $scope.objetoEncuesta.Fecha_Inicio = Fecha_Inicio;
                    $scope.objetoEncuesta.Fecha_Finalizacion = Fecha_Finalizacion;
                    var Lista_Preguntas_Json = [];
                    for (var i = 0; i < $scope.listaPreguntas.length; i++) {
                        var json = { Pregunta: $scope.listaPreguntas[i].Pregunta, Pregunta_Obligatoria: $scope.listaPreguntas[i].Pregunta_Obligatoria, FK_ID_Categoria_Preguntas: $scope.listaPreguntas[i].FK_ID_Categoria_Preguntas };
                        Lista_Preguntas_Json.push(json);
                    }
                    $scope.objetoEncuesta.Lista_Preguntas = JSON.stringify(Lista_Preguntas_Json);
                    var Lista_Usuarios = [];
                    for (var member in $scope.objetoEncuesta.Lista_Usuarios_Seleccionados) {
                        if ($scope.objetoEncuesta.Lista_Usuarios_Seleccionados[member] === true) {
                            var json = { ID_Usuario: parseInt(member) };
                            Lista_Usuarios.push(json);
                        }
                    }
                    console.log(Lista_Usuarios);
                    $scope.objetoEncuesta.Lista_Usuarios = JSON.stringify(Lista_Usuarios);
                    $scope.objetoEncuesta.Lista_Usuarios_Seleccionados = "VACIA";
                    console.log($scope.objetoEncuesta);
                    var objetoEnviar = { peticion: JSON.stringify($scope.objetoEncuesta) };
                    console.log(objetoEnviar);
                    AppService_Encuestas.HTTPProcesosEncuestas(objetoEnviar).then(function (response) {
                        console.log(response);
                        var respuesta = response.data.Respuesta;
                        console.log(respuesta);
                        if (respuesta === "200") {
                            $scope.statusProceso = 300;
                            $scope.objetoEncuesta = { ID_Encuesta: parseInt($scope.ID_Encuesta), Lista_Usuarios_Seleccionados: {}, Accion: 'a' };
                            $scope.listaPreguntas = [];
                            $scope.listaCategoriasPreguntas = [];
                            $scope.listaUsuarios = [];
                            $scope.listaUsuariosEncuesta = [];
                            $scope.busquedaUsuario = { Filtro_Usuario: '' };
                            $timeout(function () { $scope.statusProceso = 0; $state.go('dashboard.vistaEncuestas'); }, 3000);
                        }
                        else if (respuesta === '-1') { $scope.statusProceso = '-1'; }
                        else if (respuesta === '500') { $scope.statusProceso = 500; }
                    }, function (error) { console.log(error); });
                }
            }
        }
    }

    angular.element(document).ready(function () {
        $scope.obtenerPreguntasEncuesta();
        $scope.obtenerCategoriasPreguntas();
        $scope.obtenerUsuariosEncuesta();
    });
});

app.controller('RegistrarNuevaEncuestaCtrl', function ($scope, 
    $state, 
    $timeout, 
    $filter, 
    AppService_Encuestas,
    AppService_Categorias,
    AppService_Usuarios) {
    console.log('cargando controlador registro de encuesta');

    console.log(objetoSesion);
    $scope.objetoEncuesta = { ID_Empresa: objetoSesion.ID_Empresa };
    $scope.statusProceso = 0;
    $scope.listaCategoriasPreguntas = [];
    $scope.listaPreguntas = [];
    $scope.listaUsuarios = [];
    $scope.usuariosSeleccionados = {};
    console.log($scope.objetoEncuesta);

    $scope.nuevaEncuesta = {
        Nombre_Encuesta: "",
        Descripcion: "",
        Obligatoria: true,
        Fecha_Inicio: "",
        Fecha_Finalizacion: "",
        FK_ID_Empresa: $scope.objetoEncuesta.ID_Empresa,
        Eliminado: 0,
        Accion: 'i'
    };

    $scope.nuevaPregunta = {
        Pregunta: "",
        Obligatoria: true,
        Eliminada: 0,
        FK_ID_Categoria_Preguntas: "",
        Nombre_Categoria_Preguntas: ""
    };

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.obtenerCategoriasPreguntas = function () {
        AppService_Categorias.HTTPObtenerCategoriasPreguntas().then(function (response) {
            console.log(response);
            if (response.data.Respuesta === null) {
                console.log('Categorias de preguntas NULL');
            }
            else {
                var respuesta = JSON.parse(response.data.Respuesta);
                console.log(respuesta.resultado.length);
                $scope.listaCategoriasPreguntas = respuesta.resultado;
                $scope.nuevaPregunta.FK_ID_Categoria_Preguntas = respuesta.resultado[0].ID_Categoria_Preguntas;
                $scope.nuevaPregunta.Nombre_Categoria_Preguntas = respuesta.resultado[0].Nombre_Categoria_Preguntas;
                console.log($scope.listaCategoriasPreguntas);
            }

        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerUsuarios = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoEncuesta)
        };
        console.log(objetoEnviar);
        AppService_Usuarios.HTTPObtenerUsuarios(objetoEnviar).then(function (response) {
            console.log(response);
            if (response.data.Respuesta === null) {
                console.log('Usuarios NULL');
            }
            else {
                var respuesta = JSON.parse(response.data.Respuesta);
                console.log(respuesta.resultado.length);
                $scope.listaUsuarios = respuesta.resultado;
                $scope.totalItems = $scope.listaUsuarios.length;
                console.log($scope.listaUsuarios);
                console.log('Total items: ' + $scope.totalItems);
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.actualizarNombreCategoria = function () {
        var FK_ID_Categoria_Preguntas = $scope.nuevaPregunta.FK_ID_Categoria_Preguntas;
        console.log(FK_ID_Categoria_Preguntas);
        var cantCategoriasPreguntas = $scope.listaCategoriasPreguntas.length;
        for (var i = 0; i < cantCategoriasPreguntas; i++) {
            if (FK_ID_Categoria_Preguntas === $scope.listaCategoriasPreguntas[i].ID_Categoria_Preguntas) {
                $scope.nuevaPregunta.Nombre_Categoria_Preguntas = $scope.listaCategoriasPreguntas[i].Nombre_Categoria_Preguntas;
                break;
            }
        }
        console.log($scope.nuevaPregunta);
    }

    $scope.agregarPregunta = function () {
        console.log($scope.nuevaPregunta);
        var jsonValidado = validarJSON($scope.nuevaPregunta);
        if (jsonValidado === true) {
            console.log('JSON incorrecto');
            console.log($scope.nuevaPregunta);
            $scope.statusProceso = 201;
        }
        else {
            console.log($scope.nuevaPregunta);
            var json = {
                Pregunta: $scope.nuevaPregunta.Pregunta,
                Obligatoria: $scope.nuevaPregunta.Obligatoria,
                Eliminada: $scope.nuevaPregunta.Eliminada,
                FK_ID_Categoria_Preguntas: $scope.nuevaPregunta.FK_ID_Categoria_Preguntas,
                Nombre_Categoria_Preguntas: $scope.nuevaPregunta.Nombre_Categoria_Preguntas
            }
            $scope.listaPreguntas.push(json);
            $scope.nuevaPregunta = {
                Pregunta: "",
                Obligatoria: false,
                Eliminada: 0,
                FK_ID_Categoria_Preguntas: $scope.nuevaPregunta.FK_ID_Categoria_Preguntas,
                Nombre_Categoria_Preguntas: $scope.nuevaPregunta.Nombre_Categoria_Preguntas
            };
            $scope.statusProceso = 200;
            $timeout(function () {
                $scope.statusProceso = 0;
            }, 2000);
        }

        console.log($scope.listaPreguntas);
    }

    $scope.eliminarPregunta = function (itemPregunta) {
        console.log(itemPregunta);
        var index = $scope.listaPreguntas.indexOf(itemPregunta);
        $scope.listaPreguntas.splice(index, 1);
    }

    $scope.guardarEncuesta = function () {
        console.log($scope.nuevaEncuesta);
        console.log($scope.usuariosSeleccionados);
        var jsonValidado = validarJSON($scope.nuevaEncuesta);
        if (jsonValidado === true) {
            console.log('JSON incorrecto');
            console.log($scope.nuevaEncuesta);
            $scope.statusProceso = 301;
        }
        else {
            var cantPreguntas = $scope.listaPreguntas.length;
            console.log(cantPreguntas);
            if (cantPreguntas === 0) {
                console.log('Debe agregar al menos una pregunta en la encuesta');
                $scope.statusProceso = 302;
            }
            else {
                var cantUsuariosJson = 0;
                for (var member in $scope.usuariosSeleccionados) {
                    console.log(member);
                    console.log($scope.usuariosSeleccionados[member]);
                    if ($scope.usuariosSeleccionados[member] === true) {
                        cantUsuariosJson++;
                    }
                }
                if (cantUsuariosJson === 0) {
                    $scope.statusProceso = 303;
                    console.log('Debe seleccional al menos un usuario');
                }
                else {
                    var Fecha_Inicio = $filter('date')($scope.nuevaEncuesta.Fecha_Inicio, "yyyy-MM-dd HH:mm:ss");
                    var Fecha_Finalizacion = $filter('date')($scope.nuevaEncuesta.Fecha_Finalizacion, "yyyy-MM-dd HH:mm:ss");
                    console.log('Fecha inicio: ' + Fecha_Inicio);
                    console.log('Fecha finalizacion: ' + Fecha_Finalizacion);
                    $scope.nuevaEncuesta.Fecha_Inicio = Fecha_Inicio;
                    $scope.nuevaEncuesta.Fecha_Finalizacion = Fecha_Finalizacion;
                    var Lista_Preguntas_Json = [];
                    for (var i = 0; i < $scope.listaPreguntas.length; i++) {
                        var json = {
                            Pregunta: $scope.listaPreguntas[i].Pregunta,
                            Obligatoria: $scope.listaPreguntas[i].Obligatoria,
                            FK_ID_Categoria_Preguntas: $scope.listaPreguntas[i].FK_ID_Categoria_Preguntas
                        };

                        Lista_Preguntas_Json.push(json);
                    }
                    console.log(Lista_Preguntas_Json);

                    $scope.nuevaEncuesta.Lista_Preguntas = JSON.stringify(Lista_Preguntas_Json);
                    console.log($scope.nuevaEncuesta);

                    var Lista_Usuarios = [];
                    for (var member in $scope.usuariosSeleccionados) {
                        console.log(member);
                        console.log($scope.usuariosSeleccionados[member]);
                        if ($scope.usuariosSeleccionados[member] === true) {
                            var json = {
                                ID_Usuario: parseInt(member)
                            };
                            Lista_Usuarios.push(json);
                        }
                    }
                    console.log(Lista_Usuarios);
                    $scope.nuevaEncuesta.Lista_Usuarios = JSON.stringify(Lista_Usuarios);
                    console.log($scope.nuevaEncuesta);

                    var objetoEnviar = {
                        peticion: JSON.stringify($scope.nuevaEncuesta)
                    };
                    console.log(objetoEnviar);
                    AppService_Encuestas.HTTPProcesosEncuestas(objetoEnviar).then(function (response) {
                        console.log(response);
                        var respuesta = response.data.Respuesta;
                        if (respuesta === "200") {
                            $scope.statusProceso = 300;
                            $scope.nuevaEncuesta = {
                                Nombre_Encuesta: "",
                                Descripcion: "",
                                Obligatoria: false,
                                Fecha_Inicio: "",
                                Fecha_Finalizacion: "",
                                FK_ID_Empresa: $scope.objetoEncuesta.ID_Empresa,
                                Eliminado: 0,
                                Accion: 'i'
                            };
                            $scope.listaPreguntas = [];
                            $scope.usuariosSeleccionados = {};
                            $timeout(function () {
                                $scope.statusProceso = 0;
                            }, 3000);
                        }
                        else if (respuesta === '-1') {
                            $scope.statusProceso = '-1';
                        }
                    }, function (error) {
                        console.log(error);
                    });
                }
            }
        }
    }

    angular.element(document).ready(function () {
        $scope.obtenerCategoriasPreguntas();
        $scope.obtenerUsuarios();
    });

});  