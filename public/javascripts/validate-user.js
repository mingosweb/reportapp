input_email = $("form#form-login input#email");
input_pass = $("form#form-login input#password");

$("#btn-login").on('click',function(i,e){
	email = input_email.val();
    pass = input_pass.val();
    console.log('/autenticate/'+email+'/'+pass);
	$.ajax({
		type: 'post',
		dataType: 'json',
		url: '/autenticate/'+email+'/'+pass,
		success: function(data){        
            if(data.exist === false){
                $("#label-email").html(data.message);
                return true;
                input_email.val("");
                input_pass.val("");
            }else{
                var problemas = data.data.obj.suscripcionCategoria;
                var ciudades = data.data.obj.suscripcionCiudad;
                var salas = [];
                
                if(data.data.rol === "ciudadano"){
                    for(j=0; j<ciudades.length;j++){
                        salas.push(ciudades[j].nombre);
                    }
                }else{
                    for(i=0;i< problemas.length;i++){
                        for(j=0; j<ciudades.length;j++){
                            salas.push(ciudades[j].nombre+problemas[i]._id);
                        }
                    }
                }
                salasStr = JSON.stringify(salas);
                location.href = "/"+email;
                console.log("unirme. objecto: ");
                console.log(data.data.obj);
                localStorage.setItem("ciudad",data.data.ciudad);
                localStorage.setItem("user",data.data.email);
                localStorage.setItem("salas",salasStr);
            }
		},
		error: function(err){
			console.log(err);
			return false;
		}
	});

	return false;
});