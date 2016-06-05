/* verificamos si existen inputs de busqueda */
$(document).ready(function(){
    if($(".search-pagination").length > 0){
        paginator = new Paginator(template);
        paginator.options.numResultsShow = 12;
        /* si hay varios  con la clase search-pagination los seleccionaremos y obtendremos la url de peticion especifico */
        $(".search-pagination").each(function(i,e){
            // si no hay url, no se hace la peticion, sino se procede con Pagination.js
            var url = $(this).attr("data-url");
            if(url){
                /* Asignamos evento al input cuando cambie */ 
                $(this).on("change",function(i,e){
                   // formateamos la url de busqueda
                    var newUrl = url.replace(/::key::/gi, $(this).val()); 
                    paginator.options.url_ajax = newUrl;
                    paginator.obtenerTodos();
                    paginator.renderizarTemplate();
                });
            }else{
                console.log("no se peude realizar la peticion. data-url no especificado");
            }
        });
    }else{
        console.log("no se han encontrado elementos .search-pagination");
    } 
});