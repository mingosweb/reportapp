input_email = $("form#form-register-ciudadano input#email");
input_nick = $("form#form-register-ciudadano input#nick");
can_continue = false;
$("form#form-register-ciudadano").on('submit',function(i,e){
	email = input_email.val();
	nick = input_nick.val();

	$.ajax({
		type: 'get',
		dataType: 'json',
		url: '/ciudadano/validate/'+nick+'/'+email,
		success: function(data){
			if(data.exist === true){
				alert("Aun hay datos invalidos");
				return false;
			}else{
				$.ajax({
			        url: '/ciudadano/add',
			        type: 'post',
			        dataType: 'json',
			        data: $('form#form-register-ciudadano').serialize(),
			        success: function(data) {
                        if(data.status === "ok"){
                          var $toastContent = $('<span class="my-toast">Registro con exito! Bienvenido</span>');
                          Materialize.toast($toastContent, 3000);
                          setTimeout(function(){
                              location.href = "/";
                          },2000);
                        }
			        },
			        error: function(data){
			        	alert("no guardado");
			        }
			    });
			}
		},
		error: function(err){
			alert(err);
			return false;
		}
	});

	return false;

});

$('form#form-register-ciudadano input#email').on('change',function(i,e){
	email = input_email.val();
	$.ajax({
		type: 'get',
		dataType: 'json',
		url: '/ciudadano/validate-email/'+email,
		success: function(data){
			if(data.exist ===  true){
				$('label#label-email').html("El email ya está registrado")
			}
			else{
				$('label#label-email').html("El email está disponible")
			}
			return false;
		},
		error: function(err){
			return false;
		}
	});
}); 

$('form#form-register-ciudadano input#nick').on('change',function(i,e){
	nick = input_nick.val();
	$.ajax({
		type: 'get',
		dataType: 'json',
		url: '/ciudadano/validate-nick/'+nick,
		success: function(data){
			if(data.exist ===  true){
				$('label#label-nick').html("El nick ya está registrado")
			}
			else{
				$('label#label-nick').html("El nick está disponible")
			}
			return false;
		},
		error: function(err){
			return false;
		}
	});
});

/*$("form#form-register-ciudadano input#ciudad").on("blur",function(i,e){
    setTimeout(function(){
        var ciudad = $("input#ciudad").val();
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/place',
            data: {query: ciudad},
            success: function(data){
                if(data.status == "OK"){
                    alert("coordenadas: lat"+data.results[0].geometry.location.lat);
                }
            },
            error: function(err){
                alert("Hubo un error al ingresar la ciudad");
            }
        });
    }, 1000);
});*/