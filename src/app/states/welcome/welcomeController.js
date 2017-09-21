app.controller("WelcomeController", [
    '$scope', 
    '$state',
    '$stateParams',
    function (
        $scope, 
        $state,
        $stateParams
        ) {


        $scope.newBoard = function(){
            $state.go('boardConfig');
        }

        $scope.newPlayer = function(){
            $state.go('playerConfig');
        }

    }]);