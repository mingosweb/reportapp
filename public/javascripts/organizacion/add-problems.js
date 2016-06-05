$("#btn-suscribir-problemas").on("click", function(i,e){
    var datos = $("form#problemas").serialize();
    /*$.ajax({        type:'post',
        dataType: 'html',
        data : datos,
        url: '/organizacion/problemas/suscribir',
        success: function(data){
            /*if(data.status === 'OK'){
                alert("todo bien");
            }else{
                if(data.status === 'INVALID'){
                    alert("No tienes permiso");
                }
            }
            alert(data);
        },
        error: function(err,msj){
            alert(msj);
        }
    });
    return false;*/
});

if($("form#problemas").length > 0){
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: '/organizacion/misproblemas/list/',
        success: function(data){
            if(data.status === "OK"){
                for(var i=0; i < data.message.length; i++){
                    socket.emit('logmeroom',{salas : data.message[i] });   
                }
                salasStr = JSON.stringify(data.message);
                localStorage.setItem("salas",salasStr);
            }else{
                console.log("algo pasó");
            }
        },
        error: function(err, msj, msj2){
            alert("Error: "+msj2);
        }
    });
}