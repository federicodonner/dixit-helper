app.controller("WelcomeController", [
  '$rootScope',
  '$scope',
  '$state',
  '$stateParams',
  'LocalStorageService',
  function (
    $rootScope,
    $scope,
    $state,
    $stateParams,
    LocalStorageService
  ) {

    $scope.localStorageAvailable = false;
    $scope.playerNumber = '';
    $scope.playerColor = '';
    $scope.gameId = '';

    if(LocalStorageService.getPlayerLS() != -1){

      $scope.localStorageAvailable = true;
      var playerData = LocalStorageService.getPlayerLS();

      $scope.playerNumber = playerData.playerNumber;
      $scope.playerColor = playerData.playerColor;
      $scope.gameId = playerData.gameId;
    }


    $scope.newBoard = function(){
      $state.go('boardConfig');
    }

    $scope.newPlayer = function(){
      $state.go('playerConfig');
    }

    $scope.retomarPartida = function(){
      $rootScope.pusher = new Pusher('a9b70dd2140d41d3e8dd', {
        cluster: 'us2'
        ,authEndpoint: './pusher_auth.php'
        //,callback: 'funcionCallback'
      });
      $state.go('playerPlaying', {playerNumber: $scope.playerNumber, playerColor: $scope.playerColor, gameId:$scope.gameId, recoverGame:true});
    }

  }]);
