var objetoSesion = { ID_Usuario: "", Nombre_Usuario: "", ID_Empresa: "", Nombre_Empresa: "", Estado: "" };

var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'naif.base64']);

var f_g = new FormData();

/*app.directive('ngFiles', ['$parse', function ($parse) {

  function fn_link(scope, element, attrs) {
      var onChange = $parse(attrs.ngFiles);
      element.on('change', function (event) {
          onChange(scope, { $files: event.target.files });
      });
  };

  return {
      link: fn_link
  }
} ])*/

/* CONTROLADORES */
app.controller('DashboardCtrl', function ($scope, 
  $state, 
  AppServiceLG) {

  function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

  $scope.State_Documentos = function () { $state.go('dashboard.vistaDocumentos', { ID_Categoria_Documento: null, Texto_Busqueda: "" }); }

  $scope.cerrarSesion = function () {
    var objetoEnviar = { peticion: JSON.stringify(objetoSesion) };
    AppServiceLG.HTTPCerrarSesion(objetoEnviar).then(function (response) {
      var res = response.data.Respuesta;
      if (res === "200") { $state.go('login'); }
    }, function (error) { console.log(error); });
  }

  angular.element(document).ready(function () {
    var jsonValidado = validarJSON(objetoSesion);
    if (jsonValidado === true) { $state.go('login'); }
  });
})

