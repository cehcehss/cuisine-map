function initMap() {

    var myLatLng = {
        lat: 25.045355,
        lng: 121.523706
    };
    var map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 14,
        styles: [{
                "featureType": "water",
                "stylers": [{
                    "color": "#0e171d"
                }]
            },
            {
                "featureType": "landscape",
                "stylers": [{
                    "color": "#1e303d"
                }]
            },
            {
                "featureType": "road",
                "stylers": [{
                    "color": "#1e303d"
                }]
            },
            {
                "featureType": "poi.park",
                "stylers": [{
                    "color": "#1e303d"
                }]
            },
            {
                "featureType": "transit",
                "stylers": [{
                        "color": "#182731"
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": [{
                        "color": "#f0c514"
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.stroke",
                "stylers": [{
                        "color": "#1e303d"
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "labels.text.fill",
                "stylers": [{
                        "color": "#e77e24"
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#94a5a6"
                }]
            },
            {
                "featureType": "administrative",
                "elementType": "labels",
                "stylers": [{
                        "visibility": "simplified"
                    },
                    {
                        "color": "#e84c3c"
                    }
                ]
            },
            {
                "featureType": "poi",
                "stylers": [{
                        "color": "#e84c3c"
                    },
                    {
                        "visibility": "off"
                    }
                ]
            }
        ]
    });
    var icons = {
        coffee: {
            icon: './images/coffee.png'
        },
        spaghetti: {
            icon: './images/spaghetti.png'
        },
        japanese: {
            icon: './images/sushi.png'
        },
        other: {
            icon: './images/pin.png'
        }
    };
    //onsnapshot
    db.collection("foodmap").onSnapshot(function (snapshot) {
        snapshot.docChanges.forEach(function (change) {
            if (change.type === "added") {
                var shop = change.doc.data();
                var contentString = `<h5>${shop.name}</h5>
                                    <p>${shop.content}</p>`;

                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });
                var geocoder = new google.maps.Geocoder();
                var addr = `${shop.address}`;

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
                            icon: icons[`${shop.type}`].icon,
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
    var $content = $("#content").val();
    var $type = $("select[id=type]").val();

    var shop = {
        name: $name,
        address: $address,
        content: $content,
        type: $type
    };

    collectionRef.add(shop)
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            $(".form-control").val("");
            // alert("新增成功");
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });


    //取得shop-count集合中type文件資料
    db.collection("shop-count").doc($type)
        .get().then(function (doc) {
            if (doc.exists) {
                var currentCount = doc.data().count;
                currentCount += 1;
                //update
                db.collection("shop-count").doc($type).update({
                        count: Number(currentCount)
                    })
                    .then(function () {
                        console.log("Document successfully updated!");
                    });
                console.log("Document data:", doc.data());
            } else {
                //add
                db.collection("shop-count").doc($type).set({
                        type: $type,
                        count: 1
                    })
                    .then(function () {
                        console.log("Document successfully written!");
                    })
                    .catch(function (error) {
                        console.error("Error writing document: ", error);
                    });
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });

}