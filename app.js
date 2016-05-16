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

var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var socketObj = null;

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



io.on('connection',function(socket){
    console.log("new user connected id socket: "+socket.id);

    socket.on("join", function(data){
        //data is a username
        socket.join(data);
        console.log("connected to room: "+data);
        console.log(io.nsps["/"].adapter);
    });
    
    socket.on("notificar",function(data){
        console.log("Aqui vamos a enviar hacia: "+data.channel);
        io.to(data.channel).emit("recibir",{message: "Nuevo hecho en "+data.channel});
    });
    
    /*socket.on("disconnect",function(){
        io.close();
    });*/
    
});

//console.log(io.nsps['/']);

app.use('/', routes);
app.use('/ciudadano', users);
app.use('/organizacion', orgRoutes);
app.use('/admin', adminRoutes);
app.use('/problema',problemaRoutes);

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

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

server.listen(port, ip_address, function () {
  console.log( "Listening on " + ip_address + ", port " + port )
});
