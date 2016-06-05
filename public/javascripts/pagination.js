/*** 
    recibe como parametros un objeto con las siguientes opciones
    - template: cadena con el tipo de elemento a paginar del DOM
    - item: numero entero cuyo valor es el indice actual (por defecto es cero 0)
    - numPages: numero entero con el total de paginas de la paginación
    - numResults: numero entero con numero de resultados que se mostrarán por pagina
***/

Paginator = function(template){
    this.options = {
        index: 0, // indice que en el momento esta paginando
        template: '', // nombre del template html que muestra un resultado.
        numResultsSource: 0, // numero total de registros encontrados
        numResultsShow: 0, // numero de resultados por pagina
        numPages: 0, // numero de paginas por las cuales se divide el total encontrado
        numPagesShow: 0, // numero de paginas que se quieren mostrar en la navegacion
        url_ajax: '' // cadena con la url donde se hace la peticón
    };
    
    this.filters = ""; // cadena con objecto con diferentes parametros de busqueda
    
    this.itemTemplate = {}; // objeto Jquery con el html del template
    
    this.controls = {}; // objeto Jquery con el HTML de los controles de paginacion
    
    // AL INICIAR UNA INSTANCIA
    // verificamos que haya un template dentro de los parametros para cargarlo
    if( !template.empty || template !== null){
        this.options.template = template;
        this.cargarControles();
        console.log(this.options);
    }else{
        this.template = null;
    }
    
};

Paginator.prototype.cargarControles = function(){
    var controls = $(".pagination[data-template*="+this.options.template+"]");
    console.log("CARGANDO CONTROLES: ");
    console.log(controls);
    if(controls.length > 0){
        // hacemos un ciclo en caso de que por error hayan mas de un item
        var ok = false;
        var i = 0;
        while (!ok && i < controls.length){
            this.controls = controls;
            ok = true;
            i++;
        }
        $(".container-controls").hide();
        // mensaje para entorno de desarrollo
        console.log("cargado controles "+this.options.template);
        this.cargarTemplate();
    }else{
        console.log("hubo un error cargando el controles");
    }
};

Paginator.prototype.cargarTemplate = function( ){
    // obtenemos el template del DOM marcado con la clase .result-item
    var Template = $(".container-result[data-template*="+this.options.template+"] .result-item:first").clone();
    var container = $(".container-result[data-template*="+this.options.template+"]");
    container.empty();
    if(Template.length > 0){
        // hacemos un ciclo en caso de que por error hayan mas de un item
        var ok = false;
        var i = 0;
        while (!ok && i < Template.length){
            this.itemTemplate = Template;
            ok = true;
            i++;
        }
        // mensaje para entorno de desarrollo
        console.log("cargado template "+this.options.template);
    }else{
        console.log("hubo un error cargando el template");
    }
}

Paginator.prototype.actualizarIndice = function(indiceSelect){
    if( indiceSelect >= 1 && indiceSelect <= parent.options.numPages){
        parent.options.index = indiceSelect - 1;   
    }else if(indiceSelect === 1){
        parent.options.index = 0;   
    }else{
        parent.options.index = 0;   
    }
};

Paginator.prototype.agregarFiltro = function(campo, valor){
    obj = {};
    obj[campo] = valor;
    this.filters.push(obj);
};

Paginator.prototype.obtenerTodos = function(){
    var parent = this;
    $.ajax({
        url: parent.options.url_ajax,
        type: 'post',
        dataType: 'json',
        success: function(data){
            if(data.status === "OK"){
                // obtener todos inicializa el numero total de resultados y muestra el numero de paginas en el DOM
                parent.options.numResultsSource = data.message.length;
                parent.iniciarControles(data.message.length);   
            }else{
                console.log("error al parcear length");
            }
        },
        error: function(err,msj,msj2){
            return null;
        }
    });
};

Paginator.prototype.iniciarControles = function(result){
    var parent = this;
    // obtenemos el total de paginas
    if(result !== null){
        // asignamos el total de paginas a la clase
        this.options.numPages = Math.ceil(result / this.options.numResultsShow);
        // borramos las paginas actuales
        indexTemplate = this.controls.find(".pagination-number:first");
        indexPrev = this.controls.find(".pagination-prev");
        indexNext = this.controls.find(".pagination-next");
        this.controls.empty();
        this.controls.append(indexPrev);
        for(var i = 0; i < this.options.numPages; i++){
            // obtenemos el template de item
            var tmp = indexTemplate.clone();
            if(i === this.options.index){
                tmp.addClass("active");
            }
            tmp.attr("data-index",i);
            tmp.find("a").html(i+1);
            //asignamos eventos
            tmp.on("click",function(i,e){
                parent.controls.find(".pagination-number.active").removeClass("active");
                indiceSelect = parseInt($(this).find("a").html());
                $(this).addClass("active");
                parent.actualizarIndice(indiceSelect);
                parent.renderizarTemplate();
            });
            this.controls.append(tmp);
        }
        this.controls.append(indexNext);
    }
}

