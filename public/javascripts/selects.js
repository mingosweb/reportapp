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

/* select de agregar respuesta */ 

if($("#btn-add-respuesta").length > 0){
    $("#btn-add-respuesta").on("click",function(){
        if($("#select-respuesta").val() !== ""){
            var respuesta =$("#select-respuesta").val();
            var id_reporte = $("#id-reporte").val();
            $.ajax({
                url: "/reporte/agregar-respuesta",
                data: {respuesta: respuesta, reporte: id_reporte},
                type:'post',
                dataType: 'json',
                success: function(data){
                    if(data.status === "OK"){
                        $('#modal-respuesta').closeModal();
                        div= $("<div class='result-item respuesta'></div>");
                        div_img = $("<div class='respuesta-img'></div>");
                        img = $("<img src='/images/avatar-organizacion.png'/>");
                        div_contenido = $("<div class='respuesta-contenido'><p>"+data.message.message+"</p></div>");
                        div_img.append(img);
                        div.append(div_img);
                        div.append(div_contenido);
                        if($(".container-result[data-template=respuesta]").length > 0){
                            $(".container-result[data-template=respuesta]").find(".element-panel").append(div);
                        }
                    }else{
                        alert("Ocurrio un error al realizar la operacion");
                    }
                },
                error: function(err,objmsj, msj){
                    alert("error en la peticion");
                }
            });
        }else{
            alert("No se han encontrado un input");
        }
    });
}

/* carga de categorias en SELECTS */
if($("select[name=categorias]").length > 0){
  select = $("select[name=categorias]");
  select.empty();
  $.ajax({
      type: 'post',
      url : '/problema/categorias/list',
      dataType: 'json',
      success: function(data){
          if(data.status === "OK"){
              select.append($("<option value='todos'>Todos</option>"));
              for(i = 0; i < data.message.length > 0; i++){
                  option = $("<option value='"+data.message[i]._id+"'>"+data.message[i].nombre+"</option>");
                  select.append(option);
                  select.material_select();
              }
          }else{
              alert("Ocurrió un error consultando");
          }
      },
      error: function(e,msj, msj2){
          alert("error en peticion: "+msj2);
      }
  });
}

if($("select[name=categorias]").length > 0){
  select = $("select[name=categorias]");
    select.on("change",function(i,e){
        cat = select.val();
        $.ajax({
            type: 'post',
            url: '/reporte/list/'+localStorage.getItem('ciudad'),
            dataType: 'json',
            data: {categoria: cat},
            success: function(data){
                alert("resultados: "+data.message.length);
                console.log(data.message);
            },
            error: function(err, msj, msj2){
                alert("error: "+msj2);
            }
        });
    });
}