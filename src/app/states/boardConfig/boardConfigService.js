app.service("BoardConfigService", [
  '$rootScope',
  '$state',
  '$stateParams',
  function (
    $rootScope,
    $state,
    $stateParams
  ) {

    var _self = {
      data:{
        pusher:null,
        colors:[
          "#d07310",
          "#f62e21",
          "#9121f6",
          "#118ed1",
          "#9caa5c",
          "#f9da0d",
          "#1abc4e",
          "#dc45a2",
        ],
        rabbits:[
          "rabbit1.png",
          "rabbit2.png",
          "rabbit3.png",
          "rabbit4.png",
          "rabbit5.png",
          "rabbit6.png",
          "rabbit7.png",
          "rabbit8.png",
        ],
        activePlayers:[],
        playerNames:[],
        availableColors:[],
        playerColors:[],
        playerRabbits:[],
        gameId:'',
        gameNameSuffix:0,
        gameNamePrefix:''
      },

      initialize:function(){
        // _self.data.gameId = Math.random().toString(36).substring(2, 15);
        _self.data.gameNameSuffix = '_' + Math.round(Math.random()*100000);
        _self.data.gameId = '';

        $rootScope.pusher = new Pusher('a9b70dd2140d41d3e8dd', {
          cluster: 'us2'
          ,authEndpoint: './pusher_auth.php'
        });

        _self.data.availableColors = _self.setAvailableColors(_self.data.colors);

        _self.newBoard();
      },

      newBoard:function(){
        _self.data.gameNamePrefix = _self.data.gameNamePrefix.replace(/[\s\b]/g,'');

        if(_self.data.gameNamePrefix == ''){
          return false;
        }else{

          _self.data.gameId = _self.data.gameNamePrefix + _self.data.gameNameSuffix;

          _self.data.channelNewPlayers = $rootScope.pusher.subscribe('private-registerPlayers');

          _self.data.channelNewPlayers.bind('pusher:subscription_succeeded', function(){
            console.log("Conectado al canal private-registerPlayers");
            _self.data.channelNewPlayers.trigger('client-replyGameId', {'gameId':_self.data.gameId});
            _self.data.channelNewPlayers.bind('client-requestGameId', function(response){
              _self.data.channelNewPlayers.trigger('client-replyGameId', {'gameId':_self.data.gameId});
            });
          });

          _self.data.gameChannel = $rootScope.pusher.subscribe('private-game_'+_self.data.gameId);
          _self.data.gameChannel.bind('pusher:subscription_succeeded', function(){
            console.log("Conectado al canal private-game_"+_self.data.gameId);

            _self.data.gameChannel.bind('client-newPlayer', function(response){
              _self.registerPlayer(response);
            });

            _self.data.gameChannel.bind('client-playerColor', function(response){
              _self.registerColor(response);
            });
          });
        }
      },


      evalGameName:function(){
        _self.data.gameNamePrefix = _self.data.gameNamePrefix.replace(/[^a-zA-Z0-9\s_]/g,'');
        _self.data.gameNamePrefix = _self.data.gameNamePrefix.replace(/\b/g,'');
        _self.data.gameNamePrefix = _self.data.gameNamePrefix.replace(/_*\s+_*/g,'_');

      },

      registerPlayer:function(response){
        _self.data.activePlayers.push(response.playerNumber);
        _self.data.gameChannel.trigger('client-availableColors', _self.getAvailableColors());
      },

      registerColor:function(response){
        _self.data.playerNames[_self.data.activePlayers.indexOf(response.playerNumber)] = response.playerName;
        _self.data.playerColors[_self.data.activePlayers.indexOf(response.playerNumber)] = response.playerColor;
        _self.data.playerRabbits[_self.data.activePlayers.indexOf(response.playerNumber)] = _self.data.rabbits[_self.data.colors.indexOf(response.playerColor)];
        _self.data.availableColors[_self.data.colors.indexOf(response.playerColor)] = 0;

        $rootScope.$digest();


      },

      setAvailableColors:function(colorsArray){
        var availableColorsAux = [];
        for(var color in colorsArray){
          availableColorsAux.push(1);
        }
        return availableColorsAux;
      },

      getAvailableColors:function(){
        var availableColorsAux = '{';
        var theFirst = true;
        _self.data.availableColors.forEach(function(color, index){
          if(color){
            if(theFirst){
              theFirst = false;
            }else{
              availableColorsAux =availableColorsAux+", ";
            }
            availableColorsAux = availableColorsAux+'"color'+index+'": "'+_self.data.colors[index]+'"';
          }
        });
        availableColorsAux = availableColorsAux + "}";

        return availableColorsAux;
      },


      startPlaying:function(){
        $state.go('boardPlaying', {activePlayers: _self.data.activePlayers, playerNames: _self.data.playerNames, playerColors: _self.data.playerColors, playerRabbits: _self.data.playerRabbits, gameId:_self.data.gameId});
      }

    }

    return _self;

  }]);
