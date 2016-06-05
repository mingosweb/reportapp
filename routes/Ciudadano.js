var express = require('express');
var router = express.Router();
var Ciudadano = require("../model/Ciudadano");
var Organizacion = require("../model/Organizacion");
var Mciudad = require("../model/Ciudad");
var Mreporte = require("../model/Reporte");
var Mnotify = require("../model/Notificacion");
var mongoose = require("mongoose");
var Places = require('google-places-js');
var multer = require("multer");
const places = Places.create({ key: 'AIzaSyDa18XCLIQTfZ2SvblrWPbgf9jgZvuFaOk' });

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/photos')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage });

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
        ciudadanoObj.suscripcionCiudad.push(ciudadIns);
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
    
router.post('/edit-profile',upload.single('urlPerfil'),function(req, res, next){
    if(req.session.credencial === req.session.user.email+""+req.session.rol){
        var keysObj = Object.keys(req.body);
        objUpdate = {};
        console.log(keysObj);
        for (i=0; i<keysObj.length; i++){
            if(req.body[keysObj[i]]){
                objUpdate[keysObj[i]] = req.body[keysObj[i]];   
            }
        }
        if(req.file){
            objUpdate["urlPerfil"] = req.file.filename;
        }
        console.log("Actualizacion");
        console.log(objUpdate);
        if(req.session.rol === "ciudadano"){
            ciudadanoMod = Ciudadano.CiudadanoModel;
            queryUp = ciudadanoMod.findOneAndUpdate({_id: req.session.user._id},objUpdate);   
        }else{
            orgMod = Organizacion.OrganizacionModel;
            queryUp = orgMod.findOneAndUpdate({_id: req.session.user._id},objUpdate);  
        }
        queryUp.exec(function(err,ciu){
            if(err){
                res.send("ocurrió un error al guardar los cambios");
            }else{
                res.redirect("/"+req.session.nombre+"/perfil");
            }
        });
    }else{
        res.json({status: "ERROR", message: "No se pudo realizar la operacion campo vacio"});
    }
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

router.post("/personaremove", function(req, res, next){
    if(req.session.credencial === req.session.user.email+''+req.session.rol){
        var id_contacto = (!req.body.idpersona.empty) ? req.body.idpersona : "";
        // si el usuario es CIUDADANO usar el modelo ciudadano
        if(req.session.rol === "ciudadano"){
            ciudadanoMod = Ciudadano.CiudadanoModel;
            querycontact = ciudadanoMod.findOne({
                $and: [
                       {_id: req.session.user._id},
                       {$or: [{'contactosCiudadanos': id_contacto},{'contactosOrganizaciones': id_contacto}]}
                      ]});
            querycontact.exec(function(err,contact){
                // si EXISTE el contacto
                if(contact !== null){
                    if(req.body.rol === "ciudadano"){
                        // si el contacto es CIUDADANO eliminar de lista de ciudadanos
                        var query = ciudadanoMod.findOneAndUpdate({_id: req.session.user._id},{$pull: {'contactosCiudadanos': id_contacto}});
                    }else{
                        // si el contacto es ORGANIZACION eliminar de organizacion
                        var query = ciudadanoMod.findOneAndUpdate({_id: req.session.user._id},{$pull: {'contactosOrganizaciones': id_contacto}});
                    }
                    query.exec(function(err,ciudada){
                       if(err){
                           res.json({status: "ERROR", message: "Paso algo en la consulta"});
                       }else{
                           res.json({status: "OK", message: "Se ha Eliminado de tus contactos"});
                       }
                    });
                }
                //si NO existe
                else{
                    res.json({status: "ERROR", message: "Este contacto no ha sido Agregado a tu lista"});
                }
            });
        }
        // si el usuario es CIUDADANO usar el modelo ciudadano
        else if(req.session.rol === "organización"){
            orgMod = Organizacion.CiudadanoModel;
            querycontact = orgMod.findOne({
                $and: [
                       {_id: req.session.user._id},
                       {$or: [{'contactosCiudadanos': id_contacto},{'contactosOrganizaciones': id_contacto}]}
                      ]});
            querycontact.exec(function(err,contact){
                // si EXISTE el contacto
                if(contact !== null){
                    if(req.body.rol === "ciudadano"){
                        // si el contacto es CIUDADANO eliminar de lista de ciudadanos
                        var query = orgMod.findOneAndUpdate({_id: req.session.user._id},{$pull: {'contactosCiudadanos': id_contacto}});
                    }else{
                        // si el contacto es ORGANIZACION eliminar de organizacion
                        var query = orgMod.findOneAndUpdate({_id: req.session.user._id},{$pull: {'contactosOrganizaciones': id_contacto}});
                    }
                    query.exec(function(err,org){
                       if(err){
                           res.json({status: "ERROR", message: "Paso algo en la consulta"});
                       }else{
                           res.json({status: "OK", message: "Se ha Eliminado de tus contactos"});
                       }
                    });
                }
                //si NO existe
                else{
                    res.json({status: "ERROR", message: "Este contacto no ha sido Agregado a tu lista"});
                }
            });
        }
    }else{
        res.json({status: "ERROR", message: "INVALIDO"});
    }
});
    
router.post('/personaadd',function(req, res, next){
    if(req.session.credencial === req.session.user.email+''+req.session.rol){
        var id_contacto = (!req.body.idpersona.empty) ? req.body.idpersona : "";
        if(req.session.rol === "ciudadano"){
            ciudadanoMod = Ciudadano.CiudadanoModel;
            // query que devuelve la lista de contactos del usuario si el contact existe
            var query1 = ciudadanoMod.findOne({
                $and: [
                       {_id: req.session.user._id},
                       {$or: [{'contactosCiudadanos': id_contacto},{'contactosOrganizaciones': id_contacto}]}
                      ]});
            query1.exec(function(err,ciu){
                // si NO existe el contacto
                if(ciu == null){
                    if(req.body.rol === "ciudadano"){
                    var query = ciudadanoMod.findOneAndUpdate({_id: req.session.user._id},{$addToSet: {'contactosCiudadanos': id_contacto}});
                    }else{
                    var query = ciudadanoMod.findOneAndUpdate({_id: req.session.user._id},{$addToSet: {'contactosOrganizaciones': id_contacto}});
                    }
                    query.exec(function(err,ciudada){
                       if(err){
                           res.json({status: "ERROR", message: "Paso algo en la consulta"});
                       }else{
                           res.json({status: "OK", message: "Se ha agregado a tus contactos"});
                       }
                    });
                }else{
                    // Si EXISTE el contacto entonces se muestra el mensaje
                   res.json({status: "ERROR", message: "Ya has agregado a tu lista de contactos"}); 
                }
            });
        }else if(req.session.rol === "organizacion"){
            orgMod = Organizacion.OrganizacionModel;
            var query1 = orgMod.findOne({
                $and: [
                       {_id: req.session.user._id},
                       {$or: [{'contactosCiudadanos': id_contacto},{'contactosOrganizaciones': id_contacto}]}
                      ]});
            query1.exec(function(err,org){
                if(org == null){
                    if(req.body.rol === "ciudadano"){
                    var query = orgMod.findOneAndUpdate({_id: req.session.user._id},{$addToSet: {'contactosCiudadanos': id_contacto}});
                    }else{
                    var query = orgMod.findOneAndUpdate({_id: req.session.user._id},{$addToSet: {'contactosOrganizaciones': id_contacto}});
                    }
                    query.exec(function(err,org){
                       if(err){
                           res.json({status: "ERROR", message: "Paso algo en la consulta de organizacoin"});
                       }else{
                           res.json({status: "OK", message: "Se ha agregado a tus contactos"});
                       } 
                    });
                }else{
                   res.json({status: "ERROR", message: "Ya has agregado a este contacto"}); 
                }
            });
        }
    }else{
        res.json({status: "ERROR", message: "INVALID"});
    }
});
    
router.post('/mis-contactos',function(req, res, next){
    if(req.session.credencial){
        if(req.session.rol === "ciudadano"){
            ciudadanoMod = Ciudadano.CiudadanoModel;
            console.log("Soy ciudadano");
            console.log("id: "+req.session.user.email);
            query = ciudadanoMod.findOne({email: req.session.user.email},{'contactosCiudadanos': 1, 'contactosOrganizaciones':1})
                .populate('contactosCiudadanos').populate('contactosOrganizaciones');
            query.exec(function(err,ciu){
                var cc = ciu.contactosCiudadanos;
                var co = ciu.contactosOrganizaciones;
                var ct = [];
                Array.prototype.push.apply(ct, cc);
                Array.prototype.push.apply(ct, co);
                if(err){
                    res.json({status: "ERROR", message: "Error al hacer consulta"});
                }else{
                    res.json({status: "OK", message: ct, algo: "ciudadano"});
                }
            });
        }else if(req.session.rol === "organizacion"){
            orgMod = Organizacion.CiudadanoModel;
            query = orgMod.findOne({email: req.session.user.email},{'contactosCiudadanos': 1, 'contactosOrganizaciones':1})
                .populate('contactosCiudadanos').populate('contactosOrganizaciones');
            query.exec(function(err,org){
                var cc = ciu.contactosCiudadanos;
                var co = ciu.contactosOrganizaciones;
                var ct = [];
                Array.prototype.push.apply(ct, cc);
                Array.prototype.push.apply(ct, co);
                if(err){
                    res.json({status: "ERROR", message: "Error al hacer consulta"});
                }else{
                    res.json({status: "OK", message: ct, algo: "ciudadano"});
                }
            });
        }
    }else{
        res.json({status: 'ERROR', message: "INVALID"});
    }
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
                        // crear notificacion
                        notifyMod = Mnotify.NotificacionModel;
                        myNotify = {
                            titulo: result.titulo,
                            descripcion: req.session.user.nick+" ha hecho un llamado de atención",
                            tipo: "LLamado de atención",
                            reporte: result._id,
                            autor: req.session.user._id
                        };
                        console.log("usuario de la notificacion");
                        console.log(req.session.user);
                        notifyObj = new notifyMod(myNotify);
                        notifyObj.save(function(err, rep){
                            if(err){
                                console.log("ERROR AL GUARDAR");
                                res.json({status: 'ERROR', message: 'Error al guardar la notificacion'});  
                            }else{
                                console.log("SE HA ALMACENADO LA NOTIFICACION");   
                                res.json({status: 'OK', message: 'has enviado tu llamado de atención'});  
                                io.to(req.session.user.ciudad.nombre).emit("apoyo",{message: myNotify, update: result.Napoyos.length+1, reporte: result._id});
                                console.log("enviando a: "+req.session.user.ciudad.nombre+""+result.problemas[0]);
                                io.to(result.ubicacion.nombre+""+result.problemas[0]).emit("apoyo",{message: myNotify, update: result.Napoyos.length+1, reporte: result._id});
                            }
                        });
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
                            // crear notificacion
                            notifyMod = Mnotify.NotificacionModel;
                            myNotify = {
                                titulo: result.titulo,
                                descripcion: req.session.user.nick+" ha cambiado el problema como solucionado",
                                tipo: "Problema solucionado",
                                reporte: result._id,
                                autor: req.session.user._id
                            };
                            notifyObj = new notifyMod(myNotify);
                            notifyObj.save(function(err, rep){
                                if(err){
                                    console.log("ERROR AL GUARDAR");
                                    res.json({status: 'ERROR', message: 'Error al guardar la notificacion'});  
                                }else{
                                    console.log("SE HA ALMACENADO LA NOTIFICACION");   
                                    res.json({status: 'OK', message: 'Has enviado tu llamado de atención'});  
                                    io.to(result.ubicacion.nombre).emit("solucion",{message: myNotify, update: "Solucionado", repo: result._id });
                                    io.to(result.ubicacion.nombre+""+result.problemas[0]).emit("solucion",{message: myNotify, update: "Solucionado", repo: result._id });
                                }
                            });
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
