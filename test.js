var map;
var infowindow;

function initMap() {
    var myLatLng = {
        lat: 25.031092,
        lng: 121.514587,
    };

    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 13
    });

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    place.myLatLng({
        location: myLatLng

    }, callback);
}

function callback(results, status) {

    createMarker(results);
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}