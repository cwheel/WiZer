wizer.controller('dashboardController',['$scope', '$location', '$timeout', '$rootScope', '$http', '$modal', function($scope, $location, $timeout, $rootScope, $http, $modal) {
	$scope.$emit('loginCompleted', null);

	$scope.gainLow = "";
	$scope.gainHigh = "";
	$scope.nodes = "";
	$scope.nets = "";
	$scope.alerts = [];

  	$http({
		 	method  : 'GET',
			url     : '/alert/all',
	 })
  	.success(function(resp) {
  		$scope.alerts = angular.fromJson(resp);
  	})

	$scope.add = function(size) {
		var modalInstance = $modal.open({
  		  templateUrl: 'myModalContent.html',
  		  controller: 'alertController',
  		  size: size,
  		  resolve: {
  		    red: function () {
  		      return $scope.key;
  		    }
  		  }
  		});

  		modalInstance.result.then(function (newNode) {
  			
  		}, function () {
  		});
	}

	$scope.refresh = function () {
		$http({
		    method : 'GET',
		    url : '/node/recentReports'
		})
		.success(function(resp) {
			if (angular.fromJson(resp).length != 0) {
				$scope.allNetworks = angular.fromJson(resp);

				$scope.gainLow = $scope.allNetworks[0].signal;
				$scope.gainHigh = $scope.allNetworks[0].signal;
				$scope.nets = $scope.allNetworks.length;

				$http({
				    method : 'GET',
				    url : '/node/count'
				})
				.success(function(count) {
					$scope.nodes = angular.fromJson(count).count;
				});

				for (var i = 0; i < $scope.allNetworks.length; i++) {
					$scope.allNetworks[i].signal = String(Math.abs(parseInt($scope.allNetworks[i].signal)) * -1) + " dBm";

					if (parseInt($scope.gainLow) <  parseInt($scope.allNetworks[i].signal)) {
						$scope.gainLow = $scope.allNetworks[i].signal;
					}
					if (parseInt($scope.gainHigh) > parseInt($scope.allNetworks[i].signal)) {
						$scope.gainHigh = $scope.allNetworks[i].signal;
					}
				}
			}
		});

		$timeout(function() {$scope.refresh()}, 2000);
	};

	$scope.refresh();
}]);

wizer.controller('alertController', function ($scope, $modalInstance, $modal, $http) {
	$scope.add = {SSID : "", trigger : "0", gain : ""};

  	$scope.ok = function () {
  		$http({
  		 	method  : 'POST',
  			url     : '/alert/register',
  			data    : $.param($scope.add),
  			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
  		})
  		.success(function(resp) {
  			$modalInstance.dismiss('cancel');
  		});
	};

  	$scope.cancel = function () {
    	$modalInstance.dismiss('cancel');
  	};
});