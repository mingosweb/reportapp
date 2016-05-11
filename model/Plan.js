var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Organizacion = require("./Organizacion");

PlanSchema = new Schema({
    nombre: String,
    tareas: [String],
    fechaCreacion: Date,
    autor: {type: Schema.ObjectId, ref: "Organizacion"},
    miembros: [{type: Schema.ObjectId, ref: "Organizacion"}]
});

module.exports.PlanModel = mongoose.model("Plan",PlanSchema);
module.exports.PlanSchema = PlanSchema;