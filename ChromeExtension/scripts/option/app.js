angular.module('radio-play', ['dndLists'])
  .controller('OptionsController', function($http, $scope) {
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

    $http.get('radio_flux.json')
      .then(function (data) {
        $scope.groupList = data.data;
        $scope.savedGroupList = data.data;
      });
  });