app.controller('PrincipalCtrl', function ($scope, 
  $state, 
  AppServiceDB) {

  $scope.informacionDashboard = { Facturas_Pendientes: null, Cantidad_Clientes: null, Cantidad_Rutas: null, Cantidad_Jornadas: null };

  $scope.meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];
  $scope.listaFacturasMensual = null;
  $scope.montosFacturas = null;
  $scope.montosRecibosDinero = null;

  function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

  $scope.obtenerCantidadFacturasPendientes = function () {
    var objetoEnviar = { peticion: JSON.stringify(objetoSesion) };
    AppServiceDB.HTTPObtenerCantidadFacturasPendientes(objetoEnviar).then(function (response) {
      var res = JSON.parse(response.data.Respuesta);
      $scope.informacionDashboard.Facturas_Pendientes = res.resultado[0].Facturas_Pendientes;
    }, function (error) { console.log(error); });
  }

  $scope.obtenerCantidadClientesActivos = function () {
    var objetoEnviar = { peticion: JSON.stringify(objetoSesion) };
    AppServiceDB.HTTPObtenerCantidadClientesActivos(objetoEnviar).then(function (response) {
      var res = JSON.parse(response.data.Respuesta);
      $scope.informacionDashboard.Cantidad_Clientes = res.resultado[0].Cantidad_Clientes;
    }, function (error) {
      console.log(error);
    });
  }

  $scope.obtenerCantidadRutasActivas = function () {
    var objetoEnviar = { peticion: JSON.stringify(objetoSesion) };
    AppServiceDB.HTTPObtenerCantidadRutasActivas(objetoEnviar).then(function (response) {
      var res = JSON.parse(response.data.Respuesta);
      $scope.informacionDashboard.Cantidad_Rutas = res.resultado[0].Rutas_Activas;
    }, function (error) {
      console.log(error);
    });
  }

  $scope.obtenerCantidadJornadasActivas = function () {
    AppServiceDB.HTTPObtenerCantidadJornadasActivas().then(function (response) {
      var res = JSON.parse(response.data.Respuesta);
      $scope.informacionDashboard.Cantidad_Jornadas = res.resultado[0].Jornadas_Activas;
    }, function (error) {
      console.log(error);
    });
  }

  $scope.obtenerMontosFacturas = function () {
    var objetoEnviar = { peticion: JSON.stringify(objetoSesion) };
    AppServiceDB.HTTPObtenerMontosFacturas(objetoEnviar).then(function (response) {
      var res = JSON.parse(response.data.Respuesta);
      $scope.montosFacturas = res.resultado[0];
      var ctx = document.getElementById("imagen2").getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ["Entregado", "Sin pagar"],
          datasets: [{
            label: 'Facturaaaas',
            data: [$scope.montosFacturas.Monto, $scope.montosFacturas.Saldo],
            backgroundColor: [
              '#8CBC4F', '#C44441'
            ],
            borderColor: [
              '#8CBC4F', '#C44441'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }, function (error) {
      console.log(error);
    });
  }


  $scope.obtenerCantidadFacturasMensuales = function () {
    var fechaActual = new Date();
    var annoActual = fechaActual.getFullYear();
    var objetoEnviar = { peticion: JSON.stringify({ ID_Empresa: objetoSesion.ID_Empresa, Anno_Actual: annoActual }) };
    AppServiceDB.HTTPObtenerCantidadFacturasMensual(objetoEnviar).then(function (response) {
      var res = JSON.parse(response.data.Respuesta);
      if (res === null) {
        console.log('La respuesta es vacia');
      }
      else if (res.resultado.length > 0) {
        $scope.listaFacturasMensual = res.resultado;
        var listaMeses = [];
        var listaFacturas = [];
        var listaColores = [];
        var listaBaseColores = ['#1D73AA', '#8BAAD1', '#FEEC89', '#7A5892', '#009AB2', '#F48533', '#C44441', '#7AC36A', '#A86B91', '#5A9BD4', '#CE7058', '#8CBC4F'];
        var tamListaMeses = $scope.listaFacturasMensual.length;
        for (var i = 0; i < tamListaMeses; i++) {
          if ($scope.listaFacturasMensual[i].Mes === 1) {
            listaMeses.push("Enero");
            listaFacturas.push($scope.listaFacturasMensual[i].Facturas_Mes);
            listaColores.push(listaBaseColores[i]);
          }
          else if ($scope.listaFacturasMensual[i].Mes === 2) {
            listaMeses.push("Febrero");
            listaFacturas.push($scope.listaFacturasMensual[i].Facturas_Mes);
            listaColores.push(listaBaseColores[i]);
          }
          else if ($scope.listaFacturasMensual[i].Mes === 3) {
            listaMeses.push("Marzo");
            listaFacturas.push($scope.listaFacturasMensual[i].Facturas_Mes);
            listaColores.push(listaBaseColores[i]);
          }
          else if ($scope.listaFacturasMensual[i].Mes === 4) {
            listaMeses.push("Abril");
            listaFacturas.push($scope.listaFacturasMensual[i].Facturas_Mes);
            listaColores.push(listaBaseColores[i]);
          }
          else if ($scope.listaFacturasMensual[i].Mes === 5) {
            listaMeses.push("Mayo");
            listaFacturas.push($scope.listaFacturasMensual[i].Facturas_Mes);
            listaColores.push(listaBaseColores[i]);
          }
          else if ($scope.listaFacturasMensual[i].Mes === 6) {
            listaMeses.push("Junio");
            listaFacturas.push($scope.listaFacturasMensual[i].Facturas_Mes);
            listaColores.push(listaBaseColores[i]);
          }
          else if ($scope.listaFacturasMensual[i].Mes === 7) {
            listaMeses.push("Julio");
            listaFacturas.push($scope.listaFacturasMensual[i].Facturas_Mes);
            listaColores.push(listaBaseColores[i]);
          }
          else if ($scope.listaFacturasMensual[i].Mes === 8) {
            listaMeses.push("Agosto");
            listaFacturas.push($scope.listaFacturasMensual[i].Facturas_Mes);
            listaColores.push(listaBaseColores[i]);
          }
          else if ($scope.listaFacturasMensual[i].Mes === 9) {
            listaMeses.push("Setiembre");
            listaFacturas.push($scope.listaFacturasMensual[i].Facturas_Mes);
            listaColores.push(listaBaseColores[i]);
          }
          else if ($scope.listaFacturasMensual[i].Mes === 10) {
            listaMeses.push("Octubre");
            listaFacturas.push($scope.listaFacturasMensual[i].Facturas_Mes);
            listaColores.push(listaBaseColores[i]);
          }
          else if ($scope.listaFacturasMensual[i].Mes === 11) {
            listaMeses.push("Noviembre");
            listaFacturas.push($scope.listaFacturasMensual[i].Facturas_Mes);
            listaColores.push(listaBaseColores[i]);
          }
          else if ($scope.listaFacturasMensual[i].Mes === 12) {
            listaMeses.push("Diciembre");
            listaFacturas.push($scope.listaFacturasMensual[i].Facturas_Mes);
            listaColores.push(listaBaseColores[i]);
          }
        }

        var ctx = document.getElementById("imagen1").getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: listaMeses,
            datasets: [{
              label: 'Facturas mensuales',
              data: listaFacturas,
              backgroundColor: listaColores,
              borderColor: listaColores,
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }
      else {
        console.log('sin informacion de la consulta');
      }
    }, function (error) {
      console.log(error);
    });
  }

  $scope.obtenerMontosRecibosDinero = function () {
    var fechaActual = new Date();
    var annoActual = fechaActual.getFullYear();
    var mesActual = fechaActual.getMonth();
    var objetoEnviar = { peticion: JSON.stringify({ Mes_Actual: mesActual, Anno_Actual: annoActual }) };
    AppServiceDB.HTTPObtenerMontosRecibosDinero(objetoEnviar).then(function (response) {
      var res = JSON.parse(response.data.Respuesta);
      if (res.resultado.length > 0) {
        $scope.montosRecibosDinero = res.resultado[0];
        var ctx = document.getElementById("imagen3").getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'horizontalBar',
          data: {
            labels: ["Efectivo", "Transferencia", "Cheque"],
            datasets: [{
              label: 'Recibos de dinero',
              data: [$scope.montosRecibosDinero.Monto_Efectivo, $scope.montosRecibosDinero.Monto_Transferencia, $scope.montosRecibosDinero.Monto_Cheque],
              backgroundColor: ['#5A9BD4', '#CE7058', '#009AB2'],
              borderColor: ['#5A9BD4', '#CE7058', '#009AB2'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false
          }
        });
      }
    }, function (error) {
      console.log(error);
    });
  }

  angular.element(document).ready(function () {

    var jsonValidado = validarJSON(objetoSesion);
    if (jsonValidado === true) {
      $state.go('login');
    }
    else {
      $scope.obtenerCantidadFacturasPendientes();
      $scope.obtenerCantidadClientesActivos();
      $scope.obtenerCantidadRutasActivas();
      $scope.obtenerCantidadJornadasActivas();
      $scope.obtenerCantidadFacturasMensuales();
      $scope.obtenerMontosFacturas();
      $scope.obtenerMontosRecibosDinero();
    }
  });
})

app.controller('DepositosCtrl', function ($scope, 
  $state, 
  $timeout) {

  $scope.data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 }, { id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }, { id: 15 }];
  $scope.vistaPor = 10;
  $scope.totalItems = $scope.data.length;
  $scope.paginaActual = 1;
  $scope.itemsPorPagina = $scope.vistaPor;

  $scope.setItemsPerPage = function (num) {
    $scope.itemsPorPagina = num;
    $scope.paginaActual = 1;
  }

  $scope.pageChanged = function () {
    console.log('Page changed to: ' + $scope.paginaActual);
  }

})

app.controller('RegistrarNuevaCuentaCtrl', function ($scope, 
  $state, 
  $timeout, 
  AppService_Bancos,
  AppService_Cuentas, 
  AppService_Equivalencias,
  AppService_Monedas) {
  console.log('cargando controlador registro de descuento');

  $scope.listaBancos = [];
  $scope.listaMonedas = [];
  console.log(objetoSesion);
  $scope.objetoCuenta = { ID_Empresa: objetoSesion.ID_Empresa };
  console.log($scope.objetoCuenta);

  $scope.nuevaCuenta = {
    Numero_Cuenta: "",
    FK_ID_Empresa: $scope.objetoCuenta.ID_Empresa,
    FK_ID_Banco: "",
    FK_ID_Moneda: "",
    Eliminado: 0,
    Accion: 'i'
  };

  $scope.statusProceso = 0;

  function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

  $scope.obtenerBancos = function () {
    var objetoEnviar = {
      peticion: JSON.stringify($scope.objetoCuenta)
    };
    console.log(objetoEnviar);

    AppService_Bancos.HTTPObtenerBancos(objetoEnviar).then(function (response) {
      console.log(response);
      if (response.data.Respuesta === null) {
        console.log('BANCOS NULL');
      }
      else {
        var respuesta = JSON.parse(response.data.Respuesta);
        console.log(respuesta.resultado.length);
        $scope.listaBancos = respuesta.resultado;
        var total = $scope.listaBancos.length;
        console.log($scope.listaBancos);
        console.log('Total items: ' + total);
      }

    }, function (error) {
      console.log(error);
    });
  }

  $scope.obtenerMonedas = function () {
    AppService_Monedas.HTTPObtenerMonedas().then(function (response) {
      console.log(response);
      if (response.data.Respuesta === null) {
        console.log('Monedas NULL');
      }
      else {
        var respuesta = JSON.parse(response.data.Respuesta);
        console.log(respuesta.resultado.length);
        $scope.listaMonedas = respuesta.resultado;
        var total = $scope.listaMonedas.length;
        console.log($scope.listaMonedas);
        console.log('Total items: ' + total);
      }

    }, function (error) {
      console.log(error);
    });
  }

  $scope.agregarCuenta = function () {
    console.log($scope.nuevaCuenta);
    var jsonValidado = validarJSON($scope.nuevaCuenta);
    if (jsonValidado === true) {
      //espacios en blanco
      console.log('JSON incorrecto');
      console.log($scope.nuevaCuenta);
      $scope.statusProceso = 100;
    }
    else {
      var objetoEnviar = {
        peticion: JSON.stringify($scope.nuevaCuenta)
      };
      console.log(objetoEnviar);
      AppService_Cuentas.HTTPProcesosCuentas(objetoEnviar).then(function (response) {
        console.log(response);
        $scope.statusProceso = response.data.Respuesta;
        if ($scope.statusProceso === "200") {
          $scope.nuevaCuenta = {
            Numero_Cuenta: "", FK_ID_Empresa: $scope.objetoCuenta.ID_Empresa, FK_ID_Banco: "", FK_ID_Moneda: "",
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

  angular.element(document).ready(function () {
    $scope.obtenerBancos();
    $scope.obtenerMonedas();
  });

})

app.controller('RegistrarNuevaEquivalenciaCtrl', function ($scope, 
  $state, 
  $timeout, 
  AppService_Equivalencias,
  AppService_Monedas) {
  console.log('cargando controlador registro de equivalencia');

  $scope.listaMonedas = [];
  console.log(objetoSesion);
  $scope.objetoEquivalencia = { ID_Empresa: objetoSesion.ID_Empresa };
  console.log($scope.objetoEquivalencia);

  $scope.nuevaEquivalencia = {
    Monto: "",
    FK_ID_Empresa: $scope.objetoEquivalencia.ID_Empresa,
    FK_ID_Moneda_Origen: "",
    FK_ID_Moneda_Destino: "",
    Eliminado: 0,
    Accion: 'i'
  };

  $scope.statusProceso = 0;

  function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

  $scope.obtenerMonedas = function () {
    AppService_Monedas.HTTPObtenerMonedas().then(function (response) {
      console.log(response);
      if (response.data.Respuesta === null) {
        console.log('Monedas NULL');
      }
      else {
        var respuesta = JSON.parse(response.data.Respuesta);
        console.log(respuesta.resultado.length);
        $scope.listaMonedas = respuesta.resultado;
        var total = $scope.listaMonedas.length;
        console.log($scope.listaMonedas);
        console.log('Total items: ' + total);
      }

    }, function (error) {
      console.log(error);
    });
  }

  $scope.agregarEquivalencia = function () {
    console.log($scope.nuevaEquivalencia);
    var jsonValidado = validarJSON($scope.nuevaEquivalencia);
    if (jsonValidado === true) {
      //espacios en blanco
      console.log('JSON incorrecto');
      console.log($scope.nuevaEquivalencia);
      $scope.statusProceso = 100;
    }
    else {
      if ($scope.nuevaEquivalencia.FK_ID_Moneda_Origen === $scope.nuevaEquivalencia.FK_ID_Moneda_Destino) {
        console.log('No se permiten iguales');
        $scope.statusProceso = 300;
      }
      else {
        var objetoEnviar = {
          peticion: JSON.stringify($scope.nuevaEquivalencia)
        };
        console.log(objetoEnviar);
        AppService_Equivalencias.HTTPProcesosEquivalencias(objetoEnviar).then(function (response) {
          console.log(response);
          $scope.statusProceso = response.data.Respuesta;
          if ($scope.statusProceso === "200") {
            $scope.nuevaEquivalencia = {
              Monto: "", FK_ID_Empresa: $scope.objetoEquivalencia.ID_Empresa, FK_ID_Moneda_Origen: "",
              FK_ID_Moneda_Destino: "", Eliminado: 0, Accion: 'i'
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
  }

  angular.element(document).ready(function () {
    $scope.obtenerMonedas();
  });

})

app.controller('RegistrarNuevoInventarioAgenteCtrl', function ($scope, 
  $state, 
  $stateParams, 
  AppService_Bodegas,
  AppService_Inventarios) {

  console.log('cargando controlador registro de inventario agente');

  $scope.ID_Usuario = parseInt($stateParams.ID_Usuario);
  console.log('ID Usuario:' + $scope.ID_Usuario);

  $scope.listaInventarioUsuario = [];
  $scope.listaBodegas = [];
  $scope.vistaPor = 10;
  $scope.paginaActual = 1;
  $scope.itemsPorPagina = $scope.vistaPor;

  console.log(objetoSesion);
  $scope.objetoInventario = { ID_Empresa: objetoSesion.ID_Empresa, ID_Usuario: $scope.ID_Usuario, ID_Bodega_Seleccionada: null };
  console.log($scope.objetoInventario);

  $scope.setItemsPerPage = function (num) {
    $scope.itemsPorPagina = num;
    $scope.paginaActual = 1;
  }

  $scope.pageChanged = function () {
    console.log('Page changed to: ' + $scope.paginaActual);
  }

  $scope.obtenerBodegasUsuario = function () {
    var objetoEnviar = {
      peticion: JSON.stringify($scope.objetoInventario)
    };
    console.log(objetoEnviar);
    AppService_Bodegas.HTTPObtenerBodegasUsuario(objetoEnviar).then(function (response) {
      console.log(response);
      if (response.data.Respuesta === null) {
        console.log('Bodegas NULL');
      }
      else {
        var respuesta = JSON.parse(response.data.Respuesta);
        console.log(respuesta.resultado.length);
        $scope.listaBodegas = respuesta.resultado;
        console.log($scope.listaBodegas);
      }
    }, function (error) {
      console.log(error);
    });
  }

  $scope.obtenerInventarioUsuario = function () {
    console.log($scope.objetoInventario);
    var objetoEnviar = {
      peticion: JSON.stringify($scope.objetoInventario)
    };
    console.log(objetoEnviar);
    AppService_Inventarios.HTTPObtenerInventarioUsuario(objetoEnviar).then(function (response) {
      console.log(response);
      if (response.data.Respuesta === null) {
        console.log('Inventario NULL');
      }
      else {
        var respuesta = JSON.parse(response.data.Respuesta);
        console.log(respuesta.resultado.length);
        $scope.listaInventarioUsuario = respuesta.resultado;
        console.log($scope.listaInventarioUsuario);
      }
    }, function (error) {
      console.log(error);
    });
  }

  angular.element(document).ready(function () {
    $scope.obtenerBodegasUsuario();
  });

})

app.controller('RegistrarNuevaListaPreciosCtrl', function ($scope, 
  $state, 
  $filter, 
  $timeout, 
  AppService_Precios,
  AppService_Productos,
  AppService_Monedas) {

  $scope.listaMonedas = [];
  $scope.listaProductos = [];
  $scope.vistaPor = 10;
  $scope.paginaActual = 1;
  $scope.itemsPorPagina = $scope.vistaPor;
  console.log(objetoSesion);
  $scope.objetoListaPrecios = { ID_Empresa: objetoSesion.ID_Empresa };
  console.log($scope.objetoListaPrecios);

  $scope.nuevaListaPrecios = {
    Nombre_Lista_Precios: "",
    Codigo_Lista_Precios: "",
    Lista_Precios: {},
    Fecha_Inicio: "",
    Fecha_Finalizacion: "",
    FK_ID_Empresa: $scope.objetoListaPrecios.ID_Empresa,
    FK_ID_Moneda: "",
    Eliminado: 0,
    Accion: 'i'
  };

  $scope.statusProceso = 0;

  function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

  $scope.setItemsPerPage = function (num) {
    $scope.itemsPorPagina = num;
    $scope.paginaActual = 1;
  }

  $scope.pageChanged = function () {
    console.log('Page changed to: ' + $scope.paginaActual);
  }

  $scope.obtenerMonedas = function () {
    AppService_Monedas.HTTPObtenerMonedas().then(function (response) {
      console.log(response);
      if (response.data.Respuesta === null) {
        console.log('Monedas NULL');
      }
      else {
        var respuesta = JSON.parse(response.data.Respuesta);
        console.log(respuesta.resultado.length);
        $scope.listaMonedas = respuesta.resultado;
        var total = $scope.listaMonedas.length;
        console.log($scope.listaMonedas);
        console.log('Total items: ' + total);
      }

    }, function (error) {
      console.log(error);
    });
  }

  $scope.obtenerProductos = function () {
    var objetoEnviar = {
      peticion: JSON.stringify($scope.objetoListaPrecios)
    };
    console.log(objetoEnviar);
    AppService_Productos.HTTPObtenerProductos(objetoEnviar).then(function (response) {
      console.log(response);
      if (response.data.Respuesta === null) {
        console.log('PRODUCTOS NULL');
      }
      else {
        var respuesta = JSON.parse(response.data.Respuesta);
        console.log(respuesta.resultado.length);
        $scope.listaProductos = respuesta.resultado;
        $scope.totalItems = $scope.listaProductos.length;
        console.log($scope.listaProductos);
        console.log('Total items: ' + $scope.totalItems);
      }
    }, function (error) {
      console.log(error);
    });
  }

  $scope.agregarListaPrecios = function () {

    console.log($scope.nuevaListaPrecios);
    var jsonValidado = validarJSON($scope.nuevaListaPrecios);
    if (jsonValidado === true) {
      //espacios en blanco
      console.log('JSON incorrecto');
      console.log($scope.nuevaListaPrecios);
      $scope.statusProceso = 100;
    }
    else {
      var Fecha_Inicio = $filter('date')($scope.nuevaListaPrecios.Fecha_Inicio, "yyyy-MM-dd HH:mm:ss");
      var Fecha_Finalizacion = $filter('date')($scope.nuevaListaPrecios.Fecha_Finalizacion, "yyyy-MM-dd HH:mm:ss");
      console.log($scope.nuevaListaPrecios);
      if ($scope.nuevaListaPrecios.Fecha_Inicio > $scope.nuevaListaPrecios.Fecha_Finalizacion) {
        $scope.statusProceso = 300;
      }
      else {
        /*for(var i = 0; i < $scope.listaProductos.length; i++)
        {
          var ID_Producto_Actual = $scope.listaProductos[i].ID_Producto;
          console.log(ID_Producto_Actual);
          var precio = document.getElementById(ID_Producto_Actual).value;
          console.log(precio);
          if(angular.equals(precio,"") || angular.equals(precio,null))
          {
            console.log('El precio del producto es vacio');
          }
          else
          {
            $scope.nuevaListaPrecios.Lista_Precios[ID_Producto_Actual] = parseInt(precio);
          }
        }*/

        if (angular.equals({}, $scope.nuevaListaPrecios.Lista_Precios)) {
          console.log('La lista de precios es vacia');
          $scope.statusProceso = 400;
        }
        else {
          console.log('Lista de precios bien');
          $scope.nuevaListaPrecios.Fecha_Inicio = Fecha_Inicio;
          $scope.nuevaListaPrecios.Fecha_Finalizacion = Fecha_Finalizacion;
          var Lista_Precios_String = JSON.stringify($scope.nuevaListaPrecios.Lista_Precios);
          $scope.nuevaListaPrecios.Lista_Precios = Lista_Precios_String;
          console.log($scope.nuevaListaPrecios);
          var objetoEnviar = {
            peticion: JSON.stringify($scope.nuevaListaPrecios)
          };
          console.log(objetoEnviar);
          AppService_Precios.HTTPProcesosListasPrecios(objetoEnviar).then(function (response) {
            console.log(response);
            $scope.statusProceso = response.data.Respuesta;
            if ($scope.statusProceso === "200") {
              $scope.nuevaListaPrecios = {
                Nombre_Lista_Precios: "", Codigo_Lista_Precios: "", Lista_Precios: {}, Fecha_Inicio: "",
                Fecha_Finalizacion: "", FK_ID_Empresa: $scope.objetoListaPrecios.ID_Empresa, FK_ID_Moneda: "", Eliminado: 0, Accion: 'i'
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
      console.log($scope.nuevaListaPrecios);
    }
    /*console.log($scope.nuevaListaPrecios);
    if(angular.equals({}, $scope.nuevaListaPrecios.Lista_Precios))
    {
      console.log('emptyyyyyyyy');
    }
    else
    {
      console.log('noooooooo');
    }*/
  }

  angular.element(document).ready(function () {
    $scope.obtenerMonedas();
    $scope.obtenerProductos();
  });

})

app.controller('RegistrarNuevoPermisoCtrl', function ($scope) {
  console.log('cargando controlador registro de permiso');
})

app.controller('RegistrarNuevoFormatoImpresionCtrl', function ($scope, $state) {

})

app.controller('RegistrarNuevoParametroGeneralCtrl', function ($scope, $state) {

})

/******************************************************
*CONTROLADORES PARA EDITAR LA INFORMACION
*******************************************************/

app.controller('EditarBancoCtrl', function ($scope, $state) {

})

app.controller('EditarBodegaCtrl', function ($scope, $state) {

})

app.controller('EditarClienteCtrl', function ($scope, $state) {

})

app.controller('EditarCuentaCtrl', function ($scope, $state) {

})

app.controller('EditarEquivalenciaCtrl', function ($scope, $state) {

})

 /**
  * Función para imprimir en consola
  * @param {Object} obj - {title:'titulo',contenido:contenido}
  * @param {string} obj.title - el titulo del contenido
  * @param {Object} obj.contenido - el objeto en contenido a imprimir en consola
  */
function myLog(obj) {
  console.log('---------------------------------------------------------------------------------------');
  console.log(obj.title);
  console.log('---------------------------------------------------------------------------------------');
  console.log(obj.contenido);
  console.log('---------------------------------------------------------------------------------------');
}// FUNTION

var formdata_g = null;