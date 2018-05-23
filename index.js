function initMap() {

    var myLatLng = {
        lat: 25.031092,
        lng: 121.514587,
    };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: myLatLng
    });
    //onsnapshot
    db.collection("foodmap").onSnapshot(function (snapshot) {
        snapshot.docChanges.forEach(function (change) {
            if (change.type === "added") {
                var shop = change.doc.data();
                var contentString = `<h5>${shop.name}</h5>
                                    <p>${shop.content}</p>`;
                console.log(contentString);

                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });
                var geocoder = new google.maps.Geocoder();
                var addr = `${shop.address}`;
                console.log(addr);

                var marker;

                geocoder.geocode({
                    'address': addr
                }, function (results, status) {

                    if (status == google.maps.GeocoderStatus.OK) {

                        var latlng = results[0].geometry.location;
                        map.setCenter(latlng);
                        // alert(latlng);
                        marker = new google.maps.Marker({
                            position: latlng,
                            map: map,
                            title: `${shop.name}`
                        });
                        marker.addListener('click', function () {
                            // infowindow.close();
                            infowindow.open(map, marker);
                        });
                    }
                });


            }
        });
    });

}


//click add btn 
$("#add-btn").on("click", function () {
    saveData();
});
var collectionRef = db.collection("foodmap");

function saveData() {
    var $name = $("#name").val();
    var $address = $("#address").val();
    var $content = "Good!";

    var shop = {
        name: $name,
        address: $address,
        content: $content
    };

    collectionRef.add(shop)
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            $(".form-control").val("");
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}