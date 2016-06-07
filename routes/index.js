var express = require('express');
var router = express.Router();
var Ciudad = require("../model/Ciudad");
var Ciudadano = require("../model/Ciudadano");
var Organizacion = require("../model/Organizacion");
var Mcategoria = require("../model/Categoria");
var Mreporte = require("../model/Reporte");
var Mnotify = require("../model/Notificacion");
var Mrespuesta = require("../model/Respuesta");
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

var upload = multer({ storage: storage });

function initRouter(io){

router.get('/', function(req, res, next) {
    res.render('index',{credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol}});
});

router.get('/register',function(req,res,next){
  res.render('register'); 
});

router.post('/autenticate/:email/:password',function(req, res, next){
    CiudadanoModel = Ciudadano.CiudadanoModel;
    query = CiudadanoModel.find({email: req.params.email,password: req.params.password},
                                {suscripcionCiudad: 1, ciudad: 1, email: 1, nick:1, suscripcionCategoria: 1}).populate({path: 'suscripcionCategoria', select: 'nombre categoria', populate: {path: 'categoria', select: 'nombre'}});
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
                res.json({exist: true, data: {ciudad: ciudadanoss[0].ciudad.nombre, email: ciudadanoss[0].email, obj: ciudadanoss[0], rol: req.session.rol}});
            }else{
                OrganizacionMod = Organizacion.OrganizacionModel;
                queryOrg = OrganizacionMod.find({email: req.params.email,password: req.params.password},
                                {suscripcionCiudad: 1, ciudad: 1, email: 1, suscripcionCategoria: 1}).populate({path: 'suscripcionCategoria', select: 'nombre categoria', populate: {path: 'categoria', select: 'nombre'}});
                queryOrg.exec(function(err,orgs){
                   if(err){
                        res.send(err);
                    }
                    else{
                        console.log(orgs);
                        if(orgs.length > 0){
                            req.session.credencial = orgs[0].email+"organizacion";
                            req.session.rol = "organizacion";
                            req.session.nombre= orgs[0].email;
                            req.session.user = orgs[0];
                            res.json({exist: true, data: {ciudad: orgs[0].ciudad.nombre, email: orgs[0].email, obj: orgs[0]}});
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
        query = Mreporte.listarReportes(req.session.user.ciudad.nombre);
        query.exec(function(err,rep){
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
    
router.get("/:email/perfil", function(req, res, next){
    if(req.session.credencial === req.params.email+''+req.session.rol){
       if(req.session.rol === "ciudadano"){
           ciudadanoMod = Ciudadano.CiudadanoModel;
           queryUser = ciudadanoMod.findOne({_id: req.session.user._id},{password: 0, contactosCiudadanos: 0, contactosOrganizaciones: 0});
           vista = "components/config-profile";
       }else{
           orgMod = Organizacion.OrganizacionModel;
           queryUser = orgMod.findOne({_id: req.session.user._id},{password: 0, contactosCiudadanos: 0, contactosOrganizaciones: 0});
           vista = "organizacion/config-profile";
       }
            
        queryUser.exec(function(err, user){
           res.render(vista,{
                                credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol}, 
                                opciones: utilities.menuConfig(req.session.nombre, req.session.rol),
                                activeHeader: "configuracion",
                                user: user
                            }); 
        });     
    }else{
        res.redirect("/");
    }
});
    
router.get("/:email/editar-perfil", function(req, res, next){
    if(req.session.credencial === req.params.email+''+req.session.rol){
        if(req.session.rol === "ciudadano"){
            ciudadanoMod = Ciudadano.CiudadanoModel;
            queryUser = ciudadanoMod.findOne({_id: req.session.user._id},{password: 0, suscripcionCategoria: 0, suscripcionCiudad: 0, contactosCiudadanos: 0, contactosOrganizaciones: 0});
            vista = "components/config-edit-profile";
        }else{
            orgMod = Organizacion.OrganizacionModel;
            queryUser = orgMod.findOne({_id: req.session.user._id},{password: 0, suscripcionCategoria: 0, suscripcionCiudad: 0, contactosCiudadanos: 0, contactosOrganizaciones: 0});
            vista = 'organizacion/config-edit-profile';
        }
        queryUser.exec(function(err, user){
           res.render(vista,{
                                                credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol}, 
                                                opciones: utilities.menuConfig(req.session.nombre, req.session.rol),
                                                activeHeader: "configuracion",
                                                user: user
                                            });   
        });
    }else{
        res.redirect("/");
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
    if(req.session.credencial === req.params.email+'organizacion'){
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
        res.redirect('/'+req.session.email);
    }
});

router.get('/:email/respuestas-rapidas',function(req, res, next){
    if(req.session.credencial === req.params.email+'organizacion'){
        respuestaMod = Mrespuesta.RespuestaModel;
        query =  respuestaMod.find({autor: req.session.user._id});
        query.exec(function(err,respuestas){
            console.log(respuestas);
            if(err){
                res.redirect("/"+req.session.nombre+"/perfil");
            }else{
                res.render('organizacion/config-respuestas',{
                                            credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol}, 
                                            opciones: utilities.menuConfig(req.session.nombre, req.session.rol),
                                            activeHeader: 'configuracion',
                                            respuestas: respuestas
                                          });    
            }
        });
    }else{
        res.redirect("/");
    }
});

router.get('/:email/reportes/mis-reportes',function(req, res, next){
    if(req.session.credencial === req.params.email+''+req.session.rol){
        query = Mreporte.reportesByUser(req.session.user._id);
        query.exec(function(err,rep){
            if(err){
                res.send(err);
            }else{
              res.render('ciudadano/my-reports',{
                                    credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol, id:req.session.user._id}, 
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
    if(req.session.credencial === req.params.email+''+"ciudadano"){
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
    
router.post("/salas",function(req, res, next){
    if(req.session.credencial === req.session.nombre+'ciudadano'){
        ciudadanoMod = Ciudadano.CiudadanoModel;
        query = ciudadanoMod.findOne({_id : req.session.user._id},{suscripcionCiudad: 1});
        query.exec(function(err,ciu){
            ciudades = ciu.suscripcionCiudad.map(function(ciudad){
                return ciudad.nombre;
            });
            res.json({status: "OK", message: ciudades});
        });
    }else{
        res.json({status: "ERROR", message: "INVALID"});
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
                salaOrg = myReport.ubicacion.nombre+""+myReport.problemas[0];
                console.log("enviar a sala: "+salaOrg);
                // enviar a la sala del tipo de problema
                io.to(salaOrg).emit("recibir",{message: {descripcion: "Nuevo hecho en "+myReport.ubicacion.nombre}, repo: reporte._id});
                // enviar a toda la ciudad
                io.to(myReport.ubicacion.nombre).emit("recibir",{message: {descripcion: "Nuevo hecho en "+myReport.ubicacion.nombre}, repo: reporte._id});
                res.redirect("/"+req.params.email);
            }
        });
    }else{
        res.redirect("/");
    }
});
    
router.get('/:email/notificaciones',function(req, res, next){
    if(req.session.credencial === req.params.email+''+req.session.rol){
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
                queryNotify = notifyMod.find({reporte: {$in: idReports}});
                queryNotify.exec(function(err,not){
                    if(err){
                        res.json({status: 'ERROR', message: "Eror al consultar notificaiones"});
                    }else{
                        res.render('components/notifications',{
                                credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol}, 
                                opciones: utilities.menuNotificaciones(req.session.nombre, req.session.rol),
                                activeHeader: 'notificaciones',
                                notificaciones: not
                              });
                    }
                });
            }
        });
        
    }else{
        res.redirect('/');
    }
});
    

router.get("/:email/buscar-notificaciones",function(req, res, next){
    if(req.session.credencial === req.params.email+''+req.session.rol){
        res.render('components/notifications-search',{
                                credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol}, 
                                opciones: utilities.menuNotificaciones(req.session.nombre, req.session.rol),
                                activeHeader: 'notificaciones'});
    }else{
        res.redirect("/");
    }
});
    
router.get('/:email/personas', function(req, res, next){
    if(req.session.credencial === req.params.email+''+req.session.rol){
       res.render('components/reporters',{
                                credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol}, 
                                opciones: utilities.menuPersonas(req.session.nombre, req.session.rol),
                                activeHeader: 'personas'
                              }); 
    }else{
        res.redirect('/');
    }
});
    
router.post('/users/:palabra',function(req, res, next){
    if(req.session.credencial){
        var todos = [];
        query = Ciudadano.usuariosPorCoincidencia(req.params.palabra);
        query.exec(function(err, users){
            if(err){
                return { status: 'ERROR', message: "error al consultar ciudadanos"};
            }else{
                console.log("ciudadanos encontrados: "+users.length);
                if(users.length > 0){
                  Array.prototype.push.apply(todos, users);   
                }
                orgMod = Organizacion.orgsPorCoincidencias(req.params.palabra);
                orgMod.exec(function(err, orgs){
                    if(err){
                        res.json({status: 'ERROR', message: "error al consultar organizaciones"})
                    }else{
                        console.log("orgs encontrados: "+orgs.length);
                        if(orgs.length > 0){
                          Array.prototype.push.apply(todos, orgs);   
                        }
                        res.json({status: "OK", message: todos});
                    }
                });
            }
        });
    }else{
        res.json({status: 'INVALID'});
    }
});
    
router.get('/:email/buscar-reportes',function(req, res, next){
    if(req.session.credencial === req.params.email+''+req.session.rol){
        res.render('components/reports-search',{
                                credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol}, 
                                opciones: utilities.menuReportes(req.session.nombre, req.session.rol),
                                activeHeader: 'reportes'});
    }else{
        res.redirect("/");
    }
});
    
router.get('/:email/reportes/:idrep/details',function(req, res, next){
    if(req.session.credencial === req.params.email+''+req.session.rol){
        console.log(req.session.credencial);
        //buscamos el reporte
        reporteMod = Mreporte.ReporteModel;
        var query = reporteMod.findOne({_id: req.params.idrep}).populate({path: 'autor', select: 'nick email'}).populate({path:'problemas',select:'nombre categoria',populate: {path:'categoria', select: 'nombre'}})
        .populate({path: 'respuestas', populate: {path: 'autor', select: 'nombre'}});
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
                    // si es una organizacion hay que las respuestas que necesita
                    if(req.session.rol === "organizacion"){
                        respuestas = Mrespuesta.respuestasById(req.session.user._id);
                        respuestas.exec(function(err,resp){
                            if(err){
                                res.json({status: "ERROR", message: "Error al consultar en base de datos"});
                            }else{
                                console.log(resp);
                                res.render('reportes/details',{
                                    credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol}, 
                                    opciones: utilities.menuReportes(req.session.nombre, req.session.rol),
                                    activeHeader: "reportes",
                                    reporte: report,
                                    respuestasIn: resp
                                });
                            }
                        });
                    }
                    else if(req.session.rol === "ciudadano"){
                        res.render('reportes/details',{
                                    credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol}, 
                                    opciones: utilities.menuPersonas(req.session.nombre, req.session.rol),
                                    activeHeader: "reportes",
                                    reporte: report
                                });
                    }
                }
            }
        });
    }else{
        res.redirect("/");
    }
});
    
