var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Morg = require("./Organizacion");
var Mreporte = require("./Reporte");

RespuestaSchema = new Schema({
    message: {type: String, default: "I'm a message"},
    autor: {type: Schema.ObjectId, ref: "Organizacion"},
    timestamp: {type: Date, default: Date.now},
    reportes: [{type: Schema.ObjectId, ref: "Reporte"}]
});

// creamos las propiedades virtuales
RespuestaSchema.virtual('lapsoDeTiempo').get(function(){
    actual = new Date();
    return timeDifference(actual , this.timestamp );
});

// configuramos para que utilice las propiedades virtuales
RespuestaSchema.set('toJSON', {getters: true, virtuals: true});

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

function respuestasById(id){
    respuestaMod = mongoose.model("Respuesta",RespuestaSchema);
    var query = respuestaMod.find({autor: id});
    return query;
}

module.exports.RespuestaModel = mongoose.model("Respuesta",RespuestaSchema);
module.exports.RespuestaSchema = RespuestaSchema;
module.exports.respuestasById = respuestasById;