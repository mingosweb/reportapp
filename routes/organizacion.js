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
	/*orgObj = new orgModel();
	orgObj.nombre = req.body['nombre-org'];
	orgObj.email = req.body['email-org'];
	orgObj.password = req.body['password-org'];
	orgObj.nit = req.body['nit-org'];
	orgObj.ciudad =  req.body['ciudad-org'];
	orgObj.save(function(err,orgs){
		if(err)
			res.send("error al agregarse "+err);
		else
			res.send(orgs);
	});*/
});

router.get('/validate/:email',function(req, res, next){
	orgModel.find({email: req.params.email},function(err,orgs){
		res.json(orgs);
	});
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
                        if(err){
                            console.log(err);
                            res.send({status: 'ERROR', message: "Error al modificar campo"});
                        }else{
                            res.send({status: "OK", messaje: obj});
                        }
            });   

        }else{
            res.send({status: 'ERROR', message: "no llegaron problemas"});
        }
    }else{
        res.send({status: 'INVALID', message: []});
    }
});

module.exports = router;