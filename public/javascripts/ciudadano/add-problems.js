$("#btn-suscribir-problemas").on("click", function(i,e){
    var datos = $("form#problemas").serialize();
    /*$.ajax({
        type:'post',
        dataType: 'html',
        data : datos,
        url: '/ciudadano/problemas/suscribir',
        success: function(data){
            if(data.status === 'OK'){
                location.href = '';
            }else{
                if(data.status === 'INVALID'){
                    alert("No tienes permiso");
                }
            }
        },
        error: function(err,msj){
            console.log(err);
        }
    });
    return false;*/
});