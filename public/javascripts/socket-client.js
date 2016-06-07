var socket = io();

socket.on('messages', function (data) {
    console.log("se ha recibido algo");
});

socket.on("apoyo",function(data){
    var idrepo = $("#btn-apoyo").attr("data-idrep");
    var $toastContent = $('<span class="my-toast"><a href="/'+localStorage.getItem("user")+'/reportes/'+data.reporte+'/details">'+data.message.descripcion+'</a></span>');
        setTimeout(function(){
            Materialize.toast($toastContent, 3000);
        },500);
    if($("#data"+idrepo+".apoyo").length > 0){
        $("#data"+idrepo+".apoyo").html(data.update);
    }
});

socket.on("solucion",function(data){
    var idrepo = data.repo;
    var $toastContent = $('<span class="my-toast"><a href="/'+localStorage.getItem("user")+'/reportes/'+data.repo+'/details">'+data.message.descripcion+'</a></span>');
        setTimeout(function(){
            Materialize.toast($toastContent, 3000);
        },500);
    if($("span#data"+idrepo+".solved").length > 0){
        $("span#data"+idrepo+".solved").html(data.update);
    }
});

socket.on('open', function(){
    if(localStorage.getItem("salas") !== null ){
      misSalas = JSON.parse(localStorage.getItem("salas"));
      for(i=0; i< misSalas.length; i++){
        console.log("unir a la sala: "+misSalas[i]);
       socket.emit('logmeroom',{salas : misSalas[i] });      
      }
    }else{
        console.log("jaja no me uno");
    }
});

// cuando saga de la sesion borra localstorag
socket.on("salir",function(){
    localStorage.clear();
});

$("#form-report").on('submit',function(i,e){
    var locality = localStorage.getItem("ciudad");
    socket.emit("notificar",{channel: locality});
});

$("#mobile-menu").on("click", ".header-opcion-logout", function(){
    localStorage.clear();
});

$(".nav-wrapper .header-opcion-logout").on("click",function(){
    localStorage.clear();
});

socket.on('recibir', function(socketData){
    var $toastContent = $('<span class="my-toast"><a href="/'+localStorage.getItem("user")+'/reportes/'+socketData.repo+'/details">'+socketData.message.descripcion+'</a></span>');
    setTimeout(function(){
        Materialize.toast($toastContent, 3000);
    },500);
    if($(".container-result[data-template=reporte]")){
        paginatorReportes = new Paginator("reporte");
        paginatorReportes.options.url_ajax = "/reporte/list/"+localStorage.getItem("ciudad");
        paginatorReportes.options.numResultsShow = 12;
        paginatorReportes.obtenerTodos();
        paginatorReportes.renderizarTemplate();
    }
});