var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Reporte = require("./Reporte");

NotificacionSchema = new Schema({
    titulo: String,
    descripcion: String,
    tipo: String,
    fecha: Date,
    reporte: {type: Schema.ObjectId, ref: "Reporte"}
});

module.exports.NotificacionModel = mongoose.model("Notificacion",NotificacionSchema);
module.exports.NotificacionSchema = NotificacionSchema;