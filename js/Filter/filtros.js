app.filter('contains', function () {
    return function (array, needle) {
        if ($.inArray(needle, array) == -1) {
            return false;
        }
        else {
            return true;
        }
        //return array.indexOf(needle) >= 0;
    };
});

app.filter("myfilter", function () {
    return function (items, dia) {
        var arrayToReturn = [];
        if (dia === 'Lunes') {
            for (var i = 0; i < items.length; i++) {
                if (items[i].Dias_Ruta.L === true) {
                    arrayToReturn.push(items[i]);
                }
            }
        }
        else if (dia === 'Martes') {
            for (var i = 0; i < items.length; i++) {
                if (items[i].Dias_Ruta.K === true) {
                    arrayToReturn.push(items[i]);
                }
            }
        }
        else if (dia === 'Miércoles') {
            for (var i = 0; i < items.length; i++) {
                if (items[i].Dias_Ruta.M === true) {
                    arrayToReturn.push(items[i]);
                }
            }
        }
        else if (dia === 'Jueves') {
            for (var i = 0; i < items.length; i++) {
                if (items[i].Dias_Ruta.J === true) {
                    arrayToReturn.push(items[i]);
                }
            }
        }
        else if (dia === 'Viernes') {
            for (var i = 0; i < items.length; i++) {
                if (items[i].Dias_Ruta.V === true) {
                    arrayToReturn.push(items[i]);
                }
            }
        }
        else if (dia === 'Sábado') {
            for (var i = 0; i < items.length; i++) {
                if (items[i].Dias_Ruta.S === true) {
                    arrayToReturn.push(items[i]);
                }
            }
        }
        else if (dia === 'Domingo') {
            for (var i = 0; i < items.length; i++) {
                if (items[i].Dias_Ruta.D === true) {
                    arrayToReturn.push(items[i]);
                }
            }
        }
        else if (dia === null) {
            arrayToReturn = items;
        }
        else if (dia === "Todos") {
            console.log('La opcion seleccionada es todos');
            for (var i = 0; i < items.length; i++) {
                arrayToReturn.push(items[i]);
            }
        }

        return arrayToReturn;
    };
});

app.filter('startFrom', function () {
    return function (input, start) {
        start = +start;
        return input.slice(start);
    }
});