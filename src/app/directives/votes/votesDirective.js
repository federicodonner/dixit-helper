app.directive("votesDirective", [
	function (){

		return {
			restrict: 'E',
			replace: true,
			scope: {
				activePlayers:'=',
				thisClass: '=',
				onClick:'&'
				//items:'@'
				//items:'&?',
			},
			templateUrl: 'app/directives/votes/votes.html',
			controller: ['$scope', function($scope){
		
				
			}]

		};

	}]);