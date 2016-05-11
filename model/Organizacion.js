var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Categoria = require("./Categoria");
var Problema = require("./Problema");
var Ciudadano = require("./Ciudadano");
var Organizacion = require("./Organizacion");
var Ciudad = require("./Ciudad");

OrganizacionSchema = new Schema({
    fechaRegistro: Date,
    email: String,
    urlPerfil: String,
    ciudad: Ciudad.CiudadSchema,
    nombre: String,
    nit: String,
    password: String,
    emailContact: String,
    telefono: String,
    direccion: String,
    contactosCiudadanos: [{type: Schema.ObjectId, ref: "Ciudadano"}],
    contactosOrganizaciones: [{type: Schema.ObjectId, ref: "Organizacion"}],
    categoria: {type: Schema.ObjectId, ref: "Categoria"},
    suscripcionCategoria: [{type: Schema.ObjectId, ref: "Problema"}],
    suscripcionCiudad: [Ciudad.CiudadSchema]
});

module.exports.OrganizacionModel = mongoose.model("Organizacion",OrganizacionSchema);
module.exports.OrganizacionSchema = OrganizacionSchema;