app.controller("PlayerConfigController", [
  '$rootScope',
  '$scope',
  '$state',
  '$stateParams',
  function (
    $rootScope,
    $scope,
    $state,
    $stateParams
  ) {


    $rootScope.pusher = new Pusher('a9b70dd2140d41d3e8dd', {
      cluster: 'us2'
      ,authEndpoint: './pusher_auth.php'
      //,callback: 'funcionCallback'
    });

    $scope.playerNumber = Math.random().toString(36).substring(2, 15);
    $scope.playerColor = "";
    $scope.colors = [];
    $scope.hideColor = [];



    $scope.getColors = function(data){
      for(var x in data){
        $scope.colors.push(data[x]);
      }
      $scope.$digest();
      $scope.channel.unbind('client-availableColors');
    }

    $scope.hidePlayerColor = function(){
      $scope.channel.bind('client-playerColor', function(data){
        $scope.hideColor[$scope.colors.indexOf(data.playerColor)]=1;
        $scope.$digest();
      });

    }

    $scope.registerPlayer = function(){
      $scope.channel = $rootScope.pusher.subscribe('private-players');
      $scope.channel.bind('pusher:subscription_succeeded', function() {
        console.log("Conectado al canal private-players");
        $scope.channel.trigger('client-newPlayer', { 'playerNumber': $scope.playerNumber});
        $scope.channel.bind('client-availableColors', function(data) {
          $scope.getColors(data);
          $scope.hidePlayerColor();
        });
      });
    }

    $scope.registerPlayer();



    $scope.sendColor = function(color){
      $scope.playerColor = color;
      $scope.channel.trigger('client-playerColor', {'playerNumber': $scope.playerNumber, 'playerColor': color});
      $state.go('playerPlaying', {playerNumber: $scope.playerNumber, playerColor: $scope.playerColor, channel: $scope.channel});
    }


  }]);
