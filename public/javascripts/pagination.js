if($("ul.pagination")){
    paginador = $("ul.pagination");
    contenedorItems = $("div.row-cards");
    totalElements = 12;
    var skip = parseInt(paginador.attr("data-skip"));
    $("ul.pagination > li").each(function(i,e){
        $(this).on("click",function(i,e){
            var index = parseInt($(this).attr("data-index"));
            $.ajax({
                url: "/reporte/list/"+localStorage.getItem("ciudad")+"/"+(totalElements*index)+"/"+totalElements,
                dataType: 'json',
                type: 'post',
                success: function(data){
                    reportes = data.message;
                    loadTemplate(reportes);
                },
                error: function(err,msj){
                    alert("ocurrio un error "+msj);
                }
            });
            return false;
        });
    });
    
    function loadTemplate(rep){
        
        contenedorItems.empty();
        
        for(var i=0; i < rep.length; i++){
            //composicion de una targeta reporte
            columnaGrid = $("<div class='col s12 m4 l4'></div>");
            targetaReporte = $("<div class='card card-report'></div>");
            targetaFigure = $("<figure class='card-image card-report-container-img'></figure>");
            targetaImg = $("<img src='/photos/"+rep[i].url_fotos[0]+"' class='card-report-img'/>");
            urlDetails = "/"+localStorage.getItem("user")+"/reportes/"+rep[i]._id+"/details";
            targetaTitulo = $("<div class='card-content'></div>").append("<p></p>").append("<a href='"+urlDetails+"'>"+rep[i].titulo+"</a>");

            //uniendo los reportes
            targetaFigure.append(targetaImg);
            targetaReporte.append(targetaFigure);
            targetaReporte.append(targetaTitulo);
            columnaGrid.append(targetaReporte);

            contenedorItems.append(columnaGrid);
        }
        
    }
}