var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Organizacion = require("./Organizacion");

CondecoracionSchema = new Schema({
    nombre: String,
    descripcion: String,
    fechaCreacion: Date,
    autor: {type: Schema.ObjectId, ref: "Organizacion"}
});

module.exports.CondecoracionModel = mongoose.model("Condecoracion",CondecoracionSchema);
module.exports.CondecoracionSchema = CondecoracionSchema;