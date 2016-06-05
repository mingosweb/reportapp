var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Categoria = require("./Categoria");
var Problema = require("./Problema");
var Ciudadano = require("./Ciudadano");
var Organizacion = require("./Organizacion");
var Ciudad = require("./Ciudad");

OrganizacionSchema = new Schema({
    fechaRegistro:{type: Date, default: Date.now},
    email: String,
    urlPerfil: {type: String, default: ""},
    ciudad: Ciudad.CiudadSchema,
    nombre: String,
    nit: String,
    password: String,
    emailContact: {type: String, default: ""},
    telefono: {type: String, default: ""},
    direccion: {type: String, default: ""},
    website: {type: String, default: ""},
    contactosCiudadanos: [{type: Schema.ObjectId, ref: "Ciudadano"}],
    contactosOrganizaciones: [{type: Schema.ObjectId, ref: "Organizacion"}],
    categoria: {type: Schema.ObjectId, ref: "Categoria"},
    suscripcionCategoria: [{type: Schema.ObjectId, ref: "Problema"}],
    suscripcionCiudad: [Ciudad.CiudadSchema]
});

OrganizacionSchema.virtual('apodo').get(function(){
    return this.nombre;
});

// configuramos para que utilice las propiedades virtuales
OrganizacionSchema.set('toJSON', {getters: true, virtuals: true});

function orgsPorCoincidencia(pal){
    OrgModel = mongoose.model("Organizacion",OrganizacionSchema);
    palabRegex = '.*'+pal;
    return query = OrgModel.find({nombre: {$regex:  palabRegex, $options: '$i'}});
}

module.exports.OrganizacionModel = mongoose.model("Organizacion",OrganizacionSchema);
module.exports.OrganizacionSchema = OrganizacionSchema;
module.exports.orgsPorCoincidencias = orgsPorCoincidencia;