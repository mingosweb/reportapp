function socketServer(socket){
    this.socketCurrent = socket;
    /*console.log("inicializado socket");
    console.log("entra: "+socket);
    console.log("sale: "+this.socketCurrent);*/
}

socketServer.prototype.init = function(ciudad,email){
    /*this.socketCurrent.room = ciudad;
    this.socketCurrent.join(ciudad);*/
    console.log("Te has conectado "+email+" a "+ciudad);
}

socketServer.prototype.emit = function(data, ciudad){
    /*console.log("enviando a: "+ciudad);
    this.io.sockets.to(ciudad).emit('recibir', {message: "se ha agregado un reporte"});
    console.log("listo");*/
};

module.exports = socketServer;