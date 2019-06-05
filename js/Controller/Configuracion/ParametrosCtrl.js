app.controller('ParametrosCtrl', function ($scope, 
    $state, 
    $timeout, 
    $filter, 
    AppService_Parametros,
    AppService_Jornadas) {

    $scope.objetoParametro = { ID_Empresa: objetoSesion.ID_Empresa, Filtro_Parametros: "" };
    $scope.listaParametros = [];
    $scope.listaFormatosExcel = [];
    $scope.Lista_Parametros_Seleccionados = {};
    $scope.statusProceso = 0;
    $scope.uploader = null;
    $scope.archuivoString = null;

    $scope.Pagina_Actual = 0;
    $scope.Cantidad_Items = 10;

    $scope.myfile = {
        filesize: null, //54836, /* bytes */
        filetype: null, //"image/jpeg",
        filename: null, //"profile.jpg",
        base64: null, //"/9j/4AAQSkZJRgABAgAAAQABAAD//gAEKgD/4gIctcwIQA..."
        fileFormat: 0 //forrmato de archivo
    }

    $scope.FormatoDescarga = "";

    //$.scope.formData = new FormData();

    $scope.getTheFiles = function ($files) {
        myLog({ title: '$files', contenido: $files });
        for (var x = 0; x < $files.length; ++x) {
            formdata.append("Files", $files[x]);
        }





        /*angular.forEach($files, function (value, key) {
          $scope.myfile.filesize = value.size;
          $scope.myfile.filetype = value.type;
          $scope.myfile.filename = value.name;
          myLog({ title: 'VALOR', contenido: value });
          myLog({ title: 'LLAVE', contenido: key });
          $scope.formdata.append(key, value);
          formdata_g.append('Files', value);
          /*AppService_Jornadas.HTTP_subir_archivos_al_Servidor($scope.formdata).then( function(success) {
            myLog({ title: 'SUCCESS :: ...RESPUESTA DEL SERVER...', contenido: success });
          }, function(error) {
            myLog({ title: 'ERROR :: ...RESPUESTA DEL SERVER...', contenido: error });
          } );
        });*/
    }

    $scope.descargarFile = function (_ID_DOCUMENTO_) {

        var objetoEnviar2 = { peticion: _ID_DOCUMENTO_ };
        myLog({ title: 'OBJETO A ENVIAR PARA OBTENER EL FILE', contenido: objetoEnviar2 });
        AppService_Jornadas.HTTP_descargar_archivos_al_Servidor(objetoEnviar2);
    }// FUNCTION

    $scope.EsperandoRespuesta = false;

    $scope.subirFile = function () {

        if ($scope.myfile.fileFormat != 0 && $scope.myfile.fileFormat != undefined) {
            $scope.EsperandoRespuesta = true;
            //sfa/subir/archivo/Excel
            myLog({ title: 'INFO DEL ARCHIVO A SUBIR', contenido: $scope.myfile });
            var archivoEnviar = {
                Nombre: $scope.myfile.filename,
                ArchivoStr64: $scope.myfile.base64,
                ArchivoTipo: $scope.myfile.filetype,
                ArchivoTammanno: $scope.myfile.filesize,
                Formato: $scope.myfile.fileFormat
            };
            myLog({ title: 'FILE FORMATO SERVER', contenido: archivoEnviar });
            var objEnvio = {
                peticion: JSON.stringify([archivoEnviar])
            }
            myLog({ title: 'OJETO ENVIO AL SERVIDOR', contenido: objEnvio });

            //myLog({ title: 'FOMRULARIO', contenido: formdata });
            /*f_g = formData;*/

            $.notify("Enviando archivo... ", "warning");

            AppService_Jornadas.HTTP_subir_archivos_al_Servidor(objEnvio).then(function (success) {
                myLog({ title: 'SUCCESS :: ...RESPUESTA DEL SERVER...', contenido: success });
                if (success.status == 200) {
                    $scope.myfile.filesize = null;
                    $scope.myfile.filetype = null;
                    $scope.myfile.filename = null;
                    $scope.myfile.base64 = null;
                    $scope.myfile.fileFormat = 0;
                    $scope.EsperandoRespuesta = false;
                    $.notify("Documento Enviado Correctamente !!! ", "success");
                } else {
                    $.notify("El documento no se pudo ser enviado !!!", "error");
                }
            }, function (error) {
                $.notify("El documento no se pudo ser enviado !!!", "error");
                myLog({ title: 'ERROR :: ...RESPUESTA DEL SERVER...', contenido: error });
            });

        }
        else {
            $.notify("Seleccione el formato !!!", "error");
        }
    }// FUCNTIO

    $scope.Filtrar_Entidad = function () { return $filter('filter')($scope.listaParametros, $scope.objetoParametro.Filtro_Parametros); }
    $scope.Calcular_Paginacion = function () { return Math.ceil($scope.Filtrar_Entidad().length / $scope.Cantidad_Items); }

    $scope.ObtenerParametros = function () {
        var objetoEnviar2 = { peticion: JSON.stringify({ "Codigo_Excel": "0" }) };
        AppService_Parametros.HTTPObtenerFormatosExcel(objetoEnviar2).then(function (response) {
            if (response.data.Respuesta !== null) {
                $scope.listaFormatosExcel = JSON.parse(response.data.Respuesta);
                myLog({ title: 'CONTENIDO DE LOS FORMATOS EXCEL', contenido: response });
            }
        });
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoParametro) };
        AppService_Parametros.HTTPObtenerParametros(objetoEnviar).then(function (response) {
            myLog({ title: 'CONTENIDO DE LOS PARAMETROS', contenido: response });
            if (response.data.Respuesta !== null) {
                var respuesta = JSON.parse(response.data.Respuesta);
                $scope.listaParametros = respuesta.resultado;
                myLog({ title: 'CONTENIDO DE LOS PARAMETROS', contenido: respuesta });
                for (var i = 0; i < $scope.listaParametros.length; i++) {
                    if ($scope.listaParametros[i].Tipo_Parametro === 'BOOLEAN') {
                        console.log('El parametro: ' + $scope.listaParametros[i].Nombre_Parametro + ' es boolean');
                        if ($scope.listaParametros[i].Valores === 'true') { $scope.Lista_Parametros_Seleccionados[$scope.listaParametros[i].ID_Parametro] = true; }
                        else { $scope.Lista_Parametros_Seleccionados[$scope.listaParametros[i].ID_Parametro] = false; }
                    }
                    else if ($scope.listaParametros[i].Tipo_Parametro === 'INTEGER') {
                        $scope.Lista_Parametros_Seleccionados[$scope.listaParametros[i].ID_Parametro] = parseInt($scope.listaParametros[i].Valores);
                    }
                    else if ($scope.listaParametros[i].Tipo_Parametro === 'STRING') {
                        $scope.Lista_Parametros_Seleccionados[$scope.listaParametros[i].ID_Parametro] = $scope.listaParametros[i].Valores;
                    }
                }
            }
        }, function (error) { console.log(error); });
    }

    $scope.actualizarValorParametros = function () {
        for (var i = 0; i < $scope.listaParametros.length; i++) {
            if ($scope.listaParametros[i].Tipo_Parametro === 'BOOLEAN') {
                if ($scope.Lista_Parametros_Seleccionados[$scope.listaParametros[i].ID_Parametro] === true) { $scope.listaParametros[i].Valores = 'true'; }
                else { $scope.listaParametros[i].Valores = 'false'; }
            }
            else if ($scope.listaParametros[i].Tipo_Parametro === 'INTEGER') {
                $scope.listaParametros[i].Valores = $scope.Lista_Parametros_Seleccionados[$scope.listaParametros[i].ID_Parametro].toString();
            }
            else if ($scope.listaParametros[i].Tipo_Parametro === 'STRING') {
                $scope.listaParametros[i].Valores = $scope.Lista_Parametros_Seleccionados[$scope.listaParametros[i].ID_Parametro];
            }
        }
        console.log($scope.listaParametros);
        var Lista_Parametros_Final = JSON.stringify($scope.listaParametros);
        console.log(Lista_Parametros_Final);
        $scope.objetoParametro.Lista_Parametros = Lista_Parametros_Final;
        var objetoEnviar = { peticion: JSON.stringify($scope.objetoParametro) };
        console.log($scope.objetoParametro);
        AppService_Parametros.HTTPProcesosParametros(objetoEnviar).then(function (response) {
            $scope.statusProceso = response.data.Respuesta;
            if (response.data.Respuesta === '200') { $timeout(function () { $scope.statusProceso = 0; }, 2000); }
        }, function (error) { console.log(error); });
    }

    $scope.SubirArchivos = function () {
        var fileData = new FormData();
        var files;
        if (window.FormData !== undefined) {
            var fileUpload = $("#ipt_Upload").get(0);
            files = fileUpload.files;
            for (var i = 0; i < files.length; i++) {
                fileData.append(files[i].name, files[i]);
            }
        }
        var objetoEnvio = {
            uri: '/sfa/subir/archivo/Excel/' + objetoSesion.ID_Usuario,
            data: fileData
        }
        $('#btn_upload').attr('disabled', 'disabled')
        $.ajax({
            url: app.service.direccion_servidor + objetoEnvio.uri,
            type: "POST",
            data: fileData,
            beforeSend: function () {
                if (files.length <= 0) {
                    Notify("Error, No se ha subido el archivo seleccionado", 'top-right', '5000', 'danger', 'fa-edit', true);
                }
            },
            success: function (view) {
                if (view.MSJ_ERROR == "0") {
                    Notify("Correcto")
                }
                else {
                    Notify("Incorrecto")
                }
            },
            error: function () {
                if (files.length <= 0) {
                    Notify("Error, No se ha seleccionado un archivo para poder subirlo", 'top-right', '5000', 'danger', 'fa-edit', true);
                }
                else {
                    Notify("Error, No se ha subido el archivo seleccionado", 'top-right', '5000', 'danger', 'fa-edit', true);
                }
            }
        });
    }

    angular.element(document).ready(function () { $scope.ObtenerParametros(); });

});

