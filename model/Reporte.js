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
    Napoyos: {type: Number, default: 0},
    Nseguidores: {type: Number, default: 0},
    autor: {type: Schema.ObjectId, ref: "Ciudadano"},
    ubicacion: {nombre: String, lat: Number, lng: Number},
    problemas: [{type: Schema.ObjectId, ref: "Problema"}]
});

function listarReportes(ciudad){
    var modelo = mongoose.model("Reporte",ReporteSchema);
    query = modelo.find({'ubicacion.nombre': ciudad});
    return query;
}

module.exports.ReporteModel = mongoose.model("Reporte",ReporteSchema);
module.exports.ReporteSchema = ReporteSchema;
module.exports.listarReportes = listarReportes;