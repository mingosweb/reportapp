var express = require('express');
var router = express.Router();
var Ciudadano = require("../model/Ciudadano");
var Mciudad = require("../model/Ciudad");
var Mreporte = require("../model/Reporte");
var mongoose = require("mongoose");
var Places = require('google-places-js');
const places = Places.create({ key: 'AIzaSyDa18XCLIQTfZ2SvblrWPbgf9jgZvuFaOk' });

Sche = Ciudadano.CiudadanoSchema;
UserMod = mongoose.model("ciudadano", Sche);

function initRouter(io){

router.get('/register',function(req, res, next){
	res.render('ciudadano/adduser');
});

router.post('/add',function(req, res, next){
    places.searchText(req.body.ciudad).then((respuesta) => {
        ciudad_obj = {
            nombre: respuesta.results[0].formatted_address,
            place_id: respuesta.results[0].place_id,
            lat: respuesta.results[0].geometry.location.lat,
            lng: respuesta.results[0].geometry.location.lng
        };

        CiudadModel = Mciudad.CiudadModel;
        ciudadIns = new CiudadModel(ciudad_obj);
        ciudadanoObj = new UserMod();
        ciudadanoObj.nick = req.body.nick;
        ciudadanoObj.email = req.body.email;
        ciudadanoObj.password = req.body.password;
        ciudadanoObj.ciudad = ciudadIns;
        ciudadanoObj.save(function(err,ciudadanos){
            if(err)
                res.json({status: "error"});
            else
                res.json({status: "ok"});
        });
    
    }).catch((err) => {
      console.log(err); 
        res.json({status: "NO"});
    });
});

router.get('/validate/:nick/:email',function(req, res, next){
	UserMod.find({$or: [{nick:req.params.nick},{email: req.params.email}]},function(err,users){
		if(err){
			cant = 0;
			res.send(err)
		}
		else{
			if(users.length > 0){
				res.json({exist: true});
			}else{
				res.json({exist: false});
			}
		}
	});

});

router.get('/validate-nick/:nick',function(req, res, next){
	UserMod.find({nick:req.params.nick},function(err,users){
		if(err){
			res.send(err)
		}
		else{
			if(users.length > 0){
				res.json({exist: true});
			}else{
				res.json({exist: false});
			}
		}
	});

});

router.get('/validate-email/:email',function(req, res, next){
	
	UserMod.find({email:req.params.email},function(err,users){
		if(err){
			res.send(err)
		}
		else{
			if(users.length > 0){
				res.json({exist: true});
			}else{
				res.json({exist: false});
			}
		}
	});

});

router.post("/reporte/:idrep/apoyar",function(req, res, next){
    if(req.session.credencial){
        var reporteMod = Mreporte.ReporteModel;
        var query = reporteMod.findOne({_id: req.params.idrep, 'Napoyos' : req.session.user._id});
        query.exec(function(err, rep){
            if(rep == null){
                var queryUpdate = reporteMod.findOneAndUpdate({_id: req.params.idrep},{$addToSet: {'Napoyos': req.session.user._id}});
                queryUpdate.exec(function(err,result){
                    if(err){
                        res.send("hubo problemas en la consulta");
                    }else{
                        res.json({status: 'OK', message: 'Has enviado tu llamado de atención'});  
                        io.to(req.session.user.ciudad.nombre).emit("apoyo",{message: req.session.user.nick+" Ha realizado un llamado de atencion", update: result.Napoyos.length+1});
                    }
                });
            }else{
                res.json({status: 'ERROR', message: "Ya has enviado tu llamado de atención"});
            }
        });
    }
});
    
router.post("/reporte/:idrep/eliminar",function(req, res, next){
    if(req.session.credencial){
        var reporteMod = Mreporte.ReporteModel;
        var query = reporteMod.remove({_id: req.params.idrep});
        query.exec(function(err, rep){
            if(err){
                res.json({status: "ERROR", message: "error al realizar consulta"});
            }else{
                res.json({status: "OK", message: "El reporte fue eliminado con exito", url: "/"+req.session.user.email+"/reportes/mis-reportes"});
            }
        });
    }else{
        res.redirect("/");
    }
});
    
router.post("/reporte/:idrep/solucionar",function(req, res, next){
    if(req.session.credencial){
        var reporteMod = Mreporte.ReporteModel;
        var query = reporteMod.findOne({_id: req.params.idrep, estado: "Sin solucionar"});
        query.exec(function(err,rep){
            if(err){
                res.json({status: "ERROR", message: "error al consultar repo"});
            }else{
                if(rep === null){
                    res.json({status: "solved", message: "Ya haz solucionado este reporte"});
                }else{
                    var queryUpdate = reporteMod.findOneAndUpdate({_id: req.params.idrep},{$set: {'estado': "Solucionado"}});
                    queryUpdate.exec(function(err,result){
                        if(err){
                            res.json({status:"ERROR", message: "error al actualizar"});
                        }else{
                            io.to(req.session.user.ciudad.nombre).emit("solucion",{message: "Se ha solucionado el problema: "+result.titulo, update: "Solucionado", repo: result._id});
                        }
                    });         
                }
            }
        });
    }else{
        res.redirect("/");
    }
});

router.post('/problemas/suscribir',function(req, res, next){    
    if(req.session.credencial === req.session.user.email+"ciudadano"){
            var datos = [];
            if(typeof req.body.problema === typeof datos){
                datos = req.body.problema
            }else{
                datos.push(req.body.problema);
            }
            ciudadanoMod = Ciudadano.CiudadanoModel;
            ciudadanoMod.findOneAndUpdate({_id: req.session.user._id},{$addToSet: {suscripcionCategoria : {$each : datos}}}, function(err,obj){
                res.redirect("/"+req.session.user.email+"/config");
            });   
    }else{
        res.send({status: 'INVALID', message: []});
    }
});

router.post('/ciudades/suscribir',function(req, res, next){    
    if(req.session.credencial === req.session.user.email+"ciudadano"){
        places.searchText(req.body.ciudad).then((respuesta) => {
            ciudad_obj = {
                nombre: respuesta.results[0].formatted_address,
                place_id: respuesta.results[0].place_id,
                lat: respuesta.results[0].geometry.location.lat,
                lng: respuesta.results[0].geometry.location.lng
            };
            CiudadModel = Mciudad.CiudadModel;
            ciudadIns = new CiudadModel(ciudad_obj);
            ciudadanoMod = Ciudadano.CiudadanoModel;
            query = ciudadanoMod.findOneAndUpdate({_id: req.session.user._id},{$addToSet: {suscripcionCiudad : ciudadIns}});   
            query.exec(function(err,obj){
                console.log("se va a agregar el siguiente objeto");
                console.log(obj);
                res.redirect("/"+req.session.user.email+"/suscribir-ciudad");
            });
        }).catch((err) => {
          console.log(err); 
            res.json({status: "NO"});
        });
    }else{
        res.redirect("/");
    }
});

router.get('/problemas/eliminar/:id',function(req, res, next){    
    if(req.session.credencial === req.session.user.email+"ciudadano"){
            ciudadanoMod = Ciudadano.CiudadanoModel;
            ciudadanoMod.findOneAndUpdate({_id: req.session.user._id},{$pull: {suscripcionCategoria : req.params.id}}, function(err,obj){
                res.redirect("/"+req.session.user.email+"/config");
            });   
    }else{
        res.send({status: 'INVALID', message: []});
    }
});

router.get('/ciudades/eliminar/:placeId',function(req, res, next){    
    if(req.session.credencial === req.session.user.email+"ciudadano"){
            ciudadanoMod = Ciudadano.CiudadanoModel;
            ciudadanoMod.findOneAndUpdate({_id: req.session.user._id},{$pull: {suscripcionCiudad : {place_id: req.params.placeId}}}, function(err,obj){
                res.redirect("/"+req.session.user.email+"/suscribir-ciudad");
            });   
    }else{
        res.send({status: 'INVALID', message: []});
    }
});
    
    return router;
    
}

/*router.get("/yupi",function(req,res){
    res.render("components/home-user");
});*/

module.exports.initRouter = initRouter;
