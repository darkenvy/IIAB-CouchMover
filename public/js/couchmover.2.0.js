var app = angular.module('CouchMover', []);

app.controller('MainCtrl', ['$scope', '$http', function($scope, $http) { 
  $scope.activePacks = [];
  $scope.editTitle = '';
  $scope.editDesc = '';
  var menuItem = '';
  var editIdx = null;

  var getPackList = function() {
    $http.get('/curateAll')
      .then(function(response) {
        console.log(response);
        if (response.status !== 200) $scope.activePacks = ['Error processing packs'];
        $scope.activePacks = response.data;
      });
  }
  
  $scope.cancel = function() {
    $scope.editTitle = '';
    $scope.editDesc = '';
    menuItem = '';
    editIdx = null;
  }
  
  $scope.save = function(event) {
    console.log(event)
    $scope.activePacks[editIdx].title = $scope.editTitle;
    $scope.activePacks[editIdx].description = $scope.editDesc;
    $http({
      method: 'POST',
      url: '/update',
      headers: {
        'Content-Type': "application/json"
      },
      // data: 
      data: {
        title: $scope.editTitle,
        desc: $scope.editDesc,
        menuItem: menuItem
      }
    }).then(function success(req, res) {
      console.log('sent!')
    }, function error(res) {
      console.log('error :(', res)
    });
    $scope.editTitle = '';
    $scope.editDesc = '';
    menuItem = '';
    editIdx = null;
  }
  
  $scope.edit = function(event) {
    console.log(event)
    $scope.editTitle = event.pack.title;
    $scope.editDesc = event.pack.description;
    menuItem = event.pack.moddir;
    editIdx = event.$index;
    window.scrollTo(0, 0);
  }

  getPackList();
  
}]);