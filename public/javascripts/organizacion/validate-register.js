input_email = $("form#form-register-organizacion input#email-org");
$("form#form-register-organizacion").on('submit',function(i,e){
	email = input_email.val();
	$.ajax({
		type: 'get',
		dataType: 'json',
		url: '/organizacion/validate/'+email,
		success: function(data){
			if(data.exist === true){
				alert("Aun hay datos invalidos");
				return false;
			}else{
				$.ajax({
			        url: '/organizacion/add',
			        type: 'post',
                    dataType: 'json',
			        data: $('form#form-register-organizacion').serialize(),
			        success: function(data) {
                        if(data.status === "OK"){
                            var $toastContent = $('<span class="my-toast">Registro con exito! Bienvenido</span>');
                            Materialize.toast($toastContent, 1000);
                            setTimeout(function(){
                                location.href = "/";
                            },1000);
                        }else{
                            alert("NO! "+data.data);
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

$('form#form-register-organizacion input#email-org').on('change',function(i,e){
	email = input_email.val();
	$.ajax({
		type: 'get',
		dataType: 'json',
		url: '/organizacion/validate/'+email,
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