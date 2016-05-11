var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Categoria = require("./Categoria");

ProblemaSchema = new Schema({
    nombre: String,
    descripcion: String,
    prioridad: Number,
    categoria: {type: Schema.ObjectId, ref: "Categoria"}
});

module.exports.ProblemaModel = mongoose.model("Problema",ProblemaSchema);
module.exports.ProblemaSchema = ProblemaSchema;