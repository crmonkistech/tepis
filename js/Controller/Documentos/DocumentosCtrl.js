app.controller('DocumentosCtrl', function ($scope,
    $state,
    $filter,
    $timeout,
    $stateParams,
    AppService_Documentos) {

    $scope.listaCategoriasDocumentos = [{ ID_Categoria: 1, Nombre_Categoria: 'Pedido' },
    { ID_Categoria: 2, Nombre_Categoria: 'Factura' },
    { ID_Categoria: 3, Nombre_Categoria: 'Devolución' },
    { ID_Categoria: 4, Nombre_Categoria: 'Canje' },
    { ID_Categoria: 5, Nombre_Categoria: 'Conteo' },
    { ID_Categoria: 6, Nombre_Categoria: 'Recarga' },
    { ID_Categoria: 7, Nombre_Categoria: 'Recibo de dinero' },
    { ID_Categoria: 8, Nombre_Categoria: 'Depósito' },
    { ID_Categoria: 9, Nombre_Categoria: 'Gasto en ruta' },
    { ID_Categoria: 10, Nombre_Categoria: 'Notas de Credito' },
    { ID_Categoria: 11, Nombre_Categoria: 'Entregas' },
    { ID_Categoria: 8, Nombre_Categoria: 'stock transfer' }];

    $scope.Lista_Procesos_Recibos_Dinero = [{ 'ID_Proceso': 1, 'Nombre_Proceso': 'Detalles' }, { 'ID_Proceso': 2, 'Nombre_Proceso': 'Anular' }, { 'ID_Proceso': 3, 'Nombre_Proceso': 'Desmarcar' },]

    $scope.ID_Categoria_Documento_Param = $stateParams.ID_Categoria_Documento;
    $scope.Texto_Busqueda = $stateParams.Texto_Busqueda;
    $scope.objetoDocumento = { ID_Empresa: objetoSesion.ID_Empresa, ID_Categoria_Documento: null, Filtro_Documento: "" };
    $scope.listaDocumentos = [];
    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;
    $scope.Mostrar_Loading = false;
    $scope.Objeto_Anular_Desmarcar = {
        Mostrar_Componente_Anular: false,
        Mostrar_Componente_Desmarcar: false,
        ID_Documento: null,
        Resultado_Proceso_Anular: null,
        Resultado_Proceso_Desmarcar: null
    };

    $scope.FiltrarEntidad = function () { return $filter('filter')($scope.listaDocumentos, $scope.objetoDocumento.Filtro_Documento); }

    $scope.CalcularPaginacion = function () { return Math.ceil($scope.FiltrarEntidad().length / $scope.Cantidad_Items); }

    $scope.obtenerDocumentosCategoria = function () {
        $scope.Mostrar_Anular_Recibo_Dinero = false;
        $scope.Mostrar_Marcar_Desmarcar_Recibo_Dinero = false;
        $scope.Objeto_Recibo_Dinero = { ID_Recibo_Dinero_Anular: null, ID_Recibo_Dinero_Marcar_Desmarcar: null, Codigo_Recibo_Dinero_Anular: null, Codigo_Recibo_Dinero_Marcar_Desmarcar: null };
        if ($scope.objetoDocumento.Filtro_Documento !== "" || $scope.objetoDocumento.Filtro_Documento !== null) {
            $scope.listaDocumentos = [];
            $scope.Mostrar_Loading = true;
            var objetoEnviar = { peticion: JSON.stringify($scope.objetoDocumento) };
            console.log(objetoEnviar);
            AppService_Documentos.HTTPObtenerDocumentosFiltro(objetoEnviar).then(function (response) {
                console.log(response);
                if (response.data.Respuesta !== null) {
                    var respuesta = JSON.parse(response.data.Respuesta);
                    $scope.listaDocumentos = respuesta.resultado;
                    console.log($scope.listaDocumentos);
                    $scope.Mostrar_Loading = false;
                }
                else { $scope.Mostrar_Loading = false; }
            }, function (error) { console.log(error); });
        }
    }

    $scope.checkIfEnterKeyWasPressed = function ($event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) { $scope.obtenerDocumentosCategoria(); }
    };

    $scope.Setear_Valores_Default = function () {
        $scope.objetoDocumento.Filtro_Documento = "";
        $scope.listaDocumentos = [];
        $scope.Pagina_Actual = 0;
        $scope.Objeto_Anular_Desmarcar = { Mostrar_Componente_Anular: false, Mostrar_Componente_Desmarcar: false, ID_Documento: null, Resultado_Proceso_Anular: null, Resultado_Proceso_Desmarcar: null };
    }

    $scope.Ir_A_Detalles_Documento = function (ID_Documento_Param, ID_Categoria_Param) { $state.go('dashboard.detallesDocumento', { ID_Documento: ID_Documento_Param, ID_Categoria_Documento: ID_Categoria_Param, Texto_Busqueda: $scope.objetoDocumento.Filtro_Documento }); }

    $scope.Procesos_Documentos = function (ID_Documento, Opcion_Seleccionada) {
        console.log('ID_Documento: ' + ID_Documento);
        console.log('Opcion seleccionada: ' + Opcion_Seleccionada);
        console.log('Categoria de documento: ' + $scope.objetoDocumento.ID_Categoria_Documento);
        if ($scope.objetoDocumento.ID_Categoria_Documento >= 1 && $scope.objetoDocumento.ID_Categoria_Documento <= 6) {
            console.log('La categoria corresponde a un documento');
            if (Opcion_Seleccionada === 1) {
                console.log('La opcion seleccionada fue detalles');
                $scope.Ir_A_Detalles_Documento(ID_Documento, $scope.objetoDocumento.ID_Categoria_Documento);
            }
            else if (Opcion_Seleccionada === 2) {
                console.log('La opcion seleccionada fue anular');
                $scope.Objeto_Anular_Desmarcar['ID_Documento'] = ID_Documento;
                $scope.Mostrar_Componente_Anular();
            }
            else if (Opcion_Seleccionada === 3) {
                console.log('La opcion seleccionada fue desmarcar');
                $scope.Objeto_Anular_Desmarcar['ID_Documento'] = ID_Documento;
                $scope.Mostrar_Componente_Desmarcar();
            }
        }
        else if ($scope.objetoDocumento.ID_Categoria_Documento === 7) {
            console.log('La categoria corresponde a un recibo de dinero');
            if (Opcion_Seleccionada === 1) {
                console.log('La opcion seleccionada fue detalles');
                $scope.Ir_A_Detalles_Documento(ID_Documento, $scope.objetoDocumento.ID_Categoria_Documento);
            }
            else if (Opcion_Seleccionada === 2) {
                console.log('La opcion seleccionada fue anular');
                $scope.Objeto_Anular_Desmarcar['ID_Documento'] = ID_Documento;
                $scope.Mostrar_Componente_Anular();
            }
            else if (Opcion_Seleccionada === 3) {
                console.log('La opcion seleccionada fue desmarcar');
                $scope.Objeto_Anular_Desmarcar['ID_Documento'] = ID_Documento;
                $scope.Mostrar_Componente_Desmarcar();
            }
        }
        else if ($scope.objetoDocumento.ID_Categoria_Documento === 8) {
            console.log('La categoria corresponde a un deposito');
            if (Opcion_Seleccionada === 1) {
                console.log('La opcion seleccionada fue detalles');
                $scope.Ir_A_Detalles_Documento(ID_Documento, $scope.objetoDocumento.ID_Categoria_Documento);
            }
            else if (Opcion_Seleccionada === 2) {
                console.log('La opcion seleccionada fue anular');
                $scope.Objeto_Anular_Desmarcar['ID_Documento'] = ID_Documento;
                $scope.Mostrar_Componente_Anular();
            }
            else if (Opcion_Seleccionada === 3) {
                console.log('La opcion seleccionada fue desmarcar');
                $scope.Objeto_Anular_Desmarcar['ID_Documento'] = ID_Documento;
                $scope.Mostrar_Componente_Desmarcar();
            }
        }
        else if ($scope.objetoDocumento.ID_Categoria_Documento === 9) {
            console.log('La categoria corresponde a un gasto en ruta');
            if (Opcion_Seleccionada === 1) {
                console.log('La opcion seleccionada fue detalles');
                $scope.Ir_A_Detalles_Documento(ID_Documento, $scope.objetoDocumento.ID_Categoria_Documento);
            }
            else if (Opcion_Seleccionada === 2) {
                console.log('La opcion seleccionada fue anular');
                $scope.Objeto_Anular_Desmarcar['ID_Documento'] = ID_Documento;
                $scope.Mostrar_Componente_Anular();
            }
            else if (Opcion_Seleccionada === 3) {
                console.log('La opcion seleccionada fue desmarcar');
                $scope.Objeto_Anular_Desmarcar['ID_Documento'] = ID_Documento;
                $scope.Mostrar_Componente_Desmarcar();
            }
        }
        else if ($scope.objetoDocumento.ID_Categoria_Documento === 11) {
            console.log('La categoria corresponde a un entregas');
            if (Opcion_Seleccionada === 1) {
                console.log('La opcion seleccionada fue detalles');
                $scope.Ir_A_Detalles_Documento(ID_Documento, $scope.objetoDocumento.ID_Categoria_Documento);
            }
            else if (Opcion_Seleccionada === 2) {
                console.log('La opcion seleccionada fue anular');
                $scope.Objeto_Anular_Desmarcar['ID_Documento'] = ID_Documento;
                $scope.Mostrar_Componente_Anular();
            }
            else if (Opcion_Seleccionada === 3) {
                console.log('La opcion seleccionada fue desmarcar');
                $scope.Objeto_Anular_Desmarcar['ID_Documento'] = ID_Documento;
                $scope.Mostrar_Componente_Desmarcar();
            }
        }
    }

    $scope.Mostrar_Componente_Anular = function () {
        this.Objeto_Anular_Desmarcar['Mostrar_Componente_Anular'] = true;
        this.Objeto_Anular_Desmarcar['Mostrar_Componente_Desmarcar'] = false;
    }

    $scope.Mostrar_Componente_Desmarcar = function () {
        this.Objeto_Anular_Desmarcar['Mostrar_Componente_Desmarcar'] = true;
        this.Objeto_Anular_Desmarcar['Mostrar_Componente_Anular'] = false;
    }

    $scope.Anular_Desmarcar_Documentos = function (Accion_Seleccionada_Param) {
        this.Objeto_Anular_Desmarcar['Mostrar_Componente_Anular'] = false;
        this.Objeto_Anular_Desmarcar['Mostrar_Componente_Desmarcar'] = false;
        var Objeto_Enviar = {
            peticion: JSON.stringify({
                ID_Documento: $scope.Objeto_Anular_Desmarcar['ID_Documento'],
                Accion_Seleccionada: Accion_Seleccionada_Param,
                Categoria_Documento: $scope.objetoDocumento.ID_Categoria_Documento,
                FK_ID_Usuario: objetoSesion.ID_Usuario
            })
        };
        console.log(Objeto_Enviar)
        AppService_Documentos.HTTP_Anular_Desmarcar_Recibo_Dinero(Objeto_Enviar).then(function (response) {
            console.log(response);
            var API_Response = JSON.parse(response.data.Respuesta);
            if (API_Response[0]['Respuesta'] === '200') {
                console.log('El proceso salio bien');
                if (Accion_Seleccionada_Param === 'A') { $scope.Objeto_Anular_Desmarcar['Resultado_Proceso_Anular'] = API_Response[0]['Respuesta']; }
                else if (Accion_Seleccionada_Param === 'D') { $scope.Objeto_Anular_Desmarcar['Resultado_Proceso_Desmarcar'] = API_Response[0]['Respuesta']; }
                $timeout(function () {
                    $scope.Objeto_Anular_Desmarcar = { Mostrar_Componente_Anular: false, Mostrar_Componente_Desmarcar: false, ID_Documento: null };
                    $scope.Objeto_Anular_Desmarcar['Resultado_Proceso_Anular'] = null;
                    $scope.Objeto_Anular_Desmarcar['Resultado_Proceso_Desmarcar'] = null;
                }, 3000);
            }
        }, function (error) { console.log(error); });
    }

    angular.element(document).ready(function () {
        if ($scope.ID_Categoria_Documento_Param !== "") {
            $scope.objetoDocumento.ID_Categoria_Documento = parseInt($scope.ID_Categoria_Documento_Param);
            $scope.objetoDocumento.Filtro_Documento = $scope.Texto_Busqueda;
            $scope.obtenerDocumentosCategoria();
        }
    });

});