router.get('/:email/mis-contactos',function(req, res,next){
   if(req.session.credencial === req.params.email+''+req.session.rol){
           res.render('components/my-contacts',{
                                                credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol}, 
                                                opciones: utilities.menuPersonas(req.session.nombre, req.session.rol),
                                                activeHeader: "personas",
                                            });
   }else{
       res.redirect('/');
   }
});
    
router.get('/personas/:nombre',function(req, res, next){
    ciudadanoMod = Ciudadano.CiudadanoModel;
    query = ciudadanoMod.findOne({nick: req.params.nombre}).populate({path: 'suscripcionCategoria', select: 'nombre categoria', populate: {path: 'categoria', select: 'nombre'}});
    query.exec(function(err,user){
        if(err){
            res.send("error en consulta de usuarios");
        }else{
            if(user === null){
                orgMod = Organizacion.OrganizacionModel;
                queryOrg = orgMod.findOne({nombre: req.params.nombre}).populate({path: 'suscripcionCategoria', select: 'nombre categoria', populate: {path: 'categoria', select: 'nombre'}});
                queryOrg.exec(function(err,org){
                    if(err){
                        res.send("error consultando org");
                    }else{
                        res.render('components/profile', {
                                                credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol}, 
                                                opciones: utilities.menuReportes(req.session.nombre, req.session.rol),
                                                activeHeader: "personas",
                                                persona: org
                                            });
                    }
                });
            }else{
                var reports = Mreporte.reportesByUser(user._id);
                reports.exec(function(err,reps){
                    var results = [];
                    if(err){
                        results = results;
                    }else{
                        results = reps;
                        res.render('components/profile', {
                            credencial: {passport: req.session.credencial, nombre: req.session.nombre, rol: req.session.rol}, 
                            opciones: utilities.menuReportes(req.session.nombre, req.session.rol),
                            activeHeader: "personas",
                            persona: user,
                            reportes: results
                        });
                    }
                });
            }
        }
    });
});

router.post('/place',function(req, res, next){
    places.searchText(req.body.query).then((respuesta) => {
      res.json(respuesta);
    }).catch((err) => {
      console.log(err);
        res.send(err);
    });
});
    
    return router;
    
}

module.exports.initRouter = initRouter;