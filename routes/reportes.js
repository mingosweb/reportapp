var express = require('express');
var router = express.Router();
var Mreporte = require("../model/Reporte");

router.post('/list/:ciudad/:skip/:limit', function(req, res, next) {
    if(req.session.credencial){
        reporteMod = Mreporte.ReporteModel;
        var query = null;
        if(req.params.ciudad && req.params.skip && req.params.limit){
           query =  reporteMod.find({'ubicacion.nombre': req.params.ciudad}).skip(req.params.skip).limit(req.params.limit);
        }else{
           query =  reporteMod.find({'ubicacion.nombre': req.params.ciudad});
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

module.exports = router;