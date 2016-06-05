var express = require('express');
var router = express.Router();
var organizacion = require("../model/Organizacion");
var Mciudad = require("../model/Ciudad");
var mongoose = require("mongoose");
var Places = require('google-places-js');
const places = Places.create({ key: 'AIzaSyDa18XCLIQTfZ2SvblrWPbgf9jgZvuFaOk' });

Sche = organizacion.OrganizacionSchema;
orgModel = mongoose.model('organizacion', Sche);

router.get('/register',function(req, res, next){
	res.render('organizacion/adduser');
});

router.post('/add',function(req, res, next){
    places.searchText(req.body["ciudad-org"]).then((respuesta) => {
        ciudad_obj = {
            nombre: respuesta.results[0].formatted_address,
            place_id: respuesta.results[0].place_id,
            lat: respuesta.results[0].geometry.location.lat,
            lng: respuesta.results[0].geometry.location.lng
        };

        CiudadModel = Mciudad.CiudadModel;
        ciudadIns = new CiudadModel(ciudad_obj);
        orgObj = new orgModel();
        orgObj.nombre = req.body['nombre-org'];
        orgObj.suscripcionCiudad.push(ciudadIns);
        orgObj.email = req.body['email-org'];
        orgObj.password = req.body['password-org'];
        orgObj.nit = req.body['nit-org'];
        orgObj.ciudad = ciudadIns;
        console.log(orgObj);
        orgObj.save(function(err,org){
            if(err)
                res.json({status: "ERROR", data: err});
            else
                res.json({status: "OK", data: org});
        });
    
    }).catch((err) => {
      console.log(err); 
        res.json({status: "ERROR", data: "Algo paso con la libreria"});
    });
});

router.get('/validate/:email',function(req, res, next){
	orgModel.find({email: req.params.email},function(err,orgs){
		res.json(orgs);
	});
});

router.post('/misproblemas/list',function(req, res, next){
    if(req.session.credencial === req.session.user.email+"organizacion"){
        organizacionMod = organizacion.OrganizacionModel;
        query = organizacionMod.findOne({_id: req.session.user._id},{suscripcionCategoria: 1, ciudad: 1});
        query.exec(function(err, problems){
            if(err){
                res.json({status: "ERROR", message: "Ha ocurrido un error al consultar la BD"});
            }else{
                salas = [];
                for(var i=0; i < problems.suscripcionCategoria.length; i++){
                    salas.push(problems.ciudad.nombre+problems.suscripcionCategoria[i]);
                }
                res.json({status: "OK", message: salas});
            }
        });            
    }else{
            res.json({status: "ERROR", message: "INVALID"});
    }
});

router.post('/problemas/suscribir',function(req, res, next){    
    if(req.session.credencial === req.session.user.email+""+req.session.rol){
        if(req.body.problema){
            var datos = [];
            if(typeof req.body.problema === typeof datos){
                datos = req.body.problema
            }else{
                datos.push(req.body.problema);
            }
            organizacionMod = organizacion.OrganizacionModel;
            organizacionMod.findOneAndUpdate({_id: req.session.user._id},{$addToSet: {suscripcionCategoria : {$each : datos}}}, function(err,obj){
                res.redirect("/"+req.session.user.email+"/config");
            });   

        }else{
            res.send({status: 'ERROR', message: "no llegaron problemas"});
        }
    }else{
        res.send({status: 'INVALID', message: []});
    }
});

router.get('/problemas/eliminar/:id',function(req, res, next){    
    if(req.session.credencial === req.session.user.email+""+req.session.rol){
            organizacionMod = organizacion.OrganizacionModel;
            organizacionMod.findOneAndUpdate({_id: req.session.user._id},{$pull: {suscripcionCategoria : req.params.id}}, function(err,obj){
                res.redirect("/"+req.session.user.email+"/config");
            });   
    }else{
        res.send({status: 'INVALID', message: []});
    }
});

module.exports = router;