app.controller('CategoriasProductosCtrl', function ($scope, 
    $state, 
    AppService_Categorias) {

    $scope.listaCategorias = [];
    $scope.objetoCategoria = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Categoria: null };

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    $scope.Calcular_Paginacion = function () { return Math.ceil($scope.listaCategorias.length / $scope.Cantidad_Items); }

    $scope.obtenerCategoriasProductosInicio = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoCategoria) };
        AppService_Categorias.HTTPObtenerCategoriasProductosInicio(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaCategorias = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    $scope.obtenerCategoriasProductos = function () {
        $scope.listaCategorias = [];
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoCategoria) };
        AppService_Categorias.HTTPObtenerCategoriasProductos(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaCategorias = respuesta.resultado;
            }
        }, function (error) { console.log(error); });
    }

    $scope.buscarCategoriasEnter = function (keyEvent) { if (keyEvent.which === 13) { $scope.obtenerCategoriasProductos(); } }

    $scope.irANuevaCategoria = function () { $state.go('dashboard.registrarNuevaCategoriaProducto'); }
    $scope.editarCategoria = function (ID_Categoria) { $state.go('dashboard.editarCategoriaProducto', { ID_Categoria_Producto: ID_Categoria }); }

    angular.element(document).ready(function () {
        var jsonValidado = validarJSON(objetoSesion);
        if (jsonValidado === true) { $state.go('login'); }
        else { $scope.obtenerCategoriasProductosInicio(); }
    });

});

app.controller('RegistrarNuevaCategoriaProductoCtrl', function ($scope, 
    $state, 
    $timeout, 
    AppService_Productos,
    AppService_Categorias) {

    $scope.listaProductos = [];
    $scope.objetoCategoria = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Producto: null };
    $scope.statusProceso = 0;
    $scope.Lista_Productos_Seleccionados = {};
    $scope.Lista_Productos_Final = [];

    $scope.nuevaCategoria = { Nombre_Categoria_Producto: "", FK_ID_Empresa: objetoSesion.ID_Empresa, Accion: 'i' };

    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    $scope.Calcular_Paginacion = function () { return Math.ceil($scope.listaProductos.length / $scope.Cantidad_Items); }

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.obtenerProductos = function () {
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoCategoria) };
        AppService_Productos.HTTPObtenerProductos(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaProductos = respuesta.resultado;
                console.log($scope.listaProductos);
            }
        }, function (error) { console.log(error); });
    }

    $scope.obtenerProductosFiltro = function () {
        $scope.listaProductos = [];
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoCategoria) };
        AppService_Productos.HTTPObtenerProductosFiltro(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaProductos = respuesta.resultado;
                console.log($scope.listaProductos);
            }
        }, function (error) { console.log(error); });
    }

    $scope.obtenerProductosEnter = function (keyEvent) { if (keyEvent.which === 13) { $scope.obtenerProductosFiltro(); } }

    $scope.agregarCategoria = function () {
        console.log($scope.nuevaCategoria);
        var jsonValidado = validarJSON($scope.nuevaCategoria);
        if (jsonValidado === true) { $scope.statusProceso = 100; }
        else {
            for (var ID_Producto in $scope.Lista_Productos_Seleccionados) {
                if ($scope.Lista_Productos_Seleccionados[ID_Producto] === true) {
                    var json = { ID_Producto: parseInt(ID_Producto) };
                    $scope.Lista_Productos_Final.push(json);
                }
            }
            console.log($scope.Lista_Productos_Final);
            if ($scope.Lista_Productos_Final.length === 0) { $scope.statusProceso = 300; }
            else {
                $scope.nuevaCategoria.Lista_Productos = JSON.stringify($scope.Lista_Productos_Final);
                var objetoEnviar = { peticion: JSON.stringify($scope.nuevaCategoria) };
                console.log(objetoEnviar);
                AppService_Categorias.HTTPProcesosCategoriasProductos(objetoEnviar).then(function (response) {
                    console.log(response);
                    $scope.statusProceso = response.data.Respuesta;
                    console.log($scope.statusProceso);
                    if ($scope.statusProceso === "200") {
                        $scope.Lista_Productos_Seleccionados = {};
                        $timeout(function () { $scope.statusProceso = 0; $state.go('dashboard.vistaCategoriasProductos'); }, 2000);
                    }
                }, function (error) { console.log(error); });
            }
        }
    }

    angular.element(document).ready(function () { $scope.obtenerProductos(); });

});

