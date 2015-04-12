wizer.controller('manageController',['$scope', '$location', '$timeout', '$rootScope', '$http', '$modal', '$log', function($scope, $location, $timeout, $rootScope, $http, $modal, $log) {
  $scope.nodes = ['']
  $scope.items = ['item1', 'item2', 'item3'];

  $scope.key = "";
  $scope.new = function (size) {
  	$http({
		 	method  : 'GET',
			url     : '/manage/genKey',
	 })
  	.success(function(resp) {
  		$scope.key = angular.fromJson(resp).key;
  		var modalInstance = $modal.open({
  		  templateUrl: 'myModalContent.html',
  		  controller: 'ModalInstanceCtrl',
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

wizer.controller('ModalInstanceCtrl', function ($scope, $modalInstance, red, $http) {

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