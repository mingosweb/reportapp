$("select").material_select();

// select del registro de reporte

$("#form-report select#categoria").on('change', function(i,e){
    var cat = $("#form-report select#categoria").val();
    $("#form-report select#problema").empty();
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: '/problema/list',
        data: {categoria: cat},
        success: function(data){
            console.log(data.message);
            if(data.status === "OK"){
                if(data.message.length > 0){
                    console.log("Problemas: "+data.message.length);
                    for(var i=0; i < data.message.length; i++){
                    $("#form-report select#problema").append($("<option value='"+data.message[i]._id+"'>"+data.message[i].nombre+"</option>"));
                    }
                }else{
                    $("#form-report select#problema").append($("<option value='null'>Sin problemas</option>"));
                }
            }else{
                console.log("algo paso");
            }
            $("select").material_select();
        },
        error: function(err){
            console.log(err);
        }
    });
});

/*  select de suscripcion de problemas */

$("select#categoria-suscribir").on("change",function(i,e){
    var cat = $("select#categoria-suscribir").val();
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: '/problema/list',
        data: {categoria: cat},
        success: function(data){
            console.log(data.message);
            if(data.status === "OK"){
                $("ul#problemas-list").empty();
                if(data.message.length > 0){
                    console.log("Problemas: "+data.message.length);
                    for(var i=0; i < data.message.length; i++){
                    $("ul#problemas-list").append($("<li><input type='checkbox' id='problem"+i+"' name='problema' value='"+data.message[i]._id+"'/><label for='problem"+i+"'>"+data.message[i].nombre+"</label></li>"));
                    }
                }else{
                    $("ul#problemas-list").append($("Sin problemas relacionados"));
                }
            }else{
                console.log("algo paso");
            }
            $("select").material_select();
        },
        error: function(err){
            console.log(err);
        }
    });
});