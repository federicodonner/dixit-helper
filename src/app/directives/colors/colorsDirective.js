app.directive("colorsDirective", [
	function (){

		return {
			restrict: 'E',
			replace: true,
			scope: {
				colorPicker:'=',
				colorToHide:'=',
				onClick:'&'
				//items:'@'
				//items:'&?',
			},
			templateUrl: 'app/directives/colors/colors.html',
			controller: ['$scope', function($scope){
				
				
			}]

		};

	}]);