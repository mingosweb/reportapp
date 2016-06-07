var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sesion = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/Ciudadano');
var orgRoutes = require('./routes/organizacion.js');
var adminRoutes = require('./routes/admin.js');
var problemaRoutes = require('./routes/problemas.js');
var reporteRoutes = require('./routes/reportes.js');
var notificacionRoutes = require('./routes/notificacion.js');
var respuestaRoutes = require('./routes/respuesta.js');

var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sesion({secret: '123456', resave: true, saveUninitialized: true}));

// eventos de sockets.io del lado del servidor.
io.on('connection',function(socket){
    
    console.log("new user connected id socket: "+socket.id);
    
    //solicitud de socket
    socket.emit('open', "ready");
    
    //evento que une a una sala recibe como datos la ciudad
    socket.on('logmeroom', function(data) { 
        if(data !== null && !data.empty){
            socket.leave(socket.id);
            socket.join(data.salas);
            console.log("unido a sala "+data.salas);
        }else{
            console.log("no se ha unido a nada mas");
        }
    });
    
    //evento para cuando se descconecta
    socket.on("disconnect",function(){
        console.log("te has desconectado io "+socket.id);
    });
    
});

app.use('/', routes.initRouter(io));
app.use('/ciudadano', users.initRouter(io));
app.use('/organizacion', orgRoutes);
app.use('/admin', adminRoutes);
app.use('/problema',problemaRoutes);
app.use('/reporte',reporteRoutes);
app.use('/notificacion',notificacionRoutes);
app.use('/respuesta',respuestaRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

server.listen(3000, function () {
  //console.log('Example app listening on port 3000!');
});