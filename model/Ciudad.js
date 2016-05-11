var mongoose = require("mongoose");
var Schema = mongoose.Schema;

CiudadSchema = new Schema({
    nombre: String,
    place_id: String,
    lat: Number,
    lng: Number
});

module.exports.CiudadModel = mongoose.model("Ciudad",CiudadSchema);
module.exports.CiudadSchema = CiudadSchema;