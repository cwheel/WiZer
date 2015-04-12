wizer.controller('networksController',['$scope', '$location', '$timeout', '$modal', '$http','$log', function($scope, $location, $timeout, $modal, $http, $log) {
	$scope.allNetworks = [];
	$scope.wizardItems = {};
  $scope.badNetworks = [];


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
					} else if ($scope.allNetworks[i].cypher == ""){
            $scope.allNetworks[i].cypher = "None";
          }
          if ($scope.allNetworks[i].channel > 12){
            $scope.allNetworks[i].std2 = true;
          } else {
            $scope.allNetworks[i].std2 = false;
          }
          if($scope.badNetworks[$scope.allNetworks[i].channel] == undefined){
            $scope.badNetworks[$scope.allNetworks[i].channel] = $scope.allNetworks[i].signal;
          } else if ($scope.allNetworks[i].channel < $scope.allNetworks[i].signal){
            $scope.badNetworks[$scope.allNetworks[i].channel] = $scope.allNetworks[i].signal;
          }

          $scope.best2g = $scope.badNetworks[1];
          if ($scope.best2g > $scope.badNetworks[6]){
            $scope.best2g = $scope.badNetworks[6];
          }
          if ($scope.best2g > $scope.badNetworks[11]){
            $scope.best2g = $scope.badNetworks[11];
          }

				}
        console.log($scope.badNetworks);
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
  		      return $scope.best2g;
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

  $scope.best2g = red;

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

    	$modalInstance.close($scope.best2g);
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