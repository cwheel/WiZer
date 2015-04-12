wizer.controller('mainController', ['$rootScope', '$scope', '$timeout', '$location', '$cookieStore', function($rootScope, $scope, $timeout, $location,$cookieStore){
    var mobileView = 992;
	$scope.showTopbar = false;
	$scope.userMenu = false;

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };
    $rootScope.$on('loginCompleted', function(event, args) {
        $timeout(function() {
            $scope.$apply('showTopbar = true');
        }, 100);
    });
}]);
wizer.directive('fullViewport', function($timeout) {
    return {
        link: function(scope, element, attr) {
            $timeout(function() {
                if (attr.fullViewport == "true"){
                    $("page-wrapper").css("padding-left","0px");
                }else {
                    $(".row.header").css("padding-left","");
                }
            }, 10);
        }
    };
});