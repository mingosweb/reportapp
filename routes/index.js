var express = require('express');
var router = express.Router();
var Ciudad = require("../model/Ciudad");
var Ciudadano = require("../model/Ciudadano");
var Organizacion = require("../model/Organizacion");
var Mcategoria = require("../model/Categoria");
var Mreporte = require("../model/Reporte");
var mongoose = require("mongoose");
var multer = require("multer");
var utilities = require("./utilities/menus");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/photos')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })

//function initRouter(socket){

/* socketMod = require("./utilities/socket-server");
mySocket = new socketMod(socket); */

router.get('/', function(req, res, next) {
    res.render('index',{credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol}});
});

router.get('/register',function(req,res,next){
  res.render('register'); 
});

router.post('/autenticate/:email/:password',function(req, res, next){
    CiudadanoModel = Ciudadano.CiudadanoModel;
    query = CiudadanoModel.find({email: req.params.email,password: req.params.password}).populate({path: 'suscripcionCategoria', select: 'nombre categoria', populate: {path: 'categoria', select: 'nombre'}});
    query.exec(function(err,ciudadanoss){
        if(err){
            res.send(err);
            console.log("hubo error con ciudadanos");
        }
        else{
            if(ciudadanoss.length > 0){
                req.session.credencial = ciudadanoss[0].email+"ciudadano";
                req.session.rol = "ciudadano";
                req.session.nombre = ciudadanoss[0].email;
                req.session.user = ciudadanoss[0];
                console.log("entre a ciudadanos y cree sesion");
                res.json({exist: true, data: {ciudad: ciudadanoss[0].ciudad.nombre, email: ciudadanoss[0].email}});
            }else{
                OrganizacionMod = Organizacion.OrganizacionModel;
                queryOrg = OrganizacionMod.find({email: req.params.email, password: req.params.password}).populate({path: 'suscripcionCategoria', select: 'nombre categoria', populate: {path: 'categoria', select: 'nombre'}});
                queryOrg.exec(function(err,orgs){
                   if(err){
                        res.send(err);
                    }
                    else{
                        if(orgs.length > 0){
                            req.session.credencial = orgs[0].email+"organizacion";
                            req.session.rol = "organizacion";
                            req.session.nombre= orgs[0].email;
                            req.session.user = orgs[0];
                            console.log("entre a organizacion y cree sesion");
                            //mySocket.init(orgs[0].ciudad.nombre,orgs[0].email);
                            res.json({exist: true, data: {ciudad: orgs[0].ciudad.nombre, email: orgs[0].email}});
                        }else{
                            res.json({exist: false, message: 'Usuario y contraseña no coinciden'});
                        }
                    } 
                });
            }
        }
    });
});

router.get('/:email',function(req, res, next){
    if(req.session.credencial === req.params.email+''+req.session.rol){
        query = Mreporte.listarReportes(req.session.user.ciudad.nombre,0,12);
        query.exec(function(err,rep){
            console.log(rep);
            if(err){
                console.log(err);
            }
           res.render('components/home-user',{
                                                credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol}, 
                                                opciones: utilities.menuReportes(req.session.nombre, req.session.rol),
                                                reportes: rep,
                                                activeHeader: "reportes"
                                            }); 
        });
    }else{
        res.redirect('/');
    }
});

router.get('/:email/nuevo-reporte',function(req, res, next){
    if(req.session.credencial === req.params.email+'ciudadano'){
        categoriaMod = Mcategoria.CategoriaModel;
        categoriaMod.find({},function(err, cats){
           if(err) {
               res.send("error al cargar categorias");
           }else{
               if(cats.length > 0){
                   res.render('ciudadano/report-new',{
                                            credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol}, user: req.session.user, categorias: cats, activeHeader: 'reportes'
                                          });
               }else{
                   res.send("no se encontraron categorias");
               }
           }
        });
    }else{
        res.redirect('/');
    }
});

