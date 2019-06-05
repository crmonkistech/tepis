app.service('AppService_Jornadas', function ($http) {

    var direccion_servidor = mapeoRuta.ObtenerMapeo();

    /*****************************************
	* SERVICIOS RELACIONADOS CON LAS JORNADAS
	*******************************************/
    this.HTTPObtenerJornadas = function (objetoJornada) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerJornadas', data: objetoJornada }); }
    this.HTTPObtenerJornadasID = function (objetoJornada) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerJornadaID', data: objetoJornada }); }
    this.HTTPObtenerDocumentosJornada = function (objetoJornada) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDocumentosJornada', data: objetoJornada }); }
    this.HTTPObtenerRecibosDineroJornada = function (objetoJornada) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerRecibosDineroJornada', data: objetoJornada }); }
    this.HTTPActualizarEstadoDeposito = function (objetoDeposito) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/actualizarEstadoDeposito', data: objetoDeposito }); }
    this.HTTPObtenerGastosRutaDeposito = function (objetoDeposito) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerGastosRutaDeposito', data: objetoDeposito }); }
    this.HTTPObtenerDepositosJornada = function (objetoJornada) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDepositosJornada', data: objetoJornada }); }
    this.HTTPObtenerDocumentosReciboDinero = function (objetoReciboDinero) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDocumentosReciboDinero', data: objetoReciboDinero }); }
    this.HTTP_subir_archivos_al_Servidor = function (objetoEnvio) {
        //var datos = HttpContext.Current.Request.Form["formulario_Files"];
        return $http({ method: 'POST', url: direccion_servidor + '/sfa/subir/archivo/Excel', data: objetoEnvio });
    }
    this.HTTP_descargar_archivos_al_Servidor = function (objetoEnvio) {
        //var datos = HttpContext.Current.Request.Form["formulario_Files"];
        $http({
            method: 'GET',
            url: direccion_servidor + '/sfa/bajar/archivo/Excel/' + objetoEnvio.peticion,
            data: objetoEnvio,
            responseType: "arraybuffer"
        }).then(
            function (data) {
                myLog({ title: 'RESPUESATA DEL SERVER AL OBTENER EL FILE', contenido: data });
                var type = data.headers('Content-Type');
                var disposition = data.headers('Content-Disposition');
                var defaultFileName = 'Archivo.xlsx';
                if (disposition) {
                    var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
                    if (match[1])
                        defaultFileName = match[1];
                }
                defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
                var linkElement = document.createElement('a');
                try {
                    var blob = new Blob([data.data], { type: type });
                    var url = window.URL.createObjectURL(blob);
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", defaultFileName);
                    var clickEvent = new MouseEvent("click", {
                        "view": window,
                        "bubbles": true,
                        "cancelable": false
                    });
                    linkElement.dispatchEvent(clickEvent);
                } catch (ex) {
                    console.log(ex);
                }
            });
    }
    this.HTTPObtenerReciboDineroDeposito = function (objetoDeposito) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerReciboDineroDeposito', data: objetoDeposito }); }
    this.HTTPObtenerGastosRuta = function (objetoDeposito) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerGastoRutaJornada', data: objetoDeposito }); }
    this.HTTPObtenerDetalleJornada = function (objetoDeposito) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDetalleJornada', data: objetoDeposito }); }
    this.HTTPObtenerDetallesConteos = function (objetoJornada) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/obtenerDetalleConteo', data: objetoJornada }); }
    this.HTTPCerrarJornada = function (objetoJornada) { return $http({ method: 'POST', url: direccion_servidor + '/sfa/cerrarJornada', data: objetoJornada }); }

});