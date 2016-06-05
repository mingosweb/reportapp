var express = require('express');
var router = express.Router();
var Mrespuesta = require("../model/Respuesta");

router.post("/add",function(req, res, next){
    if(req.session.credencial === req.session.user.email+'organizacion'){
        respuestaMod = Mrespuesta.RespuestaModel;
        objeto = new respuestaMod({
            message: req.body.message,
            autor: req.session.user._id
        });
        objeto.save(function(err,respues){
            if(err){
                res.json({status: "ERROR", message: "Error en la consulta"});
            }else{
                res.redirect("/"+req.session.nombre+"/respuestas-rapidas");
            }
        });
    }else{
        res.json({status: "ERROR", message: "INVALID"});
    }
});

router.get('/remove/:id', function(req, res, next){
    if(req.session.credencial === req.session.nombre+'organizacion'){
        respuestaMod = Mrespuesta.RespuestaModel;
        query = respuestaMod.remove({_id: req.params.id});
        query.exec(function(err,resp){
            res.redirect("/"+req.session.nombre+"/respuestas-rapidas");
        });
    }else{
        res.redirect("/"+req.session.nombre);
    }
});

function timeDifference(current, previous) {
    
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    
    var elapsed = current - previous;
    var format = function(time,unity){
        if(time === 1){
            return "hace "+time+" "+unity;
        }else{
            if(unity === "meses"){
                return "hace "+time+" "+unity+"es";
            }else{
                return "hace "+time+" "+unity+"s";
            }
        }
    };
    
    if (elapsed < msPerMinute) {
        time = Math.round(elapsed/1000);
        return format(time,"segundo");
    }
    
    else if (elapsed < msPerHour) {
         time = Math.round(elapsed/msPerMinute);
         return format(time, "minuto");
    }
    
    else if (elapsed < msPerDay ) {
         time = Math.round(elapsed/msPerHour );   
        return format(time,"hora");
    }

    else if (elapsed < msPerMonth) {
         time = Math.round(elapsed/msPerDay);   
        return format(time,"dia");
    }
    
    else if (elapsed < msPerYear) {
         time = Math.round(elapsed/msPerMonth);
        return format(time,"mes")
    }
    
    else {
         time = Math.round(elapsed/msPerYear );
        return format(time,"año");
    }
}

module.exports = router;