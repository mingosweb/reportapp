var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Mcategoria = require('../model/Categoria');
var Mproblema = require('../model/Problema');

/*mongoose.connect('mongodb://127.0.0.1/reportar', function(err, res) {
	  if(err) {
	    console.log('ERROR: connecting to Database. ' + err);
	  } else {
	    console.log('Connected to Database');
	  }
}); */

router.post('/list',function(req, res, next){
    var problemaMod = Mproblema.ProblemaModel;
    problemaMod.find({categoria: req.body.categoria}, function(err, problemas){
        if(err){
            res.json({status: "ERROR", message: "error al consultar categorias"});
        }else{
            res.json({status: "OK", message: problemas});
        }
    });
});

router.post('/categoria/add',function(req, res, next){
    categoriaMod = Mcategoria.CategoriaModel;
    var miCategoria = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion
    }
    categoriaObj = new categoriaMod(miCategoria);
    categoriaObj.save(function(err, categorias){
        if(err){
            res.send("ocurrio un error");
        }else{
            res.json(categorias);
        }
    });
});

router.post('/problema/add',function(req, res, next){
    ProblemaMod = Mproblema.ProblemaModel;
    categoriaMod = Mcategoria.CategoriaModel;
    var miProblema = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        prioridad: req.body.prioridad,
        categoria: req.body.categoria
    };
    problemaObj = new ProblemaMod(miProblema);
    problemaObj.save(function(err, problema){
        if(err){
            res.send({status: 'ERROR', messaje: "Error al guardar el problema en la base de datos"});
        }else{
            res.send({status: 'OK', messaje: problema});
        }
    });
});

module.exports = router;