router.get('/:email/config',function(req, res, next){
    if(req.session.credencial === req.params.email+''+req.session.rol){
        var categoriaMod = Mcategoria.CategoriaModel;
        categoriaMod.find({},function(err, cats){
           if(err) {
               res.send("error al cargar categorias");
           }else{
               if(cats.length > 0){
                   if(req.session.rol === "ciudadano"){
                        var ciudadanoMod = Ciudadano.CiudadanoModel;   
                   }else{
                       var ciudadanoMod = Organizacion.OrganizacionModel;   
                   }
                   var suscrip = [];
                    query = ciudadanoMod.findOne({email: req.params.email}).populate({path: 'suscripcionCategoria', select: 'nombre categoria', populate: {path: 'categoria', select: 'nombre'}});
                    query.exec(function(err,ciu){
                        suscrip = ciu.suscripcionCategoria;
                        res.render('ciudadano/config',{
                                            credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol}, 
                                            opciones: utilities.menuConfig(req.session.nombre, req.session.rol),
                                            categorias: cats,
                                            suscripcion: suscrip,
                                            activeHeader: 'configuracion'
                                          });
                    });
               }else{
                   res.send("no se encontraron categorias");
               }
           }
        });
    }else{
        res.redirect('/');
    }
});

router.get('/:email/reportes/mis-reportes',function(req, res, next){
    if(req.session.credencial === req.params.email+''+req.session.rol){
        query = Mreporte.reportesByUser(req.session.user._id);
        query.exec(function(err,rep){
            if(err){
                res.send(err);
            }else{
              res.render('components/home-user',{
                                    credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol}, 
                                    opciones: utilities.menuReportes(req.session.nombre, req.session.rol),
                                    reportes: rep,
                                    activeHeader: "reportes",
                                    active: "mis reportes"
                                    });  
            }
        });
    }else{
        res.redirect("/");
    }    
});
    
router.get('/:email/suscribir-ciudad',function(req, res, next){
    if(req.session.credencial === req.params.email+''+req.session.rol){
        var suscrip = [];
        CiudadanoModel = Ciudadano.CiudadanoModel;
        query = CiudadanoModel.findOne({email: req.params.email}).populate({path: 'suscripcionCiudad'});
        query.exec(function(err,ciu){
            suscrip = ciu.suscripcionCiudad;
            console.log(suscrip);
            res.render('ciudadano/config-susc-ciudades',{
                                credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol}, 
                                opciones: utilities.menuConfig(req.session.nombre, req.session.rol),
                                suscripcion: suscrip,
                                activeHeader: 'configuracion'
                              });
        });
    }else{
        res.redirect("/");
    }
});

router.get('/user/logout',function(req, res, next){
    req.session.destroy();
    res.redirect('/');
});

router.post('/:email/report/add', upload.array('photos',4), function(req, res, next){
    if(req.session.credencial === req.params.email+''+"ciudadano"){
        var urlPhotos = [];
        if(req.files.length > 0){
            for(var i= 0; i < req.files.length; i++){
                urlPhotos.push(req.files[i].filename);
            }
        }
        var problemasArray = [];
        problemasArray.push(req.body.problema);
        var myReport = {
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            url_fotos: urlPhotos,
            autor: req.session.user._id,
            problemas: problemasArray,
            ubicacion: {
                nombre: req.session.user.ciudad.nombre,
                lat: req.body.lat,
                lng: req.body.lng,
            }
        }
        reporteMod = Mreporte.ReporteModel;
        reporteObj = new reporteMod(myReport);
        reporteObj.save(function(err, reporte){
            if(err){
                res.json({status: "ERROR"});
            }else{
                res.redirect("/"+req.params.email);
            }
        });
    }else{
        res.redirect("/");
    }
});
    
router.get('/:email/reportes/:idrep/details',function(req, res, next){
    if(req.session.credencial === req.params.email+''+req.session.rol){
        //buscamos el reporte
        reporteMod = Mreporte.ReporteModel;
        console.log("buscando por: "+req.params.idrep);
        var query = reporteMod.findOne({_id: req.params.idrep}).populate({path: 'autor', select: 'nick email'}).populate({path:'problemas',select:'nombre categoria',populate: {path:'categoria', select: 'nombre'}});
        query.exec(function(err, report){
            if(err){
                res.send("error en reporte: "+err);
            }else{
                if(report === null){
                    res.render("reportes/report-null",{
                                                credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol}, 
                                                opciones: utilities.menuReportes(req.session.nombre, req.session.rol),
                                                activeHeader: "reportes",
                                                reporte: report
                                            });
                }else{
                    res.render('reportes/details',{
                                                credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol}, 
                                                opciones: utilities.menuReportes(req.session.nombre, req.session.rol),
                                                activeHeader: "reportes",
                                                reporte: report
                                            });
                }
            }
        });
    }else{
        res.redirect("/");
    }
});

router.post('/place',function(req, res, next){
    places.searchText(req.body.query).then((respuesta) => {
      res.json(respuesta);
    }).catch((err) => {
      console.log(err);
        res.send(err);
    });
});
    
  //  return router;
    
//}

module.exports = router;