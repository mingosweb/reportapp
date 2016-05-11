$("#btn-suscribir-problemas").on("click", function(i,e){
    var datos = $("form#problemas").serialize();
    $.ajax({
        type:'post',
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
            }*/
            alert(data);
        },
        error: function(err,msj){
            alert(msj);
        }
    });
    return false;
});