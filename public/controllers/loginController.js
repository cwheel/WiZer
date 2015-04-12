wizer.controller('loginController',['$scope', '$location', '$timeout', '$rootScope', '$http', function($scope, $location, $timeout, $rootScope, $http) {
	$scope.loginStatus = "Login";
	$scope.login = {};

	$http({
	    method : 'GET',
	    url : '/authed'
	})
	.success(function(resp) {
		if (angular.fromJson(resp).loginStatus == 'valid') {
			$location.path('/dashboard');
		}
	});
	
	$scope.login = function() {
		$http({
		 	method  : 'POST',
			url     : '/login',
			data    : $.param($scope.login),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
		})
		.success(function(resp) {
			if (angular.fromJson(resp).loginStatus == 'success') {
				$location.path('/dashboard');
				$("#loginBack").animate({opacity: 0}, 400);
				$scope.$emit('loginCompleted', null);
			} else {
				$scope.loginStatus = "Login Failed!";

				$timeout(function() {
					$scope.loginStatus = "Login";
				}, 4000);
			}
		});
	};

	$scope.enterLogin = function(keyEvent) {
		if (keyEvent.which === 13) {
			$scope.login();

			keyEvent.stopPropagation();
			keyEvent.preventDefault();  
			return false;
		}
	}
}]);