Paginator.prototype.renderizarTemplate = function(){
    $(".container-controls").show();
    $(".message-box").hide();
    parent = this;
    console.log("renderizando con indice: "+parent.options.index);
    $.ajax({
        url: this.options.url_ajax,
        data: {limit: this.options.numResultsShow, skip: this.options.index*this.options.numResultsShow},
        dataType: 'json',
        type: 'post',
        success: function(data){
            // obtenemos el contenedor donde se mostrarán los resultados
            var contenedorResult = $(".container-result[data-template="+parent.options.template+"]");
            // se vacian los elementos que hayan dentro de el *previamente se almacenó el template*
            contenedorResult.empty();
            // Si hay resultados
            if(data.message.length > 0){
                // se obtiene el template de un resultado
                tmp = parent.itemTemplate;
                // se obtiene el limite de resultados a mostrar
                var limitShow = (parent.options.numResultsShow >= parent.options.numResultsSource) ? parent.options.numResultsSource : parent.options.numResultsShow;
                console.log("iteracion hasta: "+limitShow);
                for(iter = 0; iter < limitShow; iter++){
                    var tem = tmp.clone();
                    /*
                        obtenemos todos los elementos que contengan el atributo data-params
                        el valor de data-params debe ser el mismo nombre del campo que es guardado en el modelo.
                        el valor de data-params puede ser compuesto hasta de tres valores separados por comas (,)
                        cada valor representa: <nombre_campo> , <funcion> , <parametro>
                        donde el campo funcion indica acciones como por ejemplo obtener indices en caso de ser array
                        o un objeto. por ejemplo:

                        > data-params='ciudades,index,0' 

                        devolveria como valor en la posicion 0 del array ciudades

                    */

                    tem.find("[data-params]").each(function(i,e){
                        var attr = $(this).attr("data-params");
                        attrCompuesto = attr.split(",");
                        if(attrCompuesto.length === 1){
                            console.log("el atributo: "+attrCompuesto[0]+" es simple");
                            $(this).html(data.message[iter][attr]);
                        }else{
                            /*  si el atributo es compuesto se verifican si los demas campos no estan vacios
                                de lo contrario solo se devolveria todo el valor del campo  */
                            console.log("el atributo: "+attrCompuesto+" es compuesto");
                           if(!attrCompuesto[1].empty){
                               switch(attrCompuesto[1]){
                                   case 'index':
                                       index = parseInt(attrCompuesto[2]) ? parseInt(attrCompuesto[2]) : 0;
                                       $(this).html(data.message[iter][attrCompuesto[0]][index]);
                                       break;
                                   case 'length':
                                       $(this).html(data.message[iter][attrCompuesto[0]].length);
                                       break;
                               }
                           }else{
                               console.log("campos compuestos vacios");
                               $(this).html(data.message[iter][attr]);   
                           }
                        }
                    });
                    // reemplazamos la palabra id en cualquier parte que haya por su valor
                    tem.find("a[href*='::']").each(function(i,e){
                        attrHref = $(this).attr("href");
                        array = attrHref.split("/");
                        $.each(array, function(i,e){
                            var viñeta = new RegExp("::");
                            if(viñeta.test(array[i])){
                                var data_param = array[i].split("::");
                                array[i] = data.message[iter][data_param[1]];
                            }else{
                                array[i] = array[i];
                            }
                            array[i] = array[i] === "id" ? data.message[iter]._id : array[i];
                        });
                        attrHref = array.join("/");
                        $(this).attr("href",attrHref);
                    });
                    //mostrar_fotos
                    tem.find("img[src*='url_fotos']").each(function(i,e){
                        attrSrc = $(this).attr("src");
                        array = attrSrc.split("/");
                        $.each(array, function(i,e){
                            array[i] = array[i] === "url_fotos" ? data.message[iter].url_fotos[0] : array[i];
                        });
                        attrSrc = array.join("/");
                        $(this).attr("src",attrSrc);
                    });

                    contenedorResult.append(tem);
                };
            }else{
                contenedorResult.append($("<div class='message-box'><h3 class='title-small'>No se han encontrado resultados</h3></div>"));
            }
        },
        error: function(err,msj, msj2){
            console.log("hubo un error: "+msj2);
        }
    });
}