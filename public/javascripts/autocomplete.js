var autoComplete = new google.maps.places.Autocomplete(   
    document.getElementById('ciudad'), {
    types: ['(cities)']
});

google.maps.event.addListener(autoComplete, 'place_changed', function() {
  var place = autocomplete.getPlace();
  if (place.geometry) {
     console.log(map);
     map.panTo(place.geometry.location);
     map.setZoom(15);
  } 
});