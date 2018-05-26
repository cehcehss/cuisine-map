var collectionRef = db.collection("foodmap");

//初始化地圖
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
                    "color": "#677374"
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
            icon: 'https://elsiehsieh.github.io/cuisine-map/style/images/coffee.png'
        },
        spaghetti: {
            icon: 'https://elsiehsieh.github.io/cuisine-map/style/images/spaghetti.png'
        },
        japanese: {
            icon: 'https://elsiehsieh.github.io/cuisine-map/style/images/sushi.png'
        },
        other: {
            icon: 'https://elsiehsieh.github.io/cuisine-map/style/images/pin.png'
        }
    };
    //從資料庫中拿出資料地址轉座標畫marker
    collectionRef.onSnapshot(function (snapshot) {
        snapshot.docChanges.forEach(function (change) {
            if (change.type === "added") {
                var shop = change.doc.data();
                // if (shop.imgURL == null) {
                //     shop.imgURL = "https://firebasestorage.googleapis.com/v0/b/html-296-elsie.appspot.com/o/fork.png?alt=media&token=4bc8f964-cf0b-4989-8e45-65d1abdad2f1";
                // }
                var contentString = `<h5>${shop.name}</h5>
                                    <p>${shop.content}</p>
                                    <img src="${shop.imgURL}" width="300px">`;

                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });
                var geocoder = new google.maps.Geocoder();
                var addr = `${shop.address}`;
                var marker;
                //地址轉座標
                geocoder.geocode({
                    'address': addr
                }, function (results, status) {

                    if (status == google.maps.GeocoderStatus.OK) {

                        var latlng = results[0].geometry.location;
                        //將地圖中心定位到最新一筆資料
                        map.setCenter(latlng);
                        marker = new google.maps.Marker({
                            position: latlng,
                            map: map,
                            icon: icons[`${shop.type}`].icon,
                            title: `${shop.name}`
                        });
                        infowindow.open(map, this.marker);
                        marker.addListener('click', function () {
                            infowindow.open(map, marker);
                        });
                    }
                });


            }
        });
    });

}


var storageRef = storage.ref();
var file;

//取得file資訊
$("#file").change(function (e) {
    file = e.target.files[0];
    $('.custom-file-label').html(file.name);
});

$("#add-btn").on("click", function () {
    getValueAndSaveData();

});
var shop;

function getValueAndSaveData() {
    var $name = $("#name").val();
    var $address = $("#address").val();
    var $content = $("#content").val();
    var $type = $("select[id=type]").val();
    var imgURL;

    //判斷有沒有上傳圖片
    if ($("#file").val() == '') {
        imgURL = "https://firebasestorage.googleapis.com/v0/b/html-296-elsie.appspot.com/o/food%20(1).png?alt=media&token=c6b1302b-86ee-4cd2-8ab1-08f1d8c39244";
        addToDB();
    } else {
        var imageRef = storageRef.child(file.name);
        imageRef.put(file).then(function (snapshot) {
            console.log(snapshot.downloadURL);
            imgURL = snapshot.downloadURL;
            addToDB();
        });
    }

    function addToDB() {
        shop = {
            name: $name,
            address: $address,
            content: $content,
            type: $type,
            imgURL: imgURL
        };
        console.log(shop);

        collectionRef.add(shop)
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
                $(".form-control").val("");
                $('.custom-file-label').html("");
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    }


    //取得shop-count集合中type文件資料
    //新增資料後，餐廳類型統計加一
    db.collection("shop-count").doc($type)
        .get().then(function (doc) {
            if (doc.exists) {
                var currentCount = doc.data().count;
                currentCount = Number(currentCount);
                currentCount += 1;
                //update
                db.collection("shop-count").doc($type).update({
                        count: currentCount
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