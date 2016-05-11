var socket = io.connect('http://localhost:3000');

socket.on('connection', function (data) {
    console.log(data);
});

$("#form-report").on('submit',function(i,e){
    var locality = $("#reportLocality").html();
    socket.emit("notificar",{channel: locality});
});

socket.on('recibir', function(socketData){
    var $toastContent = $('<span class="my-toast">'+socketData.message+'</span>');
    setTimeout(function(){
        Materialize.toast($toastContent, 3000);
    },2000);
});