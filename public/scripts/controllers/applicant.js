'use strict';

var MODULE = 'sheltr.controllers.applicant';

module.exports = MODULE;

angular.module(MODULE, [])
  .controller('ApplicantController', [
    '$scope',
    '$http',
    '$stateParams',
    function($scope, $http, $stateParams) {
      var id = $scope.id = $stateParams.id;
      var geocoder = L.mapbox.geocoder('mapbox.places');

      // When the user's location changes, remove any existing user
      // markers and create a new one at the user's coordinates
      $scope.$watch('userLocation', function(newVal, oldVal) {
        if (!newVal) return;

        if ($scope.userMarker)
          $scope.map.removeLayer($scope.userMarker);

        var point = L.latLng(newVal.latitude, newVal.longitude);
        $scope.userMarker = L.marker(point);

        $scope.map.addLayer($scope.userMarker)
          .setView(point, 12, {animate: true});
      });

      $scope.getMatches = function(text) {
        if (text !== '') {
          geocoder.query(text, function(err, data) {
            if (err) return console.error(err);
            console.log(data);
            $scope.mapSearchResults = data.results.features;
          });
        }
      };

      $scope.selectedItemChange = function(item) {
        var bbox = item.bbox;
        var center = L.latLng(item.center[1], item.center[0]);

        $scope.map.setView(center, 13);
      };


      $scope.update = function() {
        $http.patch(`/api/applicants/${id}`, $scope.applicant)
          .then(function(response) {
            console.log(response);
          },
          function(response) {
            console.log(response);
          });
      };

      // This function uses the browser geolocation APIs to fetch the user's
      // location. The coordinates are passed to the backend's `/nearest`
      // endpoint as URL query parameters. The `/nearest` endpoint returns
      // the closest earthquake and its distance, which are assigned to
      // variables within the current scope
      $scope.updateUserLocation = function() {
        navigator.geolocation.getCurrentPosition(function(position) {
          $scope.userLocation = position.coords;
          $scope.$apply();
        });
      };


      $scope.map = L.mapbox.map('map', 'mapbox.streets',{
        scrollWheelZoom: false,
      }).setView([0, 0], 2);

      $scope.featureGroup = L.featureGroup().addTo($scope.map);
      $scope.drawControl = new L.Control.Draw({
        edit: {
          featureGroup: $scope.featureGroup,
        },
        draw: {
          polyline: false,
          polygon: false,
          rectangle: false,
          marker: false,
        },
      }).addTo($scope.map);

      $scope.map.on('draw:created', function(e) {
        var layer = e.layer;
        $scope.featureGroup.addLayer(layer);
        if (!$scope.applicant.filters.hasOwnProperty('locations')) {
          $scope.applicant.filters.locations = [];
        }

        var json = layer.toGeoJSON();
        json.properties.radius = layer.getRadius();
        $scope.applicant.filters.locations.push(json);
      });

      $scope.updateUserLocation();

      if (id !== '') {
        $http.get(`/api/applicants/${id}`)
          .then(response => {
            $scope.applicant = response.data;
            $scope.applicant.dob = new Date($scope.applicant.dob);

            if ($scope.applicant.filters.hasOwnProperty('locations')) {
              $scope.applicant.filters.locations.forEach(function(location) {
                var coords = location.geometry.coordinates;
                var point = L.latLng(coords[1], coords[0]);
                console.log(point, location.properties.radius);
                var layer = L.circle(point, location.properties.radius);
                $scope.featureGroup.addLayer(layer);
              });
            }
          });
      }
    },
  ]);
