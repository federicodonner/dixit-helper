app.service("BoardPlayingService", [
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
        activePlayers:[],
        activeColors:[],
        channel:null,
        playerRabbits:[],
        playerPositions:[],
        roundVotes:[],
        roundCards:[],
        turnCard:0,
        message:"",
        readyForNextRound:false,
        cardVotes:[]
      },

      initialize:function(){
        _self.data.activePlayers = $stateParams.activePlayers;
        _self.data.playerColors = $stateParams.playerColors;
        _self.data.playerRabbits = $stateParams.playerRabbits;

        _self.data.channel = $rootScope.pusher.subscribe('private-players');

        _self.sendPlayerList();
        _self.receiveVotes();

        _self.resetForNextRound();
      },

      sendPlayerList:function(){
        _self.data.channel.trigger('client-playerList', _self.getPlayerList());

      },


      getPlayerList:function(){
        var playerListAux = '{"players": [';
        var theFirst = true;
        _self.data.activePlayers.forEach(function(player, index){
          _self.data.roundVotes.push(0);
          _self.data.roundCards.push(0);
          _self.data.playerPositions.push(0);
          if(theFirst){
            theFirst = false;
          }else{
            playerListAux = playerListAux + ', ';
          }
          playerListAux = playerListAux + '{"player": "' + player + '", "color": "' + _self.data.playerColors[index] + '", "position": ' + _self.data.playerPositions[index] + '}';
        });
        playerListAux = playerListAux + ']}';
        return playerListAux;
      },

      getPlayerPositions:function(){
        var playerListAux = '{"players": [';
        var theFirst = true;
        _self.data.activePlayers.forEach(function(player, index){
          if(theFirst){
            theFirst = false;
          }else{
            playerListAux = playerListAux + ', ';
          }
          playerListAux = playerListAux + '{"player": "' + player + '", "position": ' + _self.data.playerPositions[index] + '}';
        });
        playerListAux = playerListAux + ']}';
        return playerListAux;
      },




      receiveVotes:function(){
        _self.data.channel.bind('client-playerVote', function(response){
          _self.data.roundVotes[_self.data.activePlayers.indexOf(response.player)] = response.vote;
          _self.data.roundCards[_self.data.activePlayers.indexOf(response.player)] = response.card;
          $rootScope.$digest();
        });
      },




      allVotesIn:function(){
        var allIn = true;
        _self.data.roundVotes.forEach(function(vote, index){
          if(vote == 0){
            allIn = false;
          }
        });
        _self.data.roundCards.forEach(function(card, index){
          if(card == 0){
            allIn = false;
          }
        });
        return allIn;
      },


      processPoints:function(){
        if(_self.allVotesIn()){
          _self.data.turnCard = _self.getTurnCard();
          _self.countEachCardVotes();
          _self.showVotesInPlayers();
          if(_self.allVotesCorrectOrNot(true, _self.data.turnCard)){
            _self.data.roundVotes.forEach(function(vote, index){
              if(vote!=999){
                _self.data.playerPositions[index] = _self.data.playerPositions[index]+2;
              }
            });
          }else if(_self.allVotesCorrectOrNot(false, _self.data.turnCard)){
            _self.data.roundVotes.forEach(function(vote, index){
              if(vote!=999){
                _self.data.playerPositions[index] = _self.data.playerPositions[index]+2;
                _self.data.playerPositions[_self.data.roundCards.indexOf(vote)] = _self.data.playerPositions[_self.data.roundCards.indexOf(vote)] + 1;
              }
            });
          }else{
            _self.data.roundVotes.forEach(function(vote, index){
              if(vote == _self.data.turnCard || vote == 999){
                _self.data.playerPositions[index] = _self.data.playerPositions[index] + 3;
              }else{
                _self.data.playerPositions[_self.data.roundCards.indexOf(vote)] = _self.data.playerPositions[_self.data.roundCards.indexOf(vote)] + 1;
              }
            });
          }
          _self.data.readyForNextRound = true;
        }else{
          _self.data.message = "Faltan votos";
        }
      },

      getTurnCard:function(){
        var card = 1;
        var searching = true;
        while(searching){
          if(_self.data.roundCards.indexOf(card)==-1){
            searching = false;
          }else{
            card++;
          }
        }
        return card;
      },

      countEachCardVotes:function(){
        console.log(_self.data.roundVotes);
        _self.data.roundVotes.forEach(function(vote, index){
          if(vote != 999){
            _self.data.cardVotes[vote] = _self.data.cardVotes[vote] + 1;
          }
        });
      },

      allVotesCorrectOrNot:function(allCorrectOrNot, turnCard){
        var areAllVotesCorrect = true;
        _self.data.roundVotes.forEach(function(vote, index){
          if(allCorrectOrNot){
            if(vote != turnCard && vote != 999){
              areAllVotesCorrect = false;
            }
          }else{
            if(vote == turnCard){
              areAllVotesCorrect = false;
            }
          }
        });
        return areAllVotesCorrect;
      },

      showVotesInPlayers:function(){
        _self.data.channel.trigger('client-showVotes', "Mostrar Votos");
        console.log("send show votes");
      },

      sendResetToPlayers:function(){
        _self.data.channel.trigger('client-newRound', _self.getPlayerPositions());
      },

      resetForNextRound:function(){
        _self.data.roundVotes = [];
        _self.data.roundCards = [];
        _self.data.cradVotes = [];

        _self.data.activePlayers.forEach(function(player, index){
          _self.data.roundVotes[index] = 0;
          _self.data.roundCards[index] = 0;
          _self.data.cardVotes[index] = 0;
        });
        _self.data.turnCard = 0;
        _self.data.readyForNextRound = false;
        _self.data.message = ""
        _self.sendResetToPlayers();

      }
    }

    return _self

  }]);
