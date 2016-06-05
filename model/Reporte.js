var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Ciudadano = require("./Ciudadano");
var Ciudad = require("./Ciudad");
var Problema = require("./Problema");
var Respuesta = require("./Respuesta");

ReporteSchema = new Schema({
    titulo: String,
    descripcion: String,
    timestamp: {type: Date, default: Date.now},
    url_fotos: [String],
    estado: {type: String, default: "Sin solucionar"},
    Napoyos: [{type: Schema.ObjectId, ref: "Ciudadano"}],
    autor: {type: Schema.ObjectId, ref: "Ciudadano"},
    ubicacion: {nombre: String, lat: Number, lng: Number},
    problemas: [{type: Schema.ObjectId, ref: "Problema"}],
    respuestas: [{type: Schema.ObjectId, ref: "Respuesta"}]
});

// creamos las propiedades virtuales
ReporteSchema.virtual('lapsoDeTiempo').get(function(){
    actual = new Date();
    return timeDifference(actual , this.timestamp );
});

// configuramos para que utilice las propiedades virtuales
ReporteSchema.set('toJSON', {getters: true, virtuals: true});

function listarReportes(ciudad,skipIn, limitIn){
    var options = {};
    if(skipIn && limitIn){
        options = {
            skip:skipIn,
            limit: limitIn
        };
    }
    var modelo = mongoose.model("Reporte",ReporteSchema);
    query = modelo.find({'ubicacion.nombre': ciudad}).skip(skipIn).limit(limitIn);
    return query;
}

function reportesByUser(iduser){
    var modelo = mongoose.model("Reporte",ReporteSchema);
    query = modelo.find({autor: iduser});
    return query;
}

function timeDifference(current, previous) {
    
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    
    var elapsed = current - previous;
    var format = function(time,unity){
        if(time === 1){
            return "hace "+time+" "+unity;
        }else{
            if(unity === "meses"){
                return "hace "+time+" "+unity+"es";
            }else{
                return "hace "+time+" "+unity+"s";
            }
        }
    };
    
    if (elapsed < msPerMinute) {
        time = Math.round(elapsed/1000);
        return format(time,"segundo");
    }
    
    else if (elapsed < msPerHour) {
         time = Math.round(elapsed/msPerMinute);
         return format(time, "minuto");
    }
    
    else if (elapsed < msPerDay ) {
         time = Math.round(elapsed/msPerHour );   
        return format(time,"hora");
    }

    else if (elapsed < msPerMonth) {
         time = Math.round(elapsed/msPerDay);   
        return format(time,"dia");
    }
    
    else if (elapsed < msPerYear) {
         time = Math.round(elapsed/msPerMonth);
        return format(time,"mes")
    }
    
    else {
         time = Math.round(elapsed/msPerYear );
        return format(time,"año");
    }
}


module.exports.ReporteModel = mongoose.model("Reporte",ReporteSchema);
module.exports.ReporteSchema = ReporteSchema;
module.exports.listarReportes = listarReportes;
module.exports.reportesByUser = reportesByUser;