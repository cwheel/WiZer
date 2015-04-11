var wizer = angular.module('wizer', ['ngRoute', 'ngBootstrapMaterial', 'ui.bootstrap', 'ngCookies', 'ngTouch', 'chart.js']);

wizer.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl : 'routes/login.html',
			controller  : 'loginController'
		});
		
		$locationProvider.html5Mode(true);
}]);