app.controller('DetallesDocumentoCtrl', function ($scope,
    $state,
    $stateParams,
    $filter,
    $timeout,
    AppService_Jornadas,
    AppService_Documentos) {

    $scope.ID_Documento = $stateParams.ID_Documento; //parseInt($stateParams.ID_Documento);
    $scope.ID_Categoria_Documento = parseInt($stateParams.ID_Categoria_Documento);
    $scope.Texto_Busqueda = $stateParams.Texto_Busqueda;

    $scope.Objeto_Detalle = { Filtro_Detalle: "" };
    $scope.Objeto_Bonificacion = { Filtro_Bonificacion: "" };
    $scope.Objeto_Gasto = { Filtro_Gasto: "" };

    $scope.Pagina_Actual = 0;
    $scope.Pagina_Actual_B = 0;
    $scope.Pagina_Actual_G = 0;
    $scope.Cantidad_Items = 10;

    $scope.objetoDocumento = { ID_Empresa: objetoSesion.ID_Empresa, ID_Documento: $scope.ID_Documento, ID_Categoria_Documento: $scope.ID_Categoria_Documento };
    $scope.listaDetalles = [];
    $scope.listaBonificaciones = [];
    $scope.listaGastosRuta = [];
    $scope.listaEstadosDepositos = [{ ID_Estado_Deposito: 1, Nombre_Estado_Deposito: 'Pendiente' }, { ID_Estado_Deposito: 2, Nombre_Estado_Deposito: 'Descartado' }, { ID_Estado_Deposito: 3, Nombre_Estado_Deposito: 'Aprobado' }];
    $scope.listaEstadosConteo = [{ ID_Estado: false, Nombre_Estado: 'NO' }, { ID_Estado: true, Nombre_Estado: 'SI' }];

    $scope.depositoSeleccionado = { ID_Deposito: null, FK_ID_Estado: null, Nombre_Entidad: 'Deposito', ID_Documento: null, Ajuste_Aplicado: null };
    $scope.conteoSeleccionado = { ID_Documento: null, Ajuste_Aplicado: null, Nombre_Entidad: 'Conteo', ID_Deposito: null, FK_ID_Estado: null, };
    $scope.Mostrar_Alert_Deposito = false;
    $scope.Mostrar_Alert_Conteo = false;
    $scope.Estado_Proceso = 0;
    $scope.Estado_Proceso_Conteo = 0;

    $scope.FiltrarEntidad = function () { return $filter('filter')($scope.listaDetalles, $scope.Objeto_Detalle.Filtro_Detalle); }
    $scope.CalcularPaginacion = function () { return Math.ceil($scope.FiltrarEntidad().length / $scope.Cantidad_Items); }
    $scope.FiltrarEntidadB = function () { return $filter('filter')($scope.listaBonificaciones, $scope.Objeto_Bonificacion.Filtro_Bonificacion); }
    $scope.CalcularPaginacionB = function () { return Math.ceil($scope.FiltrarEntidadB().length / $scope.Cantidad_Items); }
    $scope.FiltrarEntidadG = function () { return $filter('filter')($scope.listaGastosRuta, $scope.Objeto_Gasto.Filtro_Gasto); }
    $scope.CalcularPaginacionG = function () { return Math.ceil($scope.FiltrarEntidadG().length / $scope.Cantidad_Items); }

    $scope.obtenerDetallesDocumento = function () {
        $scope.listaDetalles = [];
        if ($scope.ID_Categoria_Documento === 11) { //ENTREGAS
            var objetoEnviar = { peticion: JSON.stringify($scope.objetoDocumento) };
            console.log('objeto a enviar para entregas', objetoEnviar);
            AppService_Documentos.HTTPObtenerDetallesDocumentosEntregas(objetoEnviar).then(function (response) {
                if (response.data.Respuesta !== null) {
                    var respuesta = JSON.parse(response.data.Respuesta);
                    console.log('respuesta del servidor',respuesta);
                    $scope.listaDetalles = respuesta;
                }
            }, function (error) { console.log(error); });
        }
        else {
            var objetoEnviar = { peticion: JSON.stringify($scope.objetoDocumento) };
            AppService_Documentos.HTTPObtenerDetallesDocumentosFiltro(objetoEnviar).then(function (response) {
                if (response.data.Respuesta !== null) {
                    var respuesta = JSON.parse(response.data.Respuesta);
                    $scope.listaDetalles = respuesta.resultado;
                    if ($scope.ID_Categoria_Documento === 8) {
                        console.log('Es un deposito');
                        $scope.depositoSeleccionado.ID_Deposito = $scope.ID_Documento;
                        $scope.depositoSeleccionado.FK_ID_Estado = $scope.listaDetalles[0].FK_ID_Estado;
                        console.log($scope.depositoSeleccionado);
                    }
                    else if ($scope.ID_Categoria_Documento === 5) {
                        console.log('Es un conteo');
                        $scope.conteoSeleccionado.ID_Documento = $scope.ID_Documento;
                        $scope.conteoSeleccionado.Ajuste_Aplicado = $scope.listaDetalles[0].Ajuste_Inventario;
                        console.log($scope.conteoSeleccionado);
                    }
                }
            }, function (error) { console.log(error); });
        }
    }

    $scope.obtenerDetallesBonificacionesDocumento = function () {
        $scope.listaBonificaciones = [];
        if ($scope.ID_Categoria_Documento === 11) { }
        else {
            var objetoEnviar = { peticion: JSON.stringify($scope.objetoDocumento) };
            AppService_Documentos.HTTPObtenerDetallesBonificacionesFiltro(objetoEnviar).then(function (response) {
                if (response.data.Respuesta !== null) {
                    var respuesta = JSON.parse(response.data.Respuesta);
                    $scope.listaBonificaciones = respuesta.resultado;
                }
            }, function (error) { console.log(error); });
        }
    }

    $scope.obtenerGastosRutaDeposito = function () {
        $scope.listaGastosRuta = [];
        if ($scope.ID_Categoria_Documento === 11) { }
        else {
            var objetoEnviar = { peticion: JSON.stringify($scope.objetoDocumento) };
            AppService_Jornadas.HTTPObtenerGastosRutaDeposito(objetoEnviar).then(function (response) {
                if (response.data.Respuesta !== null) {
                    var respuesta = JSON.parse(response.data.Respuesta);
                    $scope.listaGastosRuta = respuesta.resultado;
                }
            }, function (error) { console.log(error); });
        }
    }

    $scope.actualizarEstadoDepositos = function () { $scope.Mostrar_Alert_Deposito = true; }
    $scope.cancelarActualizarDeposito = function () { $scope.Mostrar_Alert_Deposito = false; }
    $scope.actualizarEstadoConteo = function () { $scope.Mostrar_Alert_Conteo = true; }
    $scope.cancelarActualizarConteo = function () { $scope.Mostrar_Alert_Conteo = false; }

    $scope.confirmarActualizarDeposito = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.depositoSeleccionado) };
        console.log(objetoEnviar);
        AppService_Jornadas.HTTPActualizarEstadoDeposito(objetoEnviar).then(function (response) {
            var respuesta = JSON.parse(response.data.Respuesta);
            $scope.Estado_Proceso = respuesta.resultado[0].Respuesta;
            if ($scope.Estado_Proceso === '200') {
                $scope.Mostrar_Alert_Deposito = false;
                $timeout(function () { $scope.Estado_Proceso = 0; $state.go('dashboard.vistaDocumentos', { ID_Categoria_Documento: $scope.ID_Categoria_Documento, Texto_Busqueda: $scope.Texto_Busqueda }); }, 2000);
            }
        }, function (error) { console.log(error); });
    }

    $scope.confirmarActualizarConteo = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.conteoSeleccionado) };
        console.log(objetoEnviar);
        AppService_Jornadas.HTTPActualizarEstadoDeposito(objetoEnviar).then(function (response) {
            var respuesta = JSON.parse(response.data.Respuesta);
            $scope.Estado_Proceso_Conteo = respuesta.resultado[0].Respuesta;
            if ($scope.Estado_Proceso_Conteo === '200') {
                $scope.Mostrar_Alert_Deposito = false;
                $timeout(function () { $scope.Estado_Proceso_Conteo = 0; $state.go('dashboard.vistaDocumentos', { ID_Categoria_Documento: $scope.ID_Categoria_Documento, Texto_Busqueda: $scope.Texto_Busqueda }); }, 2000);
            }
        }, function (error) { console.log(error); });
    }

    $scope.State_Documentos = function () { $state.go('dashboard.vistaDocumentos', { ID_Categoria_Documento: $scope.ID_Categoria_Documento, Texto_Busqueda: $scope.Texto_Busqueda }); }

    angular.element(document).ready(function () {
        $scope.obtenerDetallesDocumento();
        $scope.obtenerDetallesBonificacionesDocumento();
        $scope.obtenerGastosRutaDeposito();
    });

});