app.service("PlayerPlayingService", [
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
        channel:null,
        playerNumber:0,
        playerName:'',
        playerColor:"",
        roundVote:0,
        roundCard:0,
        playerNumbers:[],
        playerColors:[],
        playerPositions:[],
        playerNames:[],
        notMyTurn:false,
        message:"",
        imDone:false,
        showVote:false,
        errorInVote:false
      },

      initialize:function(){
        _self.data.channel = $rootScope.pusher.subscribe('private-game_'+$stateParams.gameId);


        _self.data.channel.bind('pusher:subscription_succeeded', function(){
          console.log('conectado al canal private-game_'+$stateParams.gameId);

          if($stateParams.recoverGame){
            _self.data.channel.trigger('client-getPlayersRecover', {'playerId':_self.data.playerNumber});
          }

        });


        _self.data.playerNumber = $stateParams.playerNumber;
        _self.data.playerName = $stateParams.playerName;
        _self.data.playerColor = $stateParams.playerColor;
        _self.receivePlayerList();
        _self.beginNextRound();
        _self.receivePlayerTurn();
        _self.receiveShowVotes();
        _self.showVotesError();
      },

      receivePlayerList:function(){
        _self.data.channel.bind('client-playerList', function(data) {
          _self.savePlayers(data);
        });
      },

      savePlayers:function(response){
        _self.data.playerNumbers = [];
        _self.data.playerColors = [];
        _self.data.playerPositions = [];
        _self.data.playerNames = [];
        response.players.forEach(function(player){
          _self.data.playerNumbers.push(player.player);
          _self.data.playerColors.push(player.color);
          _self.data.playerPositions.push(player.position);
          _self.data.playerNames.push(player.name);
          $rootScope.$digest();

        });
      },

      receivePlayerTurn:function(){
        _self.data.channel.bind('client-playerVote', function(response){
          if(response.vote == 999){
            _self.data.notMyTurn = true;
            $rootScope.$digest();
          }else if(response.vote == 0){
            _self.data.notMyTurn = false;
            $rootScope.$digest();
          }
        })
      },

      receiveShowVotes:function(){
        _self.data.channel.bind('client-showVotes', function(response){
          var votedPlayer = '';
          var votes = [];
          var cards = [];
          var turnCard = 0;
          var myIndex = 0;
          var votedMyCard = [];

          _self.data.errorInVote = false;
          _self.data.showVote = true;

          votes = response.votes;
          cards = response.cards;
          turnCard = response.turnCard;
          myIndex = _self.data.playerNumbers.indexOf(_self.data.playerNumber);

          votes.forEach(function(vote, index){
            if(vote == cards[myIndex]){
              votedMyCard.push(_self.data.playerNames[index]);
            }
          })

          if(!_self.data.notMyTurn){
            //mi turno
            if(votedMyCard.length == 0){
              _self.data.message = 'NO ME VOTÓ NADIE';
            }else if(votedMyCard.length == _self.data.playerNumbers.length-1){
              _self.data.message = 'ME VOTARON TODOS';
            }else{
              _self.data.message = 'ME VOTARON: '+votedMyCard;
            }
          }else{
            if(votes[myIndex] == turnCard){
              //voté a la tarjeta correcta
              votedPlayer = _self.data.playerNames[votes.indexOf(999)];
              _self.data.message = 'VOTÉ A '+votedPlayer;
            }else{
              //voté a otra tarjeta
              votedPlayer = _self.data.playerNames[cards.indexOf(votes[myIndex])]
              _self.data.message = 'Voté a '+votedPlayer;
            }
          }

          if(votedMyCard.length == 0){
            _self.data.playerMessage = 'No te votó nadie';
          }else if(votedMyCard.length == 1){
            _self.data.playerMessage = 'Te votó: '+votedMyCard;
          }else{
            _self.data.playerMessage = 'Te votaron: '+votedMyCard;
          }

          _self.data.playerMessage.replace(/\,/g,', ');

          $rootScope.$digest();
        });

      },

      myVote:function(thisVote){
        _self.data.roundVote = thisVote;
      },

      myCard:function(thisCard){
        _self.data.roundCard = thisCard;
      },

      myTurn:function(){
        _self.data.roundVote = 0;
        _self.sendVote(999, 999);
        _self.data.imDone = true;
        _self.data.message = "MI TURNO";
      },

      vote:function(){
        _self.sendVote(_self.data.roundVote, _self.data.roundCard);
        _self.data.imDone = true;
        _self.data.message = "YA VOTÉ!"
      },

      sendVote:function(vote, card){
        var sendVoteAux = '{"player": "' + _self.data.playerNumber + '", "vote": ' + vote + ', "card": ' + card + '}';
        _self.data.channel.trigger('client-playerVote', sendVoteAux);
      },

      notMyTurn:function(){
        //I need to send an invalid vote to stop the game from progressing
        //if it was my turn, I send 0, 0 to allow other players to claim their turn
        //if it wasn't, send -1, -1 simply to allow myself to vote again but don't free the turn
        if(_self.data.notMyTurn){
          _self.sendVote(-1, -1);
        }else{
          _self.sendVote(0,0);
        }
        _self.data.imDone = false;
        _self.data.errorInVote = false;
      },

      showVotesError:function(){
        console.log('setup show errors');
        _self.data.channel.bind('client-errorInVotes', function(response){
          console.log(response);
          _self.data.errorInVote = true;
          $rootScope.$digest();
        })
      },

      resetForNextRound:function(){
        _self.data.roundVote = 0;
        _self.data.roundCard = 0;
        _self.data.notMyTurn = false;
        _self.data.imDone = false;
        _self.data.showVote = false;
        _self.data.message = '';
        _self.data.playerMessage = '';
        _self.data.errorInVote = false;
        $rootScope.$digest();

      },

      beginNextRound:function(){
        _self.data.channel.bind('client-newRound', function(response){

          _self.resetForNextRound();
        });
      }
    }

    return _self

  }]);
