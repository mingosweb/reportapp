var mongoose = require("mongoose");
var Schema = mongoose.Schema;

CategoriaSchema = new Schema({
    nombre: String,
    descripcion: String
});

module.exports.CategoriaModel = mongoose.model("Categoria", CategoriaSchema);
module.exports.CategoriaSchema = CategoriaSchema;