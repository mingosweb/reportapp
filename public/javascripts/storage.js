function myStorage(){
    
}

myStorage.prototype.agregarItem = function(clave,valor){
    localStorage.setItem(clave,valor);
};

myStorage.prototype.eliminarItem = function(clave){
    localStorage.removeItem(clave);
};

myStorage.prototype.limpiar = function(){
    localStorage.clear();
};

myStorage.prototype.obtenerItem = function(clave){
    return localStorage.getItem(clave);
};

myStorage.prototype.itemComoJson = function(clave){
    key = clave;
    value = localStorage.getItem(clave);
    jsonItem = {
        "key": key,
        "value": value
    }
    return jsonItem;
};

myStorage.prototype.listaComoJson = function(){
    tam = localStorage.length;
    array = [];
    for(var i=0; i < tam; i++){
        clave = localStorage.key(i);
        valor = localStorage.getItem(clave);
        jsonItem = {
            "key": clave,
            "value": valor
        }
        array.push(jsonItem);
    }
    return array;
};