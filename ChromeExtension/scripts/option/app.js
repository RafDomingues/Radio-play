angular.module('radio-play', ['dndLists'])
  .controller('OptionsController', function($http, $scope) {
    var savedGroupList;
    $scope.open = {};
    $scope.toggleOpen = function (index) {
      if ($scope.open[index] !== undefined) {
        if ($scope.open[index] === true) {
          $scope.open[index] = false;
        } else {
          $scope.open[index] = true;
        }
      } else {
        $scope.open[index] = true;
      }
    };

    $scope.removeGroupName = function (index) {
      $scope.groupList.splice(index, 1);
    };

    $scope.removeRadioName = function (parentIndex, index) {
      $scope.groupList[parentIndex].list.splice(index, 1);
    };

    $scope.saveObject = function () {
      chrome.storage.sync.set({radioJson : $scope.groupList});
    };

    chrome.storage.sync.get("radioJson", function (items) {
      $http.get('radio_flux.json')
        .then(function (data) {
          if (items.hasOwnProperty('radioJson')) {
            $scope.groupList = items.radioJson;
            savedGroupList = items.radioJson;
          } else {
            $scope.groupList = data.data;
            savedGroupList = data.data;
          }
        });
    });
  });