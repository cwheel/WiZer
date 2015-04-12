wizer.controller('manageController',['$scope', '$location', '$timeout', '$rootScope', '$http', '$modal', '$log', function($scope, $location, $timeout, $rootScope, $http, $modal, $log) {
  $scope.nodes = [];
  $scope.users = [];
  $scope.items = ['item1', 'item2', 'item3'];

  $scope.key = "";
   $http({
		 	method  : 'GET',
			url     : '/user/all',
  })
  .success(function(resp){ 
  	$scope.users = angular.fromJson(resp);
  });
  $http({
		 	method  : 'GET',
			url     : '/node/all',
  })
  .success(function(resp){ 
  	$scope.nodes = angular.fromJson(resp);
  });
  $scope.new = function (size) {
  	$http({
		 	method  : 'GET',
			url     : '/manage/genKey',
	 })
  	.success(function(resp) {
  		$scope.key = angular.fromJson(resp).key;
  		var modalInstance = $modal.open({
  		  templateUrl: 'myModal2Content.html',
  		  controller: 'Modal2InstanceCtrl',
  		  size: size,
  		  resolve: {
  		    red: function () {
  		      return $scope.key;
  		    }
  		  }
  		});

  		modalInstance.result.then(function (newNode) {
  			$scope.nodes.push(newNode);
  		}, function () {
  		  $log.info('Modal dismissed at: ' + new Date());
  		});
  	})
  };
}]);

wizer.controller('Modal2InstanceCtrl', function ($scope, $modalInstance, red, $http) {

  $scope.key = red;

  $scope.ok = function () {
  	if($scope.name != ''){
  		$scope.newNode = {'name': $scope.name,'key': $scope.key};
	  	$http({
			 	method  : 'POST',
				url     : '/node/register',
				data    : $.param($scope.newNode),
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
		})
  	}
    $modalInstance.close($scope.newNode);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});