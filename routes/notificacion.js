var express = require('express');
var router = express.Router();
var Mnotify = require("../model/Notificacion");
var Mrespuesta = require("../model/Respuesta");
var Mreporte = require("../model/Reporte");

router.post('/ciudadano/list',function(req, res, next){
    if(req.session.credencial === req.session.user.email+''+req.session.rol){
        //busqueda de reportes donde haya actuado el usuario
        notifyMod = Mnotify.NotificacionModel;
        queryReport = notifyMod.find({'autor': req.session.user._id},{reporte: 1, _id: 0});
        queryReport.exec(function(err,reports){
            //res.json(reports);
            if(err){
                res.json({status: 'Error'});
            }else{
                // recorrer y obtener los ids de los reportes
                var idReports = [];
                for(var i=0; i< reports.length; i++){
                    idReports.push(reports[i].reporte);
                }
                // buscar las notificaciones con esos ids
                if(req.body.skip && req.body.limit){
                    // parametros
                    skip = parseInt(req.body.skip);
                    limit = parseInt(req.body.limit);
                    queryNotify = notifyMod.find({reporte: {$in: idReports}}).skip(skip).limit(limit).sort({fecha: "desc"});
                }else{
                    queryNotify = notifyMod.find({reporte: {$in: idReports}}).sort({fecha: "desc"});
                }
                queryNotify.exec(function(err,not){
                    if(err){
                        res.json({status: 'ERROR', message: "Error al consultar notificaiones"});
                    }else{
                        res.json({status: 'OK', message: not});
                    }
                });
            }
        });
        
    }else{
        res.json({status: "ERROR", message: "INVALID REQUEST"});
    }
});

router.post('/ciudadano/list-word/:palabra',function(req, res, next){
    if(req.session.credencial === req.session.user.email+''+req.session.rol){
        //busqueda de reportes donde haya actuado el usuario
        notifyMod = Mnotify.NotificacionModel;
        queryReport = notifyMod.find({'autor': req.session.user._id},{reporte: 1, _id: 0});
        queryReport.exec(function(err,reports){
            //res.json(reports);
            if(err){
                res.json({status: 'Error'});
            }else{
                // recorrer y obtener los ids de los reportes
                var idReports = [];
                for(var i=0; i< reports.length; i++){
                    idReports.push(reports[i].reporte);
                }
                // buscar las notificaciones con esos ids
                if(req.body.skip && req.body.limit){
                    // parametros
                    skip = parseInt(req.body.skip);
                    limit = parseInt(req.body.limit);
                    queryNotify = notifyMod.find({$and: [{reporte: {$in: idReports}},{$or: [{titulo: {$regex:  '.*'+req.params.palabra, $options: '$i'}},{descripcion: {$regex:  '.*'+req.params.palabra, $options: '$i'}}]}]}).skip(skip).limit(limit).sort({fecha: "desc"});
                }else{
                    queryNotify = notifyMod.find({$or: [{titulo: {$regex:  '.*'+req.params.palabra, $options: '$i'}},{descripcion: {$regex:  '.*'+req.params.palabra, $options: '$i'}}]}).sort({fecha: "desc"});
                }
                queryNotify.exec(function(err,not){
                    if(err){
                        res.json({status: 'ERROR', message: "Error al consultar notificaiones"});
                    }else{
                        res.json({status: 'OK', message: not});
                    }
                });
            }
        });
        
    }else{
        res.json({status: "ERROR", message: "INVALID REQUEST"});
    }
});

router.post('/organizacion/list',function(req, res, next){
    if(req.session.credencial === req.session.user.email+'organizacion'){
        respuestaMod = Mrespuesta.RespuestaModel;
           query =respuestaMod.find({autor: req.session.user._id},{autor:1}).populate({path: 'autor', select:'nombre'});
           query.exec(function(err,resp){
               resp = resp.map(function(re){
                   return re._id;
               });
               if(err){
                   res.json({status: "ERROR", message: "Error en consulta de espuestas"});
               }else{
                   // buscar las respuestas con id de las respuestas de la organizacion
                   reporteMod = Mreporte.ReporteModel;
                   queryReps = reporteMod.find({respuestas: {$in: resp}},{_id: 1});
                   queryReps.exec(function(err,reports){
                       if(err){
                         res.json({status:"ERROR", message: "Error consultando reportes"});  
                       }else{
                            reports = reports.map(function(rep){
                                return rep._id;
                            });
                            // vemos los limites 
                            if(req.body.skip && req.body.limit){
                                // parametros
                                skip = parseInt(req.body.skip);
                                limit = parseInt(req.body.limit);
                                queryNotify = notifyMod.find({reporte: {$in: reports}}).skip(skip).limit(limit).sort({fecha: "desc"});
                            }else{
                                queryNotify = notifyMod.find({reporte: {$in: reports}}).sort({fecha: "desc"});
                            }
                            queryNotify.exec(function(err,not){
                                if(err){
                                    res.json({status: 'ERROR', message: "Error al consultar notificaiones"});
                                }else{
                                    res.json({status: 'OK', message: not});
                                }
                            });
                       }
                   });
               }
           });
        
    }else{
        res.json({status: "ERROR", message: "INVALID REQUEST"});
    }
});

router.post('/organizacion/list-word/:palabra',function(req, res, next){
    if(req.session.credencial === req.session.user.email+'organizacion'){
        respuestaMod = Mrespuesta.RespuestaModel;
           query =respuestaMod.find({autor: req.session.user._id},{autor:1}).populate({path: 'autor', select:'nombre'});
           query.exec(function(err,resp){
               resp = resp.map(function(re){
                   return re._id;
               });
               if(err){
                   res.json({status: "ERROR", message: "Error en consulta de espuestas"});
               }else{
                   // buscar las respuestas con id de las respuestas de la organizacion
                   reporteMod = Mreporte.ReporteModel;
                   queryReps = reporteMod.find({respuestas: {$in: resp}},{_id: 1});
                   queryReps.exec(function(err,reports){
                       if(err){
                         res.json({status:"ERROR", message: "Error consultando reportes"});  
                       }else{
                            reports = reports.map(function(rep){
                                return rep._id;
                            });
                            // vemos los limites 
                            if(req.body.skip && req.body.limit){
                                // parametros
                                skip = parseInt(req.body.skip);
                                limit = parseInt(req.body.limit);
                                queryNotify = notifyMod.find({$and: [{reporte: {$in: reports}},{$or: [{titulo: {$regex:  '.*'+req.params.palabra, $options: '$i'}},{descripcion: {$regex:  '.*'+req.params.palabra, $options: '$i'}}]}]}).skip(skip).limit(limit).sort({fecha: "desc"});
                            }else{
                                queryNotify = notifyMod.find({reporte: {$in: reports}}).sort({fecha: "desc"});
                            }
                            queryNotify.exec(function(err,not){
                                if(err){
                                    res.json({status: 'ERROR', message: "Error al consultar notificaiones"});
                                }else{
                                    res.json({status: 'OK', message: not});
                                }
                            });
                       }
                   });
               }
           });
        
    }else{
        res.json({status: "ERROR", message: "INVALID REQUEST"});
    }
});

module.exports = router