var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Ciudadano = require("./Ciudadano");
var Ciudad = require("./Ciudad");
var Problema = require("./Problema");
//var Plan = require("./Plan");

ReporteSchema = new Schema({
    titulo: String,
    descripcion: String,
    timestamp: {type: Date, default: Date.now},
    url_fotos: [String],
    estado: {type: String, default: "Sin solucionar"},
    Napoyos: [{type: Schema.ObjectId, ref: "Ciudadano"}],
    Nseguidores: {type: Number, default: 0},
    autor: {type: Schema.ObjectId, ref: "Ciudadano"},
    ubicacion: {nombre: String, lat: Number, lng: Number},
    problemas: [{type: Schema.ObjectId, ref: "Problema"}]
});

function listarReportes(ciudad,skipIn, limitIn){
    var options = {};
    if(skipIn && limitIn){
        console.log("vaya bien... recibimos opciones y manejamosla");
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

module.exports.ReporteModel = mongoose.model("Reporte",ReporteSchema);
module.exports.ReporteSchema = ReporteSchema;
module.exports.listarReportes = listarReportes;
module.exports.reportesByUser = reportesByUser;