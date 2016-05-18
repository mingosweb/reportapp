$("#container-photos li img").each(function(i,e){
    $(this).on("click",function(i,e){
        
        if($("#modal-photo").length > 0){
            $("#modal-photo").remove();
        }
                
        modal = $("<div id='modal-photo'></div>").addClass("modal-photos");
        
        modal.css({
            "height":window.innerHeight,
            "width":window.innerWidth
        });
                
        img = $("<img src='"+$(this).attr("src")+"'/>").addClass("modal-img-photo");
        
        modal.append(img);
        
        hijos = $("body > *").hide();
        
        $("body").append(modal);
        
        modal.on("click",function(){
            hijos.show();
            modal.hide();
        });
        
    });
});