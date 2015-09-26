'use strict';

var MODULE = 'sheltr.controllers.signup';

module.exports = MODULE;

angular.module(MODULE, [])
  .controller('SignupController', [
    '$scope',
    '$http',
    '$stateParams',
    function($scope, $http, $stateParams) {
      var type = $stateParams.type;
      var map = L.mapbox.map('map', 'mapbox.streets')
      .setView([40, -74.50], 9);
      var geocoder = L.mapbox.geocoder('mapbox.places');
      var featureGroup = L.featureGroup().addTo(map);
      var master = {
        type: type,
      };

      $scope.reset = function() {
        $scope.applicant = angular.copy(master);
      };

      $scope.genderPrefs = [
        {name: 'male', value: 'male'},
        {name: 'female', value: 'female'},
      ];

      $scope.smokingPrefs = [
        {name: 'inside', value: 'inside'},
        {name: 'outside', value: 'outside'},
      ];

      $scope.petPrefs = [
        {name: 'inside', value: 'inside'},
        {name: 'outside', value: 'outside'},
        {name: 'none', value: 'none'},
      ];

      $scope.drinkingPrefs = [
        {name: 'occasional', value: 'ocassional'},
        {name: 'everyday', value: 'everyday'},
        {name: 'none', value: 'none'},
      ];

      $scope.create = function() {
        $scope.applicant.filters.locations = [];
        console.log(featureGroup);
        featureGroup.getLayers().forEach(function(layer) {
          var l = layer.toGeoJSON();
          l.properties.radius = layer.getRadius();
          $scope.applicant.filters.locations.push(l);
        });
        console.log($scope.applicant);
        $http.post('/api/applicants', $scope.applicant)
          .then(function(response) {
            console.log(response);
          },
          function(response) {
            console.log(response);
          });
      };

      $scope.reset();

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

      var inputs = document.querySelectorAll('.field__input');

      Array.prototype.forEach.call(inputs, function(input) {
        if (input.dataset.boundToCheckbox) {
          var bindings = input.dataset.boundToCheckbox.split(' ');
          bindings.forEach(function(row) {
            var boundInput = document.querySelector('#' + row);
            input.addEventListener('change', function() {
              if (input.value !== '' && input.value !== '0') {
                boundInput.checked = true;
              } else {
                boundInput.checked = false;
              }
            });
          });
        }

        input.addEventListener('focus', function() {
          input.parentElement.classList.add('focus');
        });
        input.addEventListener('blur', function() {
          input.parentElement.classList.remove('focus');
        });
      });
    },
  ]);
