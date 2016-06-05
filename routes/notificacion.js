var express = require('express');
var router = express.Router();
var Mnotify = require("../model/Notificacion");

router.post('/list',function(req, res, next){
    //if(req.session.credencial === req.session.user.email+''+req.session.rol){
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
                queryNotify = notifyMod.find({reporte: {$in: idReports}}).sort({fecha: "desc"});
                queryNotify.exec(function(err,not){
                    if(err){
                        res.json({status: 'ERROR', message: "Error al consultar notificaiones"});
                    }else{
                        res.json({status: 'OK', message: not});
                    }
                });
            }
        });
        
    /*}else{
        res.json({status: "ERROR", message: "INVALID REQUEST"});
    }*/
});

module.exports = router