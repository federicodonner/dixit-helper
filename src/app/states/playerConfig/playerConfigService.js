app.service("PlayerConfigService", [
  '$rootScope',
  '$state',
  '$stateParams',
  'LocalStorageService',
  function (
    $rootScope,
    $state,
    $stateParams,
    LocalStorageService
  ) {

    var _self = {
      data:{
        playerNumber:0,
        playerColor:'',
        playerName:'',
        colors:[],
        hideColor:[],
        channel:null,
        gamesId:[],
        gameId:'',
        missingName:false
      },

      initialize:function(){
        $rootScope.pusher = new Pusher('a9b70dd2140d41d3e8dd', {
          cluster: 'us2'
          ,authEndpoint: './pusher_auth.php'
        });

        _self.data.playerNumber = Math.random().toString(36).substring(2, 15);
        _self.registerPlayer();
        _self.data.missingName = false;
      },

      registerPlayer:function(){
        _self.data.channel = $rootScope.pusher.subscribe('private-registerPlayers');
        _self.data.channel.bind('pusher:subscription_succeeded', function() {
          console.log("Conectado al canal private-registerPlayers");

          _self.data.channel.trigger('client-requestGameId', {'player':_self.data.playerNumber});
          _self.data.channel.bind('client-replyGameId', function(response){
            if(_self.data.gamesId.indexOf(response.gameId) == -1){
              _self.data.gamesId.push(response.gameId);
              $rootScope.$digest();
            }
          })
        });
      },


      subscribeToChannel:function(channel){
        _self.data.gameChannel = $rootScope.pusher.subscribe('private-game_'+channel);
        _self.data.gameChannel.bind('pusher:subscription_succeeded', function(){
          console.log('conectado al canal private-game_'+channel);
          _self.data.gameId = channel;
          _self.subscribePlayer();
        });
      },

      subscribePlayer:function(){
        _self.data.gameChannel.trigger('client-newPlayer', { 'playerNumber': _self.data.playerNumber});
        _self.data.gameChannel.bind('client-availableColors', function(response) {
          _self.getColors(response);
          _self.hidePlayerColor();
        });
      },

      getColors:function(data){
        for(var x in data){
          _self.data.colors.push(data[x]);
        }
        $rootScope.$digest();
        _self.data.gameChannel.unbind('client-availableColors');
      },

      hidePlayerColor:function(){
        _self.data.gameChannel.bind('client-playerColor', function(response){
          _self.data.hideColor[_self.data.colors.indexOf(response.playerColor)]=1;
          $rootScope.$digest();
        });

      },

      sendColor:function(color){
        if(_self.data.playerName == ''){
          _self.data.missingName = true;
        }else{
          _self.data.playerColor = color;
          _self.data.gameChannel.trigger('client-playerColor', {'playerNumber': _self.data.playerNumber, 'playerName': _self.data.playerName, 'playerColor': color});
          LocalStorageService.storeInLS(_self.data.playerNumber, _self.data.playerName, _self.data.playerColor, _self.data.gameId);
          $state.go('playerPlaying', {playerNumber: _self.data.playerNumber, playerName: _self.data.playerName, playerColor: _self.data.playerColor, gameId:_self.data.gameId, recoverGame:false});
        }
      }


    }

    return _self;

  }]);
