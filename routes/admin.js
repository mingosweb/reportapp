var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Mcategoria = require('../model/Categoria');
var Mproblema = require('../model/Problema');

mongoose.connect('mongodb://127.0.0.1/reportar', function(err, res) {
	  if(err) {
	    console.log('ERROR: connecting to Database. ' + err);
	  } else {
	    console.log('Connected to Database');
	  }
});

router.get('/home',function(req, res, next){
    var categoriaMod = Mcategoria.CategoriaModel;
    categoriaMod.find({}, function(err, categorias){
        if(err){
            res.send("error al consultar categorias");
        }else{
            res.render('admin/main',{categorias: categorias});
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