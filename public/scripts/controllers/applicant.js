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
      var map = L.mapbox.map('map', 'mapbox.streets')
      .setView([40, -74.50], 9);
      var featureGroup = L.featureGroup().addTo(map);

      var drawControl = new L.Control.Draw({
        edit: {
          featureGroup: featureGroup,
        },
        draw: {
          polyline: false,
          polygon: false,
          rectangle: false,
          marker: false,
        },
      }).addTo(map);

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

        map.setView(center, 13);
      };

      map.on('draw:created', function(e) {
        featureGroup.addLayer(e.layer);
        console.log(featureGroup.getLayers());
      });

      if (id !== '') {
        $http.get(`/api/applicants/${id}`)
          .then((response) => {
            $scope.applicant = response.data;
            console.log($scope.applicant);
          });
      }


    },
  ]);
