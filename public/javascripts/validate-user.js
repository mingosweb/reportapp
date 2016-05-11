input_email = $("form#form-login input#email");
input_pass = $("form#form-login input#password");
$("#btn-login").on('click',function(i,e){
	email = input_email.val();
    pass = input_pass.val();
	$.ajax({
		type: 'post',
		dataType: 'json',
		url: 'http://localhost:3000/autenticate/'+email+'/'+pass,
		success: function(data){
            if(data.exist === false){
                $("#label-email").html(data.message);
                return true;
                input_email.val("");
                input_pass.val("");
            }else{
                socket.emit("join",data.data.ciudad);
                location.href = "http://localhost:3000/"+email;
            }
		},
		error: function(err){
			console.log(err);
			return false;
		}
	});

	return false;
});