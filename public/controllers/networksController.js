wizer.controller('networksController',['$scope', '$location', '$timeout', '$modal', '$http', function($scope, $location, $timeout, $modal, $http) {
	$scope.allNetworks = [];
	$scope.wizardItems = {};


	$scope.pullNetworks = function () {
		$http({
		    method : 'GET',
		    url : '/node/recentReports'
		})
		.success(function(resp) {
			if (angular.fromJson(resp).length != 0) {
				$scope.allNetworks = angular.fromJson(resp);

				for (var i = 0; i < $scope.allNetworks.length; i++) {
					$scope.allNetworks[i].signal = String(Math.abs(parseInt($scope.allNetworks[i].signal)) * -1) + " dBm";

					if ($scope.allNetworks[i].cypher == "CCMP") {
						$scope.allNetworks[i].cypher = "AES";
					}
				}
			}
		});

		$timeout(function() {$scope.pullNetworks()}, 2000);
	};

	$scope.cleanGain = function (gain) {
		var i = parseInteger(gain);
		i = Math.abs(i) * (-1);
		return parseString(i) + "dBm"
	};

	$scope.pullNetworks();

	// Models
  $scope.pageone = function (size) {
  	var modalInstance = $modal.open({
  		templateUrl: 'networkWizardPageOne.html',
  		controller: 'networkWizardPageOne',
  		size: 'lg',
  		resolve: {
  		    red: function () {
  		      return $scope.wizardItems;
  		    }
  		  }
  		});

  		modalInstance.result.then(function (newNode) {
  		}, function () {
  		  $log.info('Modal dismissed at: ' + new Date());
  		});
  	};
}]);
wizer.controller('networkWizardPageOne', function ($scope, $modalInstance, $modal, red) {

  $scope.items = red;

  $scope.next = function () {
  	var modalInstance = $modal.open({
  		templateUrl: 'networkWizardPageTwo.html',
  		controller: 'networkWizardPageTwo',
  		size: 'lg',
  		resolve: {
  		    red: function () {
  		      return $scope.wizardItems;
  		    }
  		  }
  		});

    	$modalInstance.close($scope.wizardItems);
  		modalInstance.result.then(function (newNode) {
  		}, function () {
  		  $log.info('Modal dismissed at: ' + new Date());
  		});
	};

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
wizer.controller('networkWizardPageTwo', function ($scope, $modalInstance, $modal, red) {

  $scope.items = red;

  $scope.next = function () {
  	var modalInstance = $modal.open({
  		templateUrl: 'networkWizardPageTwo.html',
  		controller: 'networkWizardPageTwo',
  		size: size,
  		resolve: {
  		    red: function () {
  		      return $scope.wizardItems;
  		    }
  		  }
  		});
    	$modalInstance.close($scope.wizardItems);

  		modalInstance.result.then(function (newNode) {
  		}, function () {
  		  $log.info('Modal dismissed at: ' + new Date());
  		});
	};

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});