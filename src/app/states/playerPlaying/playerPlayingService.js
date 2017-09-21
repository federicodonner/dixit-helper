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
        playerColor:"",
        roundVote:0,
        roundCard:0,
        playerNumbers:[],
        playerColors:[],
        playerPositions:[],
        notMyTurn:false,
        message:"",
        imDone:false,
        showVote:false
      },

      initialize:function(){
        _self.data.channel = $rootScope.pusher.subscribe('private-players');
        _self.data.playerNumber = $stateParams.playerNumber;
        _self.data.playerColor = $stateParams.playerColor;

        _self.receivePlayerList();
        _self.beginNextRound();
        _self.receivePlayerTurn();
        _self.receiveShowVotes();
      },

      receivePlayerList:function(){
        _self.data.channel.bind('client-playerList', function(data) {
          _self.savePlayers(data);
        });
      },

      savePlayers:function(response){
        response.players.forEach(function(player){
          _self.data.playerNumbers.push(player.player);
          _self.data.playerColors.push(player.color);
          _self.data.playerPositions.push(player.position);
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
          _self.data.showVote = true;
          _self.data.message = _self.data.roundVote;
          $rootScope.$digest();
          console.log("receiveShowVotes");
        });

      },

      myVote:function(thisVote){
        _self.data.roundVote = thisVote;
      },

      myCard:function(thisCard){
        _self.data.roundCard = thisCard;
      },

      myTurn:function(){
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
        _self.sendVote(0,0);
        _self.data.imDone = false;
      },

      resetForNextRound:function(){
        _self.data.roundVote = 0;
        _self.data.roundCard = 0;
        _self.data.notMyTurn = false;
        _self.data.imDone = false;
        _self.data.showVote = false;
        $rootScope.$digest();

      },

      beginNextRound:function(){
        _self.data.channel.bind('client-newRound', function(response){
          console.log(response);
          _self.resetForNextRound();
        });
      }
    }

    return _self

  }]);
