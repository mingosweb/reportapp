//enviar un nuevo apoyo
$("#btn-apoyo").on("click",function(){
    var idrepo = $("#btn-apoyo").attr("data-idrep");
    $.ajax({
        url: "/ciudadano/reporte/"+idrepo+"/apoyar",
        type: 'post',
        dataType: 'json',
        data: { algo: 0 },
        success: function(data){
            
        },
        err: function(err){
            alert(err+"kjuemadre");
            var $toastContent = $('<span class="my-toast">'+data.message+'</span>');
            setTimeout(function(){
                Materialize.toast($toastContent, 3000);
            },500);
        }
    });
    return false;
});

// eliminar un reporte
$("#btn-eliminar").on("click",function(){
    var idrepo = $("#btn-apoyo").attr("data-idrep");
    $.ajax({
        url: "/ciudadano/reporte/"+idrepo+"/eliminar",
        type: 'post',
        dataType: 'json',
        data: { algo: 0 },
        success: function(data){
            location.href = data.url;
            setTimeout(function(){
               var $toastContent = $('<span class="my-toast">'+data.message+'</span>');
            Materialize.toast($toastContent, 2000);
            },1000);
        },
        err: function(err){
            var $toastContent = $('<span class="my-toast">'+err+'</span>');
            setTimeout(function(){
                Materialize.toast($toastContent, 3000);
            },500);
        }
    });
    return false;
});

//enviar un nuevo apoyo
$("#btn-solucionar").on("click",function(){
    var idrepo = $("#btn-apoyo").attr("data-idrep");
    $.ajax({
        url: "/ciudadano/reporte/"+idrepo+"/solucionar",
        type: 'post',
        dataType: 'json',
        data: { algo: 0 },
        success: function(data){
            if(data.status === "solved" || data.status === "ERROR"){
                var $toastContent = $('<span class="my-toast">'+data.message+'</span>');
                setTimeout(function(){
                    Materialize.toast($toastContent, 3000);
                },500);
            }
        },
        err: function(err){
            var $toastContent = $('<span class="my-toast">'+data.message+'</span>');
            setTimeout(function(){
                Materialize.toast($toastContent, 3000);
            },500);
        }
    });
    return false;
});

// añadir un nuevo usuario
if($("#btn-add-user").length > 0){
    $("#btn-add-user").on("click",function(){
        var ids = $("#id_people").val();
        var rolIn = $("#id_rol").val();
        $.ajax({
            url: '/ciudadano/personaadd',
            dataType: 'json',
            type: 'post',
            data: {idpersona: ids, rol: rolIn},
            success: function(data){
                if(data.status === "OK"){
                    var $toastContent = $('<span class="my-toast">'+data.message+'</span>');
                    setTimeout(function(){
                        Materialize.toast($toastContent, 2000);
                    },500);
                }else if(data.status === "ERROR"){
                    var $toastContent = $('<span class="my-toast">'+data.message+'</span>');
                    setTimeout(function(){
                        Materialize.toast($toastContent, 2000);
                    },500);
                }
            },
            error: function(err, objmsj, msj){
                alert("error en la peticion");
            }
        });
    });
};

// eliminar usuairo
if($("#btn-delete-user")){
    $("#btn-delete-user").on("click", function(){
        var ids = $("#id_people").val();
        var rolIn = $("#id_rol").val();
        $.ajax({
            url: '/ciudadano/personaremove',
            dataType: 'json',
            type: 'post',
            data: {idpersona: ids, rol: rolIn},
            success: function(data){
                if(data.status === "OK"){
                    var $toastContent = $('<span class="my-toast">'+data.message+'</span>');
                    setTimeout(function(){
                        Materialize.toast($toastContent, 2000);
                    },500);
                }else if(data.status === "ERROR"){
                    var $toastContent = $('<span class="my-toast">'+data.message+'</span>');
                    setTimeout(function(){
                        Materialize.toast($toastContent, 2000);
                    },500);
                }
            },
            error: function(err, objmsj, msj){
                alert("error en la peticion");
            }
        });
    });
}