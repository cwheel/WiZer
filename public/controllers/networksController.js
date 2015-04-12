wizer.controller('networksController',['$scope', '$location', '$timeout', '$rootScope', '$http', function($scope, $location, $timeout, $rootScope, $http) {
	$scope.allNetworks = [];

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
}]);