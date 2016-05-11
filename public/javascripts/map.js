window.addEventListener("load",function(){
    
    var miMapa = document.getElementById("map-report");
    lat = miMapa.getAttribute("data-lat");
    lng = miMapa.getAttribute("data-lng");
    var latlng = new google.maps.LatLng(lat, lng);
    console.log(latlng);
    var options = {
        center: latlng,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    var map = new google.maps.Map(miMapa, options);
    markers = [];
    
    google.maps.event.addListener(map, 'click', function(event) {
        var marker = new google.maps.Marker({
            position: event.latLng,
            animation: google.maps.Animation.DROP
        });
        if(markers.length > 0){
            limpiarMapa();
        }
        markers.push(marker);
        mostrarMarcador(map);
        $("#input-lat").attr("value",event.latLng.lat());
        $("#input-lng").attr("value",event.latLng.lng());
    });
    
    function limpiarMapa(){
        for(var i = 0; i < markers.length; i++){
            markers[i].setMap(null);
        }
        markers.splice(0,markers.length);
    }
    
    function mostrarMarcador(map){
        for(var i = 0; i < markers.length; i++){
            markers[i].setMap(map);
        }
    }

    
    var input = document.querySelector("#city");
    var optionSite = {
        types: ['geocode']
    };
    autocomplete = new google.maps.places.Autocomplete(input, options);

},false);































// AIzaSyDa18XCLIQTfZ2SvblrWPbgf9jgZvuFaOk