var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Organizacion = require("./Organizacion");
var Categoria = require("./Categoria");
var Condecoracion = require("./Condecoracion");
var Condecoracion = require("./Problema");
var Ciudad = require("./Ciudad");

CiudadanoSchema = new Schema({
    fechaRegistro: {type: Date, default: Date.now},
    fechaDeNacimiento: {type: Date},
    telefono: {type: String, default: ""},
    direccion: {type: String, default: ""},
    email: {type: String, default: ""},
    password: {type: String, default: ""},
    urlPerfil: {type: String, default: ""},
    ciudad: Ciudad.CiudadSchema,
    nick: {type: String, default: ""},
    nombre: {type: String, default: ""},
    apellido: {type: String, default: ""},
    sexo: {type: String, default: ""},
    cedula: {type: String, default: ""},
    contactosCiudadanos: [{type: Schema.ObjectId, ref: "Ciudadano"}],
    contactosOrganizaciones: [{type: Schema.ObjectId, ref: "Organizacion"}],
    suscripcionCategoria: [{type: Schema.ObjectId, ref: "Problema"}],
    suscripcionCiudad: [Ciudad.CiudadSchema],
    condecoraciones: [{type: Schema.ObjectId, ref: "Condecoracion"}]
});

CiudadanoSchema.virtual('apodo').get(function(){
    return this.nick;
});

// configuramos para que utilice las propiedades virtuales
CiudadanoSchema.set('toJSON', {getters: true, virtuals: true});

function obtenerUsuario(emailIn){
    CiudadanoModel = mongoose.model("Ciudadano",CiudadanoSchema);
    query = CiudadanoModel.find({email: emailIn}).populate({path: 'suscripcionCategoria', select: 'nombre categoria', populate: {path: 'categoria', select: 'nombre'}});
    return query;
}

function usuariosPorCoincidencia(palabra){
    CiudadanoModel = mongoose.model("Ciudadano",CiudadanoSchema);
    palabraRegex = '.*'+palabra;
    return query = CiudadanoModel.find({nick: {$regex:  palabraRegex, $options: '$i'}});
}

module.exports.CiudadanoModel = mongoose.model("Ciudadano",CiudadanoSchema);
module.exports.CiudadanoSchema = CiudadanoSchema;
module.exports.getCiudadano = obtenerUsuario;
module.exports.usuariosPorCoincidencia = usuariosPorCoincidencia;
