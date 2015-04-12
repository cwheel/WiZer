var wizer = angular.module('wizer', ['ngRoute', 'ngBootstrapMaterial', 'ui.bootstrap', 'ngCookies', 'ngTouch', 'chart.js']);

wizer.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl : 'routes/login.html',
			controller  : 'loginController'
		})
		.when('/dashboard', {
			templateUrl : 'routes/dashboard.html',
			controller  : 'dashboardController'
		})
		.when('/networks', {
			templateUrl : 'routes/networks.html',
			controller  : 'networksController'
		})
		.when('/manage', {
			templateUrl : 'routes/manage.html',
			controller  : 'manageController'
		})
		$locationProvider.html5Mode(true);
}]);