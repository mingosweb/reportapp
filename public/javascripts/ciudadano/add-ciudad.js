if($("form#ciudades").length > 0){
    $.ajax({
        type: 'post',
        url: '/salas',
        dataType: 'json',
        success: function(data){
            if(data.status === "OK"){
              salasStr = JSON.stringify(data.message);  
              for(var i= 0; i < data.message.length; i++){
                  socket.emit('logmeroom',{salas : data.message[i] });
              }
              localStorage.setItem("salas",salasStr);  
            }else{
                alert("no se pudo almacenar la ciudad");
            }
        },
        error: function(error, msj, msj2){
            alert("ocurrio un error en la peticion");
            alert(msj2);
        }
    });
}