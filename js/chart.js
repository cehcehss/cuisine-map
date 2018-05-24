var shopCount = {};
db.collection("shop-count").onSnapshot(function (snapshot) {
    var colorArr = ["#c6e2ff", "#eeeeee", "#b0e0e6", "#e6e6fa", "#ffe4e1", "#f5f5dc"];
    var randColor;
    snapshot.forEach(function (doc) {
        var shop = doc.data();
        var type = shop.type;
        var count = shop.count;
        randColor = colorArr[Math.floor(Math.random() * colorArr.length)];
        shopCount[type] = {
            name: type,
            y: Number(count),
            color: randColor
        };
        for (var i = colorArr.length - 1; i >= 0; i--) {
            if (colorArr[i] === randColor) {
                colorArr.splice(i, 1);
            }
        }
    });
    var shopCountLen = Object.keys(shopCount).length;
    var cateName = [];
    var seriesData = [];
    Object.keys(shopCount).forEach(function (key) {
        console.log(key, shopCount[key]);
        cateName.push(key);
        seriesData.push(shopCount[key]);
    });
    console.log(seriesData);


    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            backgroundColor: '#1e303d'
        },
        title: {
            text: '各類型餐廳數',
            style: {
                color: '#FFFFFF'
            }
        },
        xAxis: {
            categories: cateName,
            crosshair: true,
            labels: {
                style: {
                    color: '#FFFFFF'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Count',
                style: {
                    color: '#FFFFFF'
                }
            },
        },
        legend: {
            itemStyle: {
                color: '#FFFFFF'
            }
        },
        tooltip: {
            style: {
                color: '#FFFFFF',
            },
            backgroundColor: '#0e2f44',
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: '類型',
            data: seriesData
        }]
    });

});