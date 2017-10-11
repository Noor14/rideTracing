var app = angular.module('share-ride',[]);

app.controller('rideCtrl',function($scope, rideService, $location) {

    $scope.mapOptions = {
        zoom: 20,
        zoomControl: true
    };
    $scope.loader = true;
    function drawPolyLine() {
        var decode = google.maps.geometry.encoding.decodePath($scope.encodedStr);
        var bounds = new google.maps.LatLng();
        for (var i = 0; i < decode.length; i++) {
            if (i == decode.length - 1) {
               $scope.latLngArray = decode[i].toUrlValue(6).split(',');
                $scope.map.setCenter({lat: Number($scope.latLngArray[0]), lng: Number($scope.latLngArray[1])});
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(Number($scope.latLngArray[0]), Number($scope.latLngArray[1])),
                    map: $scope.map
                });


            }
        }

        var line = new google.maps.Polyline({
            path: decode,
            strokeColor: '#F00',
            strokeOpacity: 1.0,
            strokeWeight: 8,
            zIndex: 3
        });

        line.setMap($scope.map);

    }

    function initialize() {
        $scope.map = new google.maps.Map(document.getElementById('map-canvas'), $scope.mapOptions);

        if ($scope.encodedStr) {

            drawPolyLine();
        }


    }
        $scope.start = function(){
    $scope.createMap = setInterval(function () {
        var pathString = $location.absUrl().split('?q=')[1];
        rideService.trackRide(pathString).then(function (res) {
            if (res.status == 200) {
                $scope.loader = false;
                $scope.encodedStr = res.data.polyline;
                $scope.driver = res.data.driver;
                $scope.class='';
                $scope.stop = true;

                if (!$scope.driver.phone) {
                    $scope.driverData = "Driver information is not available";
                }
                drawPolyLine();
            }
        }, function (err) {
            console.log(err);
            $scope.loader = false;
            $scope.nolocation = "Location not found"
        });
    }, 5000);
        };
    $scope.mapPause = function(){
        if($scope.encodedStr && $scope.stop){
            clearInterval($scope.createMap);
            $scope.stop = false;
            $scope.class = 'colorBlue';
        }
        else if($scope.encodedStr && !$scope.stop){
            $scope.start();
        }
    };
    $scope.start();
    google.maps.event.addDomListener(window, 'load', initialize);
    google.maps.event.addDomListener(window, 'resize', initialize);

});