app.controller('MotivosDeNoVentaCtrl', function ($scope, 
  $state, 
  $filter, 
  AppService_MotivosNoVenta) {

  $scope.listaMotivos = [];
  $scope.objetoMotivos = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Motivo: "" };

  $scope.Pagina_Actual = 0;
  $scope.Cantidad_Items = 10;

  $scope.Filtrar_Entidad = function () { return $filter('filter')($scope.listaMotivos, $scope.objetoMotivos.Filtro_Motivo); }
  $scope.Calcular_Paginacion = function () { return Math.ceil($scope.Filtrar_Entidad().length / $scope.Cantidad_Items); }

  $scope.obtenerMotivos = function () {
    var objetoEnviar = { peticion: JSON.stringify($scope.objetoMotivos) };
    AppService_MotivosNoVenta.HTTPObtenerMotivosNoVenta(objetoEnviar).then(function (response) {
      if (response.data.Respuesta !== null) {
        var respuesta = JSON.parse(response.data.Respuesta);
        $scope.listaMotivos = respuesta.resultado;
      }
    }, function (error) { console.log(error); });
  }

  $scope.irANuevoMotivoNoVenta = function () {
    $state.go('dashboard.registrarNuevoMotivoDeNoVenta');
  }

  $scope.editarMotivoNoVenta = function (Motivo_No_Venta) {
    $state.go('dashboard.editarMotivoNoVenta', { MtvEnviado: Motivo_No_Venta });
  }

  $scope.eliminarMotivoNoVenta = function (Motivo_No_Venta) {
    Motivo_No_Venta.Accion = 'e';
    var objetoEnviar = { peticion: JSON.stringify(Motivo_No_Venta) };
    AppService_MotivosNoVenta.HTTPProcesosMotivosNoVenta(objetoEnviar)
      .then(function (response) {
        if (response.data.Respuesta !== null) {
          var respuesta = JSON.parse(response.data.Respuesta);
          $scope.obtenerMotivos();
        }
      }, function (error) { console.log(error); });
  }

  angular.element(document).ready(function () {
    $scope.obtenerMotivos();
  })

});

app.controller('RegistrarNuevoMotivoDeNoVentaCtrl', function ($scope, 
  $state, 
  $timeout, 
  AppService_MotivosNoVenta) {

  console.log('controlador registrar motivo de no venta');
  console.log(objetoSesion);
  $scope.objetoMotivo = { ID_Empresa: objetoSesion.ID_Empresa };
  console.log($scope.objetoMotivo);

  $scope.nuevoMotivo = {
    Nombre_Motivo: "",
    Descripcion: "",
    FK_ID_Empresa: $scope.objetoMotivo.ID_Empresa,
    Eliminado: 0,
    Accion: 'i'
  };

  $scope.statusProceso = 0;

  function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

  $scope.agregarMotivo = function () {
    var jsonValidado = validarJSON($scope.nuevoMotivo);
    if (jsonValidado === true) {
      //espacios en blanco
      console.log('JSON incorrecto');
      console.log($scope.nuevoMotivo);
      $scope.statusProceso = 100;
    }
    else {
      var objetoEnviar = {
        peticion: JSON.stringify($scope.nuevoMotivo)
      };
      AppService_MotivosNoVenta.HTTPProcesosMotivosNoVenta(objetoEnviar).then(function (response) {
        console.log(response);
        $scope.statusProceso = response.data.Respuesta;
        if ($scope.statusProceso === "200") {
          $scope.nuevoMotivo = {
            Nombre_Motivo: "", Descripcion: "", FK_ID_Empresa: $scope.objetoMotivo.ID_Empresa, Eliminado: 0,
            Accion: 'i'
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

app.controller('EditarMotivoNoVentaCtrl', function ($scope, 
  $state, 
  $stateParams, 
  AppService_MotivosNoVenta) {
    
  $scope.Motivo = $stateParams.MtvEnviado;
  $scope.infoJornada = 0;

  $scope.actualizarMotivoNoVenta = function () {

    var objetoEnviar = {
      peticion: JSON.stringify($scope.Motivo)
    };

    AppService_MotivosNoVenta.HTTPProcesoActualizacionMotivosNoVenta(objetoEnviar)
      .then(function (response) {
        var res = JSON.parse(response.data.Respuesta);
        $scope.infoJornada = res.resultado[0];
        if ($scope.infoJornada.Respuesta == 200) {
          $state.go('dashboard.vistaMotivosDeNoVenta');
        }
      }, function (error) {
        console.log(error);
      });

  }

});