var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Organizacion = require("./Organizacion");
var Categoria = require("./Categoria");
var Condecoracion = require("./Condecoracion");
var Condecoracion = require("./Problema");
var Ciudad = require("./Ciudad");

CiudadanoSchema = new Schema({
    fechaRegistro: Date,
    email: String,
    password: String,
    urlPerfil: String,
    ciudad: Ciudad.CiudadSchema,
    nick: String,
    nombre: String,
    apellido: String,
    cedula: Number,
    contactosCiudadanos: [{type: Schema.ObjectId, ref: "Ciudadano"}],
    contactosOrganizaciones: [{type: Schema.ObjectId, ref: "Organizacion"}],
    suscripcionCategoria: [{type: Schema.ObjectId, ref: "Problema"}],
    suscripcionCiudad: [Ciudad.CiudadSchema],
    condecoraciones: [{type: Schema.ObjectId, ref: "Condecoracion"}]
});

function obtenerUsuario(emailIn){
    CiudadanoModel = mongoose.model("Ciudadano",CiudadanoSchema);
    query = CiudadanoModel.find({email: emailIn}).populate({path: 'suscripcionCategoria', select: 'nombre categoria', populate: {path: 'categoria', select: 'nombre'}});
    return query;
}

module.exports.CiudadanoModel = mongoose.model("Ciudadano",CiudadanoSchema);
module.exports.CiudadanoSchema = CiudadanoSchema;
module.exports.getCiudadano = obtenerUsuario;
