function procesar(e){
    var archivos=e.target.files;
    for(var iter=0, f; f = archivos[iter]; iter++){
        var archivo = archivos[iter];
        var lector = new FileReader();
        lector.onload= function(e){
            var resultado=e.target.result;
            /*enlace = $("<a class='btn btn-small data-pos='"+iter+"' icon-drop' href='#'>x</a>").on("click",function(){
                alert("hola");
            });*/
            element = $("<div class='col s12 m4'><img class='img-preview' src='"+resultado+"' /></div>");
            $("#lista").append(element);
        };
        lector.readAsDataURL(archivo);
    }
}

/*function mostrar(e){
    var resultado=e.target.result;
    enlace = $("<a class='btn btn-small icon-drop' href='#'>x</a>").on("click",function(){
        alert("hola");
    });
    element = $("<div class='item col s12 m4'><img class='img-preview' src='"+resultado+"' />j</div>").append(enlace);
    $("#lista").append(element);
}*/

archivos=document.getElementById('archivos');
archivos.addEventListener('change', procesar, false);

$('.scrollSpy').scrollSpy();