var mapeoRuta = {

    direccion_IP: [
        { ip: "http://localhost", entorno: "desa" },
        { ip: "http://localhost", entorno: "desa_publ" },
        { ip: "http://200.74.249.8", entorno: "prod" }
    ],
    puerto: [
        { puerto: "12037", entorno: "desa" },
        { puerto: "8080", entorno: "desa_publ" },
        { puerto: "80/API_SFA2", entorno: "prod" }
    ],

    ObtenerMapeo: function () {
        var rutaABuscar = "prod"; /**SE DEBE SELECCIONAR EL ENTORNO AL QUE SE QUIERE APUNTAR PARA CREAR LA RUTA */
        var rutaSeleccionada = this.direccion_IP.find(x=>x.entorno == rutaABuscar).ip + ':' +this.puerto.find(x=>x.entorno == rutaABuscar).puerto;
        return rutaSeleccionada;
    }
    
}