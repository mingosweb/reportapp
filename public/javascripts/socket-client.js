var socket = io();

socket.on('messages', function (data) {
    console.log("se ha recibido algo");
});

socket.on("apoyo",function(data){
    var idrepo = $("#btn-apoyo").attr("data-idrep");
    var $toastContent = $('<span class="my-toast">'+data.message+'</span>');
        setTimeout(function(){
            Materialize.toast($toastContent, 3000);
        },500);
    if($("#data"+idrepo+".apoyo").length > 0){
        $("#data"+idrepo+".apoyo").html(data.update);
    }
});

socket.on("solucion",function(data){
    var idrepo = data.repo;
    var $toastContent = $('<span class="my-toast">'+data.message+'</span>');
        setTimeout(function(){
            Materialize.toast($toastContent, 3000);
        },500);
    if($("span#data"+idrepo+".solved").length > 0){
        $("span#data"+idrepo+".solved").html(data.update);
    }
});

socket.on('open', function(){
    if(localStorage.getItem("ciudad") !== null ){
      ciudad = localStorage.getItem("ciudad");
      socket.emit('logmeroom',{room : ciudad });   
    }else{
        console.log("jaja no me uno");
    }
});

$("#form-report").on('submit',function(i,e){
    var locality = localStorage.getItem("ciudad");
    socket.emit("notificar",{channel: locality});
});

$("#mobile-menu").on("click", ".header-opcion-logout", function(){
    localStorage.clear();
});

socket.on('recibir', function(socketData){
    var $toastContent = $('<span class="my-toast">'+socketData.message+'</span>');
    setTimeout(function(){
        Materialize.toast($toastContent, 3000);
    },2000);
});