app.controller('EditarCategoriaProductoCtrl', function ($scope, 
    $state, 
    $timeout, 
    $stateParams, 
    AppService_Productos,
    AppService_Categorias) {

    $scope.listaProductos = [];
    $scope.ID_Categoria_Producto = $stateParams.ID_Categoria_Producto;
    $scope.Objeto_Componente = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Producto: null };
    $scope.statusProceso = 0;
    $scope.Lista_Productos_Seleccionados = {};
    $scope.Lista_Productos_Final = [];

    $scope.Objeto_Categoria = { Nombre_Categoria_Producto: "", FK_ID_Empresa: objetoSesion.ID_Empresa, Accion: 'a', ID_Categoria_Producto: $scope.ID_Categoria_Producto };

    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    $scope.Calcular_Paginacion = function () { return Math.ceil($scope.listaProductos.length / $scope.Cantidad_Items); }

    function validarJSON(json) { for (member in json) { if (json[member] === null || json[member] === "") { return true; } } return false; }

    $scope.obtenerInformacionCategoria = function () {
        var objetoEnviar = { peticion: JSON.stringify({ ID_Categoria_Producto: $scope.ID_Categoria_Producto }) };
        AppService_Categorias.HTTPObtenerInformacionCategoriaProductoID(objetoEnviar).then(function (response) {
            var res = JSON.parse(response.data.Respuesta);
            console.log(res);
            $scope.Objeto_Categoria.Nombre_Categoria_Producto = res.resultado[0].Nombre_Categoria_Producto;
            $scope.Objeto_Categoria.Eliminado = res.resultado[0].Eliminado;
            $scope.listaProductos = res.resultado;
            var cantProductos = $scope.listaProductos.length;
            for (var i = 0; i < cantProductos; i++) { $scope.Lista_Productos_Seleccionados[$scope.listaProductos[i].ID_Producto] = true; }
        }, function (error) { console.log(error); });
    }

    $scope.obtenerProductosFiltro = function () {
        $scope.listaProductos = [];
        var objetoEnviar = { peticion: JSON.stringify($scope.Objeto_Componente) };
        AppService_Productos.HTTPObtenerProductosFiltro(objetoEnviar).then(function (response) {
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaProductos = respuesta.resultado;
                console.log($scope.listaProductos);
            }
        }, function (error) { console.log(error); });
    }

    $scope.obtenerProductosEnter = function (keyEvent) { if (keyEvent.which === 13) { $scope.obtenerProductosFiltro(); } }

    $scope.agregarCategoria = function () {
        console.log($scope.Objeto_Categoria);
        var jsonValidado = validarJSON($scope.Objeto_Categoria);
        if (jsonValidado === true) { $scope.statusProceso = 100; }
        else {
            for (var ID_Producto in $scope.Lista_Productos_Seleccionados) {
                if ($scope.Lista_Productos_Seleccionados[ID_Producto] === true) {
                    var json = { ID_Producto: parseInt(ID_Producto), Eliminado: false };
                    $scope.Lista_Productos_Final.push(json);
                }
                else {
                    var json = { ID_Producto: parseInt(ID_Producto), Eliminado: true };
                    $scope.Lista_Productos_Final.push(json);
                }
            }
            console.log($scope.Lista_Productos_Final);
            if ($scope.Lista_Productos_Final.length === 0) { $scope.statusProceso = 300; }
            else {
                $scope.Objeto_Categoria.Lista_Productos = JSON.stringify($scope.Lista_Productos_Final);
                var objetoEnviar = { peticion: JSON.stringify($scope.Objeto_Categoria) };
                console.log(objetoEnviar);
                AppService_Categorias.HTTPProcesosCategoriasProductos(objetoEnviar).then(function (response) {
                    $scope.statusProceso = response.data.Respuesta;
                    if ($scope.statusProceso === "200") {
                        $scope.Lista_Productos_Seleccionados = {};
                        $timeout(function () { $scope.statusProceso = 0; $state.go('dashboard.vistaCategoriasProductos'); }, 2000);
                    }
                }, function (error) { console.log(error); });
            }
        }
    }

    angular.element(document).ready(function () { $scope.obtenerInformacionCategoria(); });

});