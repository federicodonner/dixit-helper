app.service("LocalStorageService", [
  'localStorageService',
  function (
    localStorageService
  ) {

    var _self = {
      data:{

      },

      initialize:function(){

      },

      storeInLS:function(playerNumber, playerName, playerColor, gameId){
        var playerData = {};
        playerData.playerNumber = playerNumber;
        playerData.playerNAme = playerName;
        playerData.playerColor = playerColor;
        playerData.gameId = gameId;
        localStorageService.set('playerData', playerData);
      },

      getPlayerLS:function(){
        if(localStorageService.get('playerData')){
          return localStorageService.get('playerData');
        }else{
          return -1
        }
      }

    }
    return _self;
  }])
