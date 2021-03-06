var express = require('express');
var router = express.Router();
var Mreporte = require("../model/Reporte");
var Mrespuesta = require("../model/Respuesta");

router.post('/list/:ciudad', function(req, res, next) {
    if(req.session.credencial){
        // buscamos la lista de ciudades inscritas
        ciudades = req.session.user.suscripcionCiudad.map(function(ciudades){
            return ciudades.nombre;
        });
        console.log("buscando en:");
        console.log(ciudades);
        // preparamos los parametros de la query
        if(req.session.rol === "ciudadano"){
            var params = {
              'ubicacion.nombre': {$in: ciudades}
            };
            if(req.body.categoria){
                params["problemas.categoria"] = req.body.categoria;
            }
        }else{
            var problemas = req.session.user.suscripcionCategoria.map(function(problemas){
                return problemas._id;
            });
            var params = {
              'ubicacion.nombre': {$in: ciudades},
              'problemas': {$in: problemas}
            };
        }
        
        console.log("Parametros de busqueda: ");
        
        // llamamos al modelo de reportes para buscar los reportes
        reporteMod = Mreporte.ReporteModel;
        var query = null;
        if(req.params.ciudad && req.body.skip && req.body.limit){
            skip = parseInt(req.body.skip);
            limit = parseInt(req.body.limit);
           query =  reporteMod.find(params).populate({path: "respuestas", select: "autor", populate: "autor"})
           .populate({path:'problemas',select:'nombre categoria',populate: {path:'categoria',select: '_id nombre'}}).skip(skip).limit(limit).sort({'timestamp': 'desc'});
        }else{
           query =  reporteMod.find(params).populate({path: "respuestas", select: "autor", populate: "autor"});
        }
        query.exec(function(err, reportes){
            if(err){
                res.json({status: 'ERROR', message: "error al hacer la consulta"});
            }else{
                res.json({status: 'OK', message: reportes});   
            }
        });
    }
});

router.post('/list-word/:palabra', function(req, res, next) {
    if(req.session.credencial){
        // buscamos la lista de ciudades inscritas
        ciudades = req.session.user.suscripcionCiudad.map(function(ciudades){
            return ciudades.nombre;
        });
        // preparamos los parametros de la query
        if(req.session.rol === "ciudadano"){
            params = {
              'ubicacion.nombre': {$in: ciudades}
            };   
        }else{
            var problemas = req.session.user.suscripcionCategoria.map(function(problemas){
                return problemas._id;
            });
            params = {
              'ubicacion.nombre': {$in: ciudades},
              'problemas': {$in: problemas}
            };
        }
        
        console.log("mostrando parametros de busqueda");
        console.log(params);
        
        // llamamos al modelo de reportes para buscar los reportes
        reporteMod = Mreporte.ReporteModel;
        var query = null;
        if(req.params.palabra && req.body.skip && req.body.limit){
            skip = parseInt(req.body.skip);
            limit = parseInt(req.body.limit);
           query =  reporteMod.find({$and :[params, {$or: [{titulo: {$regex:  '.*'+req.params.palabra, $options: '$i'}},{descripcion: {$regex:  '.*'+req.params.palabra, $options: '$i'}}]}]}).skip(skip).limit(limit).sort({'timestamp': 'desc'})
               .populate({path: "respuestas", select: "autor", populate: "autor"});
        }else{
           query =  reporteMod.find({$and :[params, {$or: [{titulo: {$regex:  '.*'+req.params.palabra, $options: '$i'}},{descripcion: {$regex:  '.*'+req.params.palabra, $options: '$i'}}]}]}).populate({path: "respuestas", select: "autor", populate: "autor"});
        }
        query.exec(function(err, reportes){
            if(err){
                res.json({status: 'ERROR', message: "error al hacer la consulta"});
            }else{
                res.json({status: 'OK', message: reportes});   
            }
        });
    }
});

router.post('/persona/:id',function(req, res, next){
   if(req.session.credencial){
       myquery =  reporteMod.find({'autor': req.params.id }).populate({path: "respuestas", select: "autor", populate: "autor"}).sort({'timestamp': 'desc'});
       myquery.exec(function(err,reps){
           if(err){
               res.json({status: "ERROR", message: "Ocurrio un error al hacer la consulta"});
           }else{
               res.json({status: "OK",rol: "ciudadano", message: reps, id: req.params.id});
           }
       });
   } else{
       res.json({status: 'ERROR', message: "INVALID"});
   }
});

router.post('/organizacion/:id',function(req, res, next){
   if(req.session.credencial){
        // preparamos los parametros de la query
       if(!req.params.id.empty){
           respuestaMod = Mrespuesta.RespuestaModel;
           query =respuestaMod.find({autor: req.params.id},{autor:1}).populate({path: 'autor', select:'nombre'});
           query.exec(function(err,resp){
               resp = resp.map(function(re){
                   return re._id;
               });
               if(err){
                   res.json({status: "ERROR", message: "Error en consulta de espuestas"});
               }else{
                   // buscar las respuestas con id de las respuestas de la organizacion
                   reporteMod = Mreporte.ReporteModel;
                   queryReps = reporteMod.find({respuestas: {$in: resp}});
                   queryReps.exec(function(err,reports){
                       if(err){
                         res.json({status:"ERROR", message: "Error consultando reportes"});  
                       }else{
                         res.json({status: "OK", message:reports});
                       }
                   });
               }
           });
        }
    }
    else{
       res.json({status: 'ERROR', message: "INVALID"});
   }
});

router.post('/persona2/:id',function(req, res, next){
   if(req.session.credencial){
       console.log(req.session.credencial);
        // preparamos los parametros de la query
       if(!req.params.id.empty){
           params = { 'respuestas.autor': req.params.id };
           console.log(params);
           query =  reporteMod.find(params).populate({path: "respuestas", select: "autor", populate: "autor"}).sort({'timestamp': 'desc'});
           query.exec(function(err,reps){
               if(err){
                   res.json({status: "ERROR", message: "Ocurrio un error al hacer la consulta"});
               }else{
                   res.json({status: "OK", message: reps});
               }
           });
       }
   } else{
       res.json({status: 'ERROR', message: "INVALID"});
   }
});

router.post('/agregar-respuesta',function(req, res, next){
    if(req.session.credencial === req.session.user.email+'organizacion'){
        reporteMod = Mreporte.ReporteModel;
        query = reporteMod.findOneAndUpdate({_id: req.body.reporte},{$addToSet: {'respuestas': req.body.respuesta}});
        query.exec(function(err,rep){
            if(err){
                res.json({status: "ERROR", message: "Erro en la consulta"});
            }else{
                console.log("REPORTE");
                console.log(rep);
                respuestaMod = Mrespuesta.RespuestaModel;
                query = respuestaMod.findOne({_id: req.body.respuesta});
                query.exec(function(err,resp){
                    if(err){
                        res.json({status: "ERROR", message: "ha ocurrido un error al encontrar respuesta"});
                    }else{
                        console.log("RESPUESTA");
                        console.log(resp);
                        res.json({status: "OK", message: resp});
                    }
                });
            }
        });
    }else{
        res.json({status: "ERROR", message: "INVALID"});
    }
});

module.exports = router;