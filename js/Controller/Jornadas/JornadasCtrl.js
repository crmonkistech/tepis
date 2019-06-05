app.controller('JornadasCtrl', function ($scope, 
    $state, 
    $timeout, 
    $filter, 
    AppService_Jornadas) {

    $scope.listaUsuarios = [];
    $scope.objetoJornada = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Jornada: "" };

    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 20;

    $scope.Filtrar_Entidad = function () { return $filter('filter')($scope.listaUsuarios, $scope.objetoJornada.Filtro_Jornada); }
    $scope.Calcular_Paginacion = function () { return Math.ceil($scope.Filtrar_Entidad().length / $scope.Cantidad_Items); }

    $scope.obtenerUsuarios = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoJornada) };
        AppService_Jornadas.HTTPObtenerJornadas(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaUsuarios = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    $scope.editarJornada = function (ID_Jornada, ID_Usuario) { $state.go('dashboard.procesarJornada', { ID_Jornada: ID_Jornada, ID_Usuario: ID_Usuario }); }

    angular.element(document).ready(function () { $scope.obtenerUsuarios(); });

});

app.controller('ProcesarJornadaCtrl', function ($scope, 
    $state, 
    $stateParams, 
    $timeout, 
    $filter, 
    AppServiceDB, 
    AppService_Documentos,
    AppService_Jornadas) {

    $scope.ID_Jornada = $stateParams.ID_Jornada;
    $scope.ID_Usuario = $stateParams.ID_Usuario;
    console.log('ID Jornada: ' + $scope.ID_Jornada);
    console.log('ID Usuario: ' + $scope.ID_Usuario);
    console.log(objetoSesion);

    $scope.objetoJornada = {
        ID_Empresa: objetoSesion.ID_Empresa,
        ID_Usuario: parseInt($scope.ID_Usuario),
        ID_Jornada: parseInt($scope.ID_Jornada),
        Monto_Ajustes: 0,
        Observaciones: ''
    };

    $scope.rangosFecha = {
        Fecha_Inicial_Documentos: null,
        Fecha_Final_Documentos: null,
        Fecha_Inicial_Recibos: null,
        Fecha_Final_Recibos: null,
        Fecha_Inicial_Depositos: null,
        Fecha_Final_Depositos: null,
        Fecha_Inicial_Gastos: null,
        Fecha_Final_Gastos: null,
        Fecha_Inicial_StockTransfer: null,
        Fecha_Final_StockTransfer: null
    };

    $scope.filtroDiferencias = { mostrarDiferencias: false };
    $scope.filtroDocumentos = { tipoSeleccionado: 'Todos' };
    $scope.filters = {};

    console.log($scope.objetoJornada);

    $scope.infoJornada = null;
    $scope.detalleJornada = {
        Monto_Ajustes: 0,
        Observaciones: 'Sin observaciones'
    };
    $scope.listaDocumentos = [];
    $scope.listaDocumentosFiltroFecha = [];
    $scope.listaRecibos = [];
    $scope.listaRecibosFiltroFecha = [];
    $scope.listaDepositos = [];
    $scope.listaDepositosFiltroFecha = [];
    $scope.listaDocumentosReciboDinero = [];
    $scope.listaRecibosDineroDeposito = [];
    $scope.listaGastosRuta = [];
    $scope.listaGastosFiltroFecha = [];
    $scope.listaBonificaciones = [];
    $scope.statusProceso = 0;
    $scope.jornadaFinalizada = false;
    $scope.listaDetallesConteosFiltro = [];
    $scope.listaCodigosConteos = [];

    $scope.listaStockTransfer = [];
    $scope.listaStockTransferFiltroFecha = [];

    //Otros
    $scope.listaConteos = [];
    $scope.listaConteosBackup = [];
    $scope.maximoItemsPagina = 5;

    //Variables de control para los documentos
    $scope.vistaPorDocumentos = 5;
    $scope.paginaActualDocumentos = 1;
    $scope.itemsPorPaginaDocumentos = $scope.vistaPorDocumentos;
    $scope.pageDocumentos = 1;

    //Variables de control para los recibos de dinero
    $scope.vistaPorRecibos = 5;
    $scope.paginaActualRecibos = 1;
    $scope.itemsPorPaginaRecibos = $scope.vistaPorRecibos;
    $scope.pageRecibos = 1;

    //Variables de control para los depositos
    $scope.vistaPorDepositos = 5;
    $scope.paginaActualDepositos = 1;
    $scope.itemsPorPaginaDepositos = $scope.vistaPorDepositos;
    $scope.pageDepositos = 1;

    //Variables de control para los gastos en ruta
    $scope.vistaPorGastos = 5;
    $scope.paginaActualGastos = 1;
    $scope.itemsPorPaginaGastos = $scope.vistaPorGastos;
    $scope.pageGastos = 1;

    //Variables de control para los conteos
    $scope.vistaPorConteos = 5;
    $scope.paginaActualConteos = 1;
    $scope.itemsPorPaginaConteos = $scope.vistaPorConteos;
    $scope.pageConteos = 1;

    //Variables de control para las bonificaciones
    $scope.vistaPorBonificaciones = 5;
    $scope.paginaActualBonificaciones = 1;
    $scope.itemsPorPaginaBonificaciones = $scope.vistaPorBonificaciones;
    $scope.pageBonificaciones = 1;

    //Variables de control para los stockTransfer
    $scope.vistaPorStockTransfer = 5;
    $scope.paginaActualStockTransfer = 1;
    $scope.itemsPorPaginaStockTransfer = $scope.vistaPorStockTransfer;
    $scope.pageStockTransfer = 1;

    $scope.setItemsPerPage = function (num, tipo) {
        if (tipo === 'Documentos') {
            $scope.itemsPorPaginaDocumentos = num;
            $scope.paginaActualDocumentos = 1;
        }
        else if (tipo === 'Recibos') {
            $scope.itemsPorPaginaRecibos = num;
            $scope.paginaActualRecibos = 1;
        }
        else if (tipo === 'Depositos') {
            $scope.itemsPorPaginaDepositos = num;
            $scope.paginaActualDepositos = 1;
        }
        else if (tipo === 'Gastos') {
            $scope.itemsPorPaginaGastos = $scope.vistaPorGastos;
            $scope.paginaActualGastos = 1;
        }
        else if (tipo === 'Conteos') {
            $scope.itemsPorPaginaConteos = $scope.vistaPorConteos;
            $scope.paginaActualConteos = 1;
        }
        else if (tipo === 'Bonificaciones') {
            $scope.paginaActualBonificaciones = 1;
            $scope.itemsPorPaginaBonificaciones = $scope.vistaPorBonificaciones;
        }
        else if (tipo === 'StockTransfer') {
            $scope.paginaActualStockTransfer = 1;
            $scope.itemsPorPaginaStockTransfer = $scope.vistaPorStockTransfer;
        }
    }

    $scope.pageChanged = function () {
        console.log('Page Documentos changed to: ' + $scope.paginaActualDocumentos);
        console.log('Page Recibos changed to: ' + $scope.paginaActualRecibos);
        console.log('Page Depositos changed to: ' + $scope.paginaActualDepositos);
        console.log('Page Gastos Ruta changed to: ' + $scope.paginaActualGastos);
        console.log('Page Gastos Ruta changed to: ' + $scope.paginaActualConteos);
        var startPos = ($scope.page - 1) * 3;
        $scope.displayItems = $scope.totalItems.slice(startPos, startPos + 3);
        console.log($scope.page);
    }

    $scope.obtenerInformacionJornada = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoJornada)
        };
        AppService_Jornadas.HTTPObtenerJornadasID(objetoEnviar).then(function (response) {
            console.log(response);
            var res = JSON.parse(response.data.Respuesta);
            $scope.infoJornada = res.resultado[0];
            console.log($scope.infoJornada);
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerDetalleJornada = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoJornada)
        };
        AppService_Jornadas.HTTPObtenerDetalleJornada(objetoEnviar).then(function (response) {
            console.log(response);
            if (response.data.Respuesta !== null) {
                var res = JSON.parse(response.data.Respuesta);
                $scope.detalleJornada.Monto_Ajustes = res.resultado[0].Monto_Ajustes;
                $scope.detalleJornada.Observaciones = res.resultado[0].Observaciones;
                console.log($scope.detalleJornada);
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerDocumentosJornada = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoJornada)
        }
        console.log(objetoEnviar);
        AppService_Jornadas.HTTPObtenerDocumentosJornada(objetoEnviar).then(function (response) {
            console.log(response);
            var res = JSON.parse(response.data.Respuesta);
            console.log(res);
            if (res !== null) {
                $scope.listaDocumentos = res.resultado;
                console.log($scope.listaDocumentos);
                $scope.totalItemsDocumentos = $scope.listaDocumentos.length;
            }
            else {
                console.log('No hay documentos');
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerRecibosDineroJornada = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoJornada)
        }
        console.log(objetoEnviar);
        AppService_Jornadas.HTTPObtenerRecibosDineroJornada(objetoEnviar).then(function (response) {
            console.log(response);
            var res = JSON.parse(response.data.Respuesta);
            console.log(res);
            if (res !== null) {
                $scope.listaRecibos = res.resultado;
                console.log($scope.listaRecibos);
                $scope.totalItemsRecibos = $scope.listaRecibos.length;
            }
            else {
                console.log('No hay recibos dinero');
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerDepositosJornada = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoJornada)
        }
        AppService_Jornadas.HTTPObtenerDepositosJornada(objetoEnviar).then(function (response) {
            console.log(response);
            var res = JSON.parse(response.data.Respuesta);
            console.log(res);
            if (res !== null) {
                $scope.listaDepositos = res.resultado;
                console.log($scope.listaDepositos);
                $scope.totalItemsDepositos = $scope.listaDepositos.length;
            }
            else {
                console.log('No hay depositos');
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerGastosRutaJornada = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoJornada)
        }
        AppService_Jornadas.HTTPObtenerGastosRuta(objetoEnviar).then(function (response) {
            console.log(response);
            var res = JSON.parse(response.data.Respuesta);
            console.log(res);
            if (res !== null) {
                $scope.listaGastosRuta = res.resultado;
                console.log($scope.listaGastosRuta);
                $scope.totalItemsGastos = $scope.listaGastosRuta.length;
            }
            else {
                console.log('No hay gastos ruta');
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerConteos = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoJornada)
        }
        AppService_Jornadas.HTTPObtenerDetallesConteos(objetoEnviar).then(function (response) {
            console.log(response);
            var res = JSON.parse(response.data.Respuesta);
            console.log(res);
            if (res !== null) {
                $scope.listaConteos = res.resultado;
                $scope.listaConteosBackup = res.resultado;
                console.log($scope.listaConteos);
                console.log($scope.listaConteosBackup);
                $scope.totalProductosContados = $scope.listaConteos.length;
                console.log('En total, se contaron: ' + $scope.totalProductosContados);
                var codigoConteoEncontrado = false;
                for (var i = 0; i < $scope.listaConteos.length; i++) {
                    codigoConteoEncontrado = false;
                    if ($scope.listaCodigosConteos.length === 0) {
                        $scope.listaCodigosConteos.push($scope.listaConteos[i].Codigo_Documento);
                    }
                    else {
                        for (var j = 0; j < $scope.listaCodigosConteos.length; j++) {
                            if ($scope.listaCodigosConteos[j] === $scope.listaConteos[i].Codigo_Documento) {
                                codigoConteoEncontrado = true;
                                break;
                            }
                        }
                        if (codigoConteoEncontrado === false) {
                            $scope.listaCodigosConteos.push($scope.listaConteos[i].Codigo_Documento);
                        }
                    }

                }
                console.log($scope.listaCodigosConteos);
            }
            else {
                console.log('No hay conteos para este agente');
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.obtenerStockTransfer = function () {  
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoJornada)
        }
        AppService_Documentos.HTTP_Obtener_Stock_Transfer_Jornada(objetoEnviar).then(function (response) {
            console.log(response);
            var res = JSON.parse(response.data.Respuesta);
            console.log(res);
            if (res !== null) {
                $scope.listaStockTransfer = res.resultado;
                console.log($scope.listaStockTransfer);
                $scope.totalItemsStockTransfer = $scope.listaStockTransfer.length;
            }
            else {
                console.log('No hay stock transfer ruta');
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.seleccionarConteo = function (conteoSeleccionado) {
        $scope.listaDetallesConteosFiltro = [];
        $scope.listaConteos = $scope.listaConteosBackup;
        if (conteoSeleccionado === 'TODOS') {
            $scope.listaConteos = $scope.listaConteosBackup;
        }
        else {
            for (var i = 0; i < $scope.listaConteos.length; i++) {
                if ($scope.listaConteos[i].Codigo_Documento === conteoSeleccionado) {
                    $scope.listaDetallesConteosFiltro.push($scope.listaConteos[i]);
                }
            }
            $scope.listaConteos = [];
            $scope.listaConteos = $scope.listaDetallesConteosFiltro;
        }
    }

    $scope.obtenerBonificacionesJornada = function () {
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoJornada)
        }
        console.log(objetoEnviar);
        AppServiceDB.HTTPObtenerBonificacionesJornada(objetoEnviar).then(function (response) {
            console.log(response);
            var res = JSON.parse(response.data.Respuesta);
            console.log(res);
            if (res !== null) {
                $scope.listaBonificaciones = res.resultado;
                console.log($scope.listaBonificaciones);
            }
            else {
                console.log('No hay bonificaciones');
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.calcularMontoFacturas = function () {
        var cantItems = $scope.listaDocumentos.length;
        var total = 0;
        if (cantItems > 0) {
            for (var i = 0; i < cantItems; i++) {
                if ($scope.listaDocumentos[i].Nombre_Categoria_Documento === 'Factura') {
                    total = total + $scope.listaDocumentos[i].Monto_Total;
                }
            }
            return total;
        }
        else {
            return 0;
        }
    }

    $scope.calcularMontoDevoluciones = function () {
        var cantItems = $scope.listaDocumentos.length;
        var total = 0;
        if (cantItems > 0) {
            for (var i = 0; i < cantItems; i++) {
                if ($scope.listaDocumentos[i].Nombre_Categoria_Documento === 'Devolución') {
                    total = total + $scope.listaDocumentos[i].Monto_Total;
                }
            }
            return total;
        }
        else {
            return 0;
        }
    }

    $scope.calcularMontoCanjes = function () {
        var cantItems = $scope.listaDocumentos.length;
        var total = 0;
        if (cantItems > 0) {
            for (var i = 0; i < cantItems; i++) {
                if ($scope.listaDocumentos[i].Nombre_Categoria_Documento === 'Canje') {
                    total = total + $scope.listaDocumentos[i].Monto_Total;
                }
            }
            return total;
        }
        else {
            return 0;
        }
    }

    $scope.calcularMontoRecibosEfectivo = function () {
        var cantItems = $scope.listaRecibos.length;
        var total = 0;
        if (cantItems > 0) {
            for (var i = 0; i < cantItems; i++) {
                if ($scope.listaRecibos[i].Nombre_Categoria_Recibo_Dinero === 'Efectivo') {
                    total = total + $scope.listaRecibos[i].Monto_Total;
                }
            }
            return total;
        }
        else {
            return 0;
        }
    }

    $scope.calcularMontoRecibosTransferencia = function () {
        var cantItems = $scope.listaRecibos.length;
        var total = 0;
        if (cantItems > 0) {
            for (var i = 0; i < cantItems; i++) {
                if ($scope.listaRecibos[i].Nombre_Categoria_Recibo_Dinero === 'Transferencia') {
                    total = total + $scope.listaRecibos[i].Monto_Total;
                }
            }
            return total;
        }
        else {
            return 0;
        }
    }

    $scope.calcularMontoRecibosCheque = function () {
        var cantItems = $scope.listaRecibos.length;
        var total = 0;
        if (cantItems > 0) {
            for (var i = 0; i < cantItems; i++) {
                if ($scope.listaRecibos[i].Nombre_Categoria_Recibo_Dinero === 'Cheque') {
                    total = total + $scope.listaRecibos[i].Monto_Total;
                }
            }
            return total;
        }
        else {
            return 0;
        }
    }

    $scope.calcularMontoRecibosMultiple = function () {
        var cantItems = $scope.listaRecibos.length;
        var total = 0;
        if (cantItems > 0) {
            for (var i = 0; i < cantItems; i++) {
                if ($scope.listaRecibos[i].Nombre_Categoria_Recibo_Dinero === 'Múltiple') {
                    total = total + $scope.listaRecibos[i].Monto_Total;
                }
            }
            return total;
        }
        else {
            return 0;
        }
    }

    $scope.calcularMontoDepositos = function () {
        var cantItems = $scope.listaDepositos.length;
        var total = 0;
        if (cantItems > 0) {
            for (var i = 0; i < cantItems; i++) {
                total = total + $scope.listaDepositos[i].Monto_Total;
            }
            return total;
        }
        else {
            return 0;
        }
    }

    $scope.calcularMontoGastos = function () {
        var cantItems = $scope.listaGastosRuta.length;
        var total = 0;
        if (cantItems > 0) {
            for (var i = 0; i < cantItems; i++) {
                total = total + $scope.listaGastosRuta[i].Monto;
            }
            return total;
        }
        else {
            return 0;
        }
    }

    $scope.cerrarJornada = function () {
        console.log($scope.objetoJornada);
        var objetoEnviar = {
            peticion: JSON.stringify($scope.objetoJornada)
        };
        console.log(objetoEnviar);
        AppService_Jornadas.HTTPCerrarJornada(objetoEnviar).then(function (response) {
            console.log(response);
            var res = JSON.parse(response.data.Respuesta);
            $scope.statusProceso = res.resultado[0].Respuesta;
            console.log($scope.statusProceso);
            if ($scope.statusProceso === "200") {
                $scope.jornadaFinalizada = true;
                $timeout(function () {
                    $scope.statusProceso = 0;
                    $scope.objetoJornada = {
                        ID_Empresa: objetoSesion.ID_Empresa,
                        ID_Usuario: parseInt($scope.ID_Usuario),
                        ID_Jornada: parseInt($scope.ID_Jornada),
                        Monto_Ajustes: 0,
                        Observaciones: ''
                    };
                }, 3000);
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.verDetallesReciboDinero = function (ID_Recibo_Dinero) {
        console.log(ID_Recibo_Dinero);
        var objetoEnviar = {
            peticion: JSON.stringify({ ID_Recibo_Dinero: ID_Recibo_Dinero })
        };
        AppService_Jornadas.HTTPObtenerDocumentosReciboDinero(objetoEnviar).then(function (response) {
            console.log(response);
            var res = JSON.parse(response.data.Respuesta);
            console.log(res);
            if (res !== null) {
                $scope.listaDocumentosReciboDinero = res.resultado;
                console.log($scope.listaDocumentosReciboDinero);
            }
            else {
                console.log('No hay depositos');
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.verDetallesDeposito = function (ID_Deposito) {
        console.log(ID_Deposito);
        var objetoEnviar = {
            peticion: JSON.stringify({ ID_Deposito: ID_Deposito })
        };
        AppService_Jornadas.HTTPObtenerReciboDineroDeposito(objetoEnviar).then(function (response) {
            console.log(response);
            var res = JSON.parse(response.data.Respuesta);
            console.log(res);
            if (res !== null) {
                $scope.listaRecibosDineroDeposito = res.resultado;
                console.log($scope.listaRecibosDineroDeposito);
            }
            else {
                console.log('No hay depositos');
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.filtrarDocumentosFecha = function () {
        $scope.listaDocumentosFiltroFecha = [];
        $scope.cantidadDocumentosFiltrados = 0;
        var Filtro_Fecha_Inicio = $filter('date')($scope.rangosFecha.Fecha_Inicial_Documentos, "yyyy-MM-dd HH:mm:ss");
        var Filtro_Fecha_Final = $filter('date')($scope.rangosFecha.Fecha_Final_Documentos, "yyyy-MM-dd HH:mm:ss");
        var cantDocumentos = $scope.listaDocumentos.length;
        for (var i = 0; i < cantDocumentos; i++) {
            if ($scope.listaDocumentos[i].Fecha_Creacion >= Filtro_Fecha_Inicio && $scope.listaDocumentos[i].Fecha_Creacion <= Filtro_Fecha_Final) {
                $scope.listaDocumentosFiltroFecha.push($scope.listaDocumentos[i]);
            }
        }
        $scope.cantidadDocumentosFiltrados = $scope.listaDocumentosFiltroFecha.length;
        if ($scope.cantidadDocumentosFiltrados > 0) {
            $scope.totalItemsDocumentos = $scope.cantidadDocumentosFiltrados;
        }
    }

    $scope.filtrarRecibosFecha = function () {
        $scope.listaRecibosFiltroFecha = [];
        $scope.cantidadRecibosFiltrados = 0;
        var Filtro_Fecha_Inicio = $filter('date')($scope.rangosFecha.Fecha_Inicial_Recibos, "yyyy-MM-dd HH:mm:ss");
        var Filtro_Fecha_Final = $filter('date')($scope.rangosFecha.Fecha_Final_Recibos, "yyyy-MM-dd HH:mm:ss");

        var cantRecibos = $scope.listaRecibos.length;
        for (var i = 0; i < cantRecibos; i++) {
            if ($scope.listaRecibos[i].Fecha_Recibido >= Filtro_Fecha_Inicio && $scope.listaRecibos[i].Fecha_Recibido <= Filtro_Fecha_Final) {
                $scope.listaRecibosFiltroFecha.push($scope.listaRecibos[i]);
            }
        }
        $scope.cantidadRecibosFiltrados = $scope.listaRecibosFiltroFecha.length;
        if ($scope.cantidadRecibosFiltrados > 0) {
            $scope.totalItemsRecibos = $scope.cantidadRecibosFiltrados;
        }
    }

    $scope.filtrarDepositosFecha = function () {
        $scope.listaDepositosFiltroFecha = [];
        $scope.cantidadDepositosFiltrados = 0;
        var Filtro_Fecha_Inicio = $filter('date')($scope.rangosFecha.Fecha_Inicial_Depositos, "yyyy-MM-dd HH:mm:ss");
        var Filtro_Fecha_Final = $filter('date')($scope.rangosFecha.Fecha_Final_Depositos, "yyyy-MM-dd HH:mm:ss");

        var cantDepositos = $scope.listaDepositos.length;
        for (var i = 0; i < cantDepositos; i++) {
            if ($scope.listaDepositos[i].Fecha_Creacion > Filtro_Fecha_Inicio && $scope.listaDepositos[i].Fecha_Creacion < Filtro_Fecha_Final) {
                $scope.listaDepositosFiltroFecha.push($scope.listaDepositos[i]);
            }
        }
        $scope.cantidadDepositosFiltrados = $scope.listaDepositosFiltroFecha.length;
        if ($scope.cantidadDepositosFiltrados > 0) {
            $scope.totalItemsDepositos = $scope.cantidadDepositosFiltrados;
        }
    }

    $scope.filtrarGastosFecha = function () {
        $scope.listaGastosFiltroFecha = [];
        $scope.cantidadGastosFiltrados = 0;
        var Filtro_Fecha_Inicio = $filter('date')($scope.rangosFecha.Fecha_Inicial_Gastos, "yyyy-MM-dd HH:mm:ss");
        var Filtro_Fecha_Final = $filter('date')($scope.rangosFecha.Fecha_Final_Gastos, "yyyy-MM-dd HH:mm:ss");

        var cantGastos = $scope.listaGastosRuta.length;
        for (var i = 0; i < cantGastos; i++) {
            if ($scope.listaGastosRuta[i].Fecha_Creacion > Filtro_Fecha_Inicio && $scope.listaGastosRuta[i].Fecha_Creacion < Filtro_Fecha_Final) {
                $scope.listaGastosFiltroFecha.push($scope.listaGastosRuta[i]);
            }
        }
        $scope.cantidadGastosFiltrados = $scope.listaGastosFiltroFecha.length;
        if ($scope.cantidadGastosFiltrados > 0) {
            $scope.totalItemsGastos = $scope.cantidadGastosFiltrados;
        }
    }

    $scope.filtrarStockTransferFecha = function () {
        $scope.listaStockTransferFiltroFecha = [];
        $scope.cantidadStockTransferFiltrados = 0;
        var Filtro_Fecha_Inicio = $filter('date')($scope.rangosFecha.Fecha_Inicial_StockTransfer, "yyyy-MM-dd HH:mm:ss");
        var Filtro_Fecha_Final = $filter('date')($scope.rangosFecha.Fecha_Final_StockTransfer, "yyyy-MM-dd HH:mm:ss");

        var cantStockTransfer = $scope.listaStockTransfer.length;
        for (var i = 0; i < cantStockTransfer; i++) {
            if ($scope.listaStockTransfer[i].Fecha_Creacion > Filtro_Fecha_Inicio && $scope.listaStockTransfer[i].Fecha_Creacion < Filtro_Fecha_Final) {
                $scope.listaStockTransferFiltroFecha.push($scope.listaStockTransfer[i]);
            }
        }
        $scope.cantidadStockTransferFiltrados = $scope.listaStockTransferFiltroFecha.length;
        if ($scope.cantidadStockTransferFiltrados > 0) {
            $scope.totalItemsStockTransfer = $scope.cantidadStockTransferFiltrados;
        }
    }

    $scope.filtrarDocumentosTipo = function () {
        console.log($scope.filtroDocumentos);
        if ($scope.filtroDocumentos.tipoSeleccionado === 'Todos') {
            $scope.filters.Nombre_Categoria_Documento = '';
        }
        else if ($scope.filtroDocumentos.tipoSeleccionado === 'Facturas') {
            $scope.filters.Nombre_Categoria_Documento = 'Factura';
        }
        else if ($scope.filtroDocumentos.tipoSeleccionado === 'Devoluciones') {
            $scope.filters.Nombre_Categoria_Documento = 'Devolución';
        }
        else if ($scope.filtroDocumentos.tipoSeleccionado === 'Canjes') {
            $scope.filters.Nombre_Categoria_Documento = 'Canje';
        }
    }

    $scope.actualizarDatosJornada = function () {
        $scope.obtenerInformacionJornada();
        $scope.obtenerConteos();
        $scope.obtenerDocumentosJornada();
        $scope.obtenerRecibosDineroJornada();
        $scope.obtenerDepositosJornada();
        $scope.obtenerGastosRutaJornada();
        $scope.obtenerBonificacionesJornada();
        //$scope.obtenerStockTransfer(); /** LISTAR LOS STOCK TRANSFER  */
        
        $timeout(function () {
            console.log($scope.infoJornada);
            console.log($scope.jornadaFinalizada);
            if ($scope.infoJornada.Fecha_Finalizacion !== "1995-03-25T00:00:00") {
                $scope.jornadaFinalizada = true;
                $scope.obtenerDetalleJornada();
                console.log($scope.jornadaFinalizada);
            }
            else {
                $scope.jornadaFinalizada = false;
                console.log($scope.jornadaFinalizada);
            }
        }, 100);
    }

    $scope.generarPDF = function () {
        //Variables con los montos de la jornada
        var montoFacturas = $scope.calcularMontoFacturas();
        montoFacturas = $filter('currency')(montoFacturas, "", 2);
        console.log(montoFacturas);
        var montoDevoluciones = $scope.calcularMontoDevoluciones();
        montoDevoluciones = $filter('currency')(montoDevoluciones, "", 2);
        console.log(montoDevoluciones);
        var montoCanjes = $scope.calcularMontoCanjes();
        montoCanjes = $filter('currency')(montoCanjes, "", 2);
        console.log(montoCanjes);
        var montoDepositos = $scope.calcularMontoDepositos();
        montoDepositos = $filter('currency')(montoDepositos, "", 2);
        console.log(montoDepositos);
        var montoGastosRuta = $scope.calcularMontoGastos();
        montoGastosRuta = $filter('currency')(montoGastosRuta, "", 2);
        console.log(montoGastosRuta);
        var montoEfectivo = $scope.calcularMontoRecibosEfectivo();
        montoEfectivo = $filter('currency')(montoEfectivo, "", 2);
        console.log(montoEfectivo);
        var montoTransferencia = $scope.calcularMontoRecibosTransferencia();
        montoTransferencia = $filter('currency')(montoTransferencia, "", 2);
        console.log(montoTransferencia);
        var montoCheque = $scope.calcularMontoRecibosCheque();
        montoCheque = $filter('currency')(montoCheque, "", 2);
        console.log(montoCheque);
        var montoMultiple = $scope.calcularMontoRecibosMultiple();
        montoMultiple = $filter('currency')(montoMultiple, "", 2);
        console.log(montoMultiple);
        console.log($scope.detalleJornada);
        var montoAjuste = $scope.detalleJornada.Monto_Ajustes;
        montoAjuste = $filter('currency')(montoAjuste, "", 2);
        console.log(montoAjuste);

        //Variables del encabezado del PDF
        var nombreAgente = $scope.infoJornada.Nombre + ' ' + $scope.infoJornada.Apellidos;
        console.log(nombreAgente);
        var nombreUsuario = $scope.infoJornada.Nombre_Usuario;
        console.log(nombreUsuario);
        var inicioJornada = $filter('date')($scope.infoJornada.Fecha_Inicio, "yyyy-MM-dd HH:mm:ss");
        console.log(inicioJornada);
        var diasJornada = $scope.infoJornada.Dias_Jornada;
        console.log(diasJornada);
        console.log($scope.listaConteos);
        //Listas con los datos para la creacion de las tablas en el PDF
        var cantDocumentos = $scope.listaDocumentos.length;
        var cantRecibos = $scope.listaRecibos.length;
        var cantDepositos = $scope.listaDepositos.length;
        var cantConteos = $scope.listaConteos.length;
        var cantGastosRuta = $scope.listaGastosRuta.length;
        var cantBonificaciones = $scope.listaBonificaciones.length;
        //var cantStockTransfer  = $scope.listaStockTransfer.length;

        var listaDocumentosPDF = [];
        var listaRecibosPDF = [];
        var listaDepositosPDF = [];
        var listaConteosPDF = [];
        var listaGastosRutaPDF = [];
        var listaBonificacionesPDF = [];
        //var listaStockTransferPDF = [];
        
        var fechaCreacion = null;
        var montoTotal = null;

        var encabezadoDocumentos = [{ text: 'Código', color: '#898989', fontSize: 10 },
        { text: 'Fecha creación', color: '#898989', fontSize: 10 },
        { text: 'Cliente', color: '#898989', fontSize: 10 },
        { text: 'Tipo', color: '#898989', fontSize: 10 },
        { text: 'Pago', color: '#898989', fontSize: 10 },
        { text: 'Monto total', color: '#898989', fontSize: 10 }];
        var encabezadoRecibos = [{ text: 'Código', color: '#898989', fontSize: 10 },
        { text: 'Fecha recibido', color: '#898989', fontSize: 10 },
        { text: 'Tipo', color: '#898989', fontSize: 10 },
        { text: 'Monto total', color: '#898989', fontSize: 10 }];
        var encabezadoDepositos = [{ text: 'Código', color: '#898989', fontSize: 10 },
        { text: 'Núm. Referencia', color: '#898989', fontSize: 10 },
        { text: 'Fecha creación', color: '#898989', fontSize: 10 },
        { text: 'Banco', color: '#898989', fontSize: 10 },
        { text: 'Cuenta', color: '#898989', fontSize: 10 },
        { text: 'Monto total', color: '#898989', fontSize: 10 }];
        var encabezadoConteos = [{ text: 'Código', color: '#898989', fontSize: 10 },
        { text: 'Número conteo', color: '#898989', fontSize: 10 },
        { text: 'Producto', color: '#898989', fontSize: 10 },
        { text: 'Embalaje', color: '#898989', fontSize: 10 },
        { text: 'Cantidad cont.', color: '#898989', fontSize: 10 },
        { text: 'Cantidad inv.', color: '#898989', fontSize: 10 },
        { text: 'Diferencia', color: '#898989', fontSize: 10 }];
        var encabezadoGastosRuta = [{ text: 'Categoría', color: '#898989', fontSize: 10 },
        { text: 'Fecha creación', color: '#898989', fontSize: 10 },
        { text: 'Comentarios', color: '#898989', fontSize: 10 },
        { text: 'Monto', color: '#898989', fontSize: 10 },
        { text: 'Depósito', color: '#898989', fontSize: 10 }];
        var encabezadoBonificacion = [{ text: 'Documento', color: '#898989', fontSize: 10 },
        { text: 'Solicitado', color: '#898989', fontSize: 10 },
        { text: 'Bonificado', color: '#898989', fontSize: 10 },
        { text: 'Bonificacion', color: '#898989', fontSize: 10 },
        { text: 'Cant. B', color: '#898989', fontSize: 10 },
        { text: 'Cant. E', color: '#898989', fontSize: 10 },
        { text: 'Descuento (%)', color: '#898989', fontSize: 10 }];
        // var encabezadoStockTransfer = [{ text: 'Categoría', color: '#898989', fontSize: 10 },
        // { text: 'Fecha creación', color: '#898989', fontSize: 10 },
        // { text: 'Observaciones', color: '#898989', fontSize: 10 },
        // { text: 'Número de referencia', color: '#898989', fontSize: 10 },
        // { text: 'Monto Total', color: '#898989', fontSize: 10 }];

        listaDocumentosPDF.push(encabezadoDocumentos);
        listaRecibosPDF.push(encabezadoRecibos);
        listaDepositosPDF.push(encabezadoDepositos);
        listaConteosPDF.push(encabezadoConteos);
        listaGastosRutaPDF.push(encabezadoGastosRuta);
        listaBonificacionesPDF.push(encabezadoBonificacion);
        //listaStockTransferPDF.push(encabezadoStockTransfer);

        for (var i = 0; i < cantDocumentos; i++) {
            var lista = [];
            lista.push($scope.listaDocumentos[i].Codigo_Documento);
            fechaCreacion = $filter('date')($scope.listaDocumentos[i].Fecha_Creacion, "yyyy-MM-dd");
            lista.push(fechaCreacion);
            lista.push($scope.listaDocumentos[i].Codigo_Cliente);
            lista.push($scope.listaDocumentos[i].Nombre_Categoria_Documento);
            lista.push($scope.listaDocumentos[i].Nombre_Forma_Pago);
            montoTotal = $filter('currency')($scope.listaDocumentos[i].Monto_Total, "", 2);
            lista.push(montoTotal);
            listaDocumentosPDF.push(lista);
        }
        console.log(listaDocumentosPDF);

        for (var i = 0; i < cantRecibos; i++) {
            var lista = [];
            lista.push($scope.listaRecibos[i].Codigo_Recibo);
            fechaCreacion = $filter('date')($scope.listaRecibos[i].Fecha_Recibido, "yyyy-MM-dd");
            lista.push(fechaCreacion);
            lista.push($scope.listaRecibos[i].Nombre_Categoria_Recibo_Dinero);
            montoTotal = $filter('currency')($scope.listaRecibos[i].Monto_Total, "", 2);
            lista.push(montoTotal);
            listaRecibosPDF.push(lista);
        }
        console.log(listaRecibosPDF);

        for (var i = 0; i < cantDepositos; i++) {
            var lista = [];
            lista.push($scope.listaDepositos[i].Codigo);
            lista.push($scope.listaDepositos[i].Numero_Referencia);
            fechaCreacion = $filter('date')($scope.listaDepositos[i].Fecha_Creacion, "yyyy-MM-dd");
            lista.push(fechaCreacion);
            lista.push($scope.listaDepositos[i].Nombre_Banco);
            lista.push($scope.listaDepositos[i].Numero_Cuenta);
            montoTotal = $filter('currency')($scope.listaDepositos[i].Monto_Total, "", 2);
            lista.push(montoTotal);
            listaDepositosPDF.push(lista);
        }
        console.log(listaDepositosPDF);

        for (var i = 0; i < cantConteos; i++) {
            var lista = [];
            lista.push($scope.listaConteos[i].Codigo_Documento);
            lista.push($scope.listaConteos[i].Numero_Conteo);
            lista.push($scope.listaConteos[i].Nombre_Producto);
            lista.push($scope.listaConteos[i].Nombre_Embalaje);
            lista.push($scope.listaConteos[i].Cantidad_Solicitada);
            lista.push($scope.listaConteos[i].Cantidad_Inventario);
            lista.push($scope.listaConteos[i].Cantidad_Diferencia);
            listaConteosPDF.push(lista);
        }
        console.log(listaConteosPDF);

        for (var i = 0; i < cantGastosRuta; i++) {
            var lista = [];
            lista.push($scope.listaGastosRuta[i].Nombre_Gasto);
            fechaCreacion = $filter('date')($scope.listaGastosRuta[i].Fecha_Creacion, "yyyy-MM-dd");
            lista.push(fechaCreacion);
            lista.push($scope.listaGastosRuta[i].Comentarios);
            montoTotal = $filter('currency')($scope.listaGastosRuta[i].Monto, "", 2);
            lista.push(montoTotal);
            if ($scope.listaGastosRuta[i].Codigo_Deposito === "") {
                lista.push("SIN DEPÓSITO");
            }
            else {
                lista.push($scope.listaGastosRuta[i].Codigo_Deposito);
            }
            listaGastosRutaPDF.push(lista);
        }
        console.log(listaGastosRutaPDF);

        for (var i = 0; i < cantBonificaciones; i++) {
            var lista = [];
            lista.push($scope.listaBonificaciones[i].Codigo_Documento);
            lista.push($scope.listaBonificaciones[i].Producto_Solicitado);
            lista.push($scope.listaBonificaciones[i].Producto_Bonificado);
            lista.push($scope.listaBonificaciones[i].Nombre_Bonificacion);
            lista.push($scope.listaBonificaciones[i].Cantidad_Bonificada);
            lista.push($scope.listaBonificaciones[i].Cantidad_Entregada);
            lista.push($scope.listaBonificaciones[i].Porcentaje_Descuento);
            listaBonificacionesPDF.push(lista);
        }
        console.log(listaBonificacionesPDF);

        // for (var i = 0; i < cantStockTransfer; i++) {
        //     var lista = [];
        //     lista.push($scope.listaStockTransfer[i].Nombre_Categoria_Documento);
        //     fechaCreacion = $filter('date')($scope.listaStockTransfer[i].Fecha_Creacion, "yyyy-MM-dd");
        //     lista.push(fechaCreacion);
        //     lista.push($scope.listaStockTransfer[i].Observaciones);
        //     lista.push($scope.listaStockTransfer[i].Codigo_Documento);
        //     montoTotal = $filter('currency')($scope.listaStockTransfer[i].Monto_Total, "", 2);
        //     lista.push(montoTotal);
        //     listaStockTransferPDF.push(lista);
        // }
        // console.log(listaStockTransferPDF);

        console.log(montoAjuste);
        var doc = {
            content: [
                { text: objetoSesion.Nombre_Empresa.toUpperCase(), style: 'header' },
                { text: 'LIQUIDACION', style: 'subtitulo', margin: [0, 10] },
                { text: 'INFORMACION DEL AGENTE', style: 'justificado', margin: [0, 10] },
                {
                    ul: [
                        { text: 'AGENTE:' + '                            ' + nombreAgente, margin: [0, 2], fontSize: 12 },
                        { text: 'USUARIO:' + '                           ' + nombreUsuario, margin: [0, 2], fontSize: 12 },
                        { text: 'INICIO JORNADA:' + '            ' + inicioJornada, margin: [0, 2], fontSize: 12 },
                        { text: 'DÍAS JORNADA: ' + '              ' + diasJornada, margin: [0, 2], fontSize: 12 },
                        { text: 'ESTADO: ' + '                           ' + 'CERRADA', margin: [0, 2], fontSize: 12 }
                    ]
                },
                { text: 'Montos de la jornada', style: 'subtitulo', margin: [0, 10] },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*', '*', '*'],
                        body: [
                            [
                                { text: 'Facturas', color: '#898989', fontSize: 10 },
                                { text: 'Devoluciones', color: '#898989', fontSize: 10 },
                                { text: 'Canjes', color: '#898989', fontSize: 10 },
                                { text: 'Depósitos', color: '#898989', fontSize: 10 },
                                { text: 'Gastos en ruta', color: '#898989', fontSize: 10 }
                            ],
                            [
                                { text: montoFacturas, fontSize: 10 },
                                { text: montoDevoluciones, fontSize: 10 },
                                { text: montoCanjes, fontSize: 10 },
                                { text: montoDepositos, fontSize: 10 },
                                { text: montoGastosRuta, fontSize: 10 },
                            ]
                        ]
                    }
                },
                { text: 'Montos en recibos de dinero', style: 'subtitulo', margin: [0, 10] },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*', '*', '*'],
                        body: [
                            [
                                { text: 'Efectivo', color: '#898989', fontSize: 10 },
                                { text: 'Transferencia', color: '#898989', fontSize: 10 },
                                { text: 'Cheque', color: '#898989', fontSize: 10 },
                                { text: 'Múltiple', color: '#898989', fontSize: 10 },
                                { text: 'Monto ajustes', color: '#898989', fontSize: 10 }
                            ],
                            [
                                { text: montoEfectivo, fontSize: 10 },
                                { text: montoTransferencia, fontSize: 10 },
                                { text: montoCheque, fontSize: 10 },
                                { text: montoMultiple, fontSize: 10 },
                                { text: montoAjuste, fontSize: 10 }
                            ]
                        ]
                    }
                },
                { text: 'Documentos', style: 'subtitulo', margin: [0, 10] },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', 'auto', 'auto', 'auto', 'auto', '*'],
                        body: listaDocumentosPDF
                    }
                },
                { text: 'Bonificaciones', style: 'subtitulo', margin: [0, 10] },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                        body: listaBonificacionesPDF
                    }
                },
                { text: 'Recibos de dinero', style: 'subtitulo', margin: [0, 10] },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*', '*'],
                        body: listaRecibosPDF
                    }
                },
                { text: 'Depósitos', style: 'subtitulo', margin: [0, 10] },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', 'auto', 'auto', 'auto', 'auto', '*'],
                        body: listaDepositosPDF
                    }
                },
                // { text: 'Stock transfer', style: 'subtitulo', margin: [0, 10] },
                // {
                //     table: {
                //         headerRows: 1,
                //         widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
                //         body: listaStockTransferPDF
                //     }
                // },
                { text: 'Gastos en ruta', style: 'subtitulo', margin: [0, 10] },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', 'auto', '*', 'auto', 'auto'],
                        body: listaGastosRutaPDF
                    }
                },
                { text: 'Conteos', style: 'subtitulo', margin: [0, 20] },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'],
                        body: listaConteosPDF
                    }
                }
            ],

            styles: {
                header: {
                    fontSize: 22,
                    color: '#898989'
                },
                subtitulo: {
                    fontSize: 16,
                    color: '#898989'
                },
                justificado: {
                    alignment: 'justify'
                }
            }
        };
        pdfMake.createPdf(doc).download('test.pdf')
    }

    angular.element(document).ready(function () {
        $scope.obtenerInformacionJornada();
        $scope.obtenerConteos();
        $scope.obtenerDocumentosJornada();
        $scope.obtenerRecibosDineroJornada();
        $scope.obtenerDepositosJornada();
        $scope.obtenerGastosRutaJornada();
        $scope.obtenerBonificacionesJornada();
        //$scope.obtenerStockTransfer(); /** LISTAR LOS STOCK TRANSFER  */

        $timeout(function () {
            console.log($scope.infoJornada);
            if ($scope.infoJornada.Fecha_Finalizacion !== "1995-03-25T00:00:00") {
                $scope.jornadaFinalizada = true;
                $scope.obtenerDetalleJornada();
            }
            else {
                $scope.jornadaFinalizada = false;
            }
        }, 1000);
    });

});