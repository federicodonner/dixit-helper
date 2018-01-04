app.controller("BoardPlayingController", [
  '$scope',
  'BoardPlayingService',
  function (
    $scope,
    BoardPlayingService
  ) {



    $scope.data = BoardPlayingService.data;

    BoardPlayingService.initialize();

    $scope.allVotesIn = BoardPlayingService.allVotesIn;
    $scope.processPoints = BoardPlayingService.processPoints;
    $scope.resetForNextRound = BoardPlayingService.resetForNextRound;
    $scope.processRound = BoardPlayingService.processRound;


  }]);
  /*


  $scope.activePlayers = $stateParams.activePlayers;
  $scope.playerColors = $stateParams.playerColors;
  $scope.channel = $stateParams.channel;
  $scope.playerRabbits = $stateParams.playerRabbits;
  $scope.playerPositions = [];

  $scope.roundVotes = [];
  $scope.roundCards = [];
  $scope.turnCard = 0;

  $scope.message = "";
  $scope.readyForNextRound = false;

  $scope.getPlayerList = function(){
  var playerListAux = '{"players": [';
  var theFirst = true;
  $scope.activePlayers.forEach(function(player, index){
  $scope.roundVotes.push(0);
  $scope.roundCards.push(0);
  $scope.playerPositions.push(0);
  if(theFirst){
  theFirst = false;
}else{
playerListAux = playerListAux + ', ';
}
playerListAux = playerListAux + '{"player": "' + player + '", "color": "' + $scope.playerColors[index] + '", "position": ' + $scope.playerPositions[index] + '}';
});
playerListAux = playerListAux + ']}';
return playerListAux;
}

$scope.getPlayerPositions = function(){
var playerListAux = '{"players": [';
var theFirst = true;
$scope.activePlayers.forEach(function(player, index){
if(theFirst){
theFirst = false;
}else{
playerListAux = playerListAux + ', ';
}
playerListAux = playerListAux + '{"player": "' + player + '", "position": ' + $scope.playerPositions[index] + '}';
});
playerListAux = playerListAux + ']}';
return playerListAux;
}

$scope.sendPlayerList = function(){
$scope.channel.trigger('client-playerList', $scope.getPlayerList());
}


$scope.receiveVotes = function(){
$scope.channel.bind('client-playerVote', function(data){
$scope.roundVotes[$scope.activePlayers.indexOf(data.player)] = data.vote;
$scope.roundCards[$scope.activePlayers.indexOf(data.player)] = data.card;
$scope.$digest();
});
}


$scope.sendPlayerList();
$scope.receiveVotes();

$scope.allVotesIn = function(){
var allIn = true;
$scope.roundVotes.forEach(function(vote, index){
if(vote == 0){
allIn = false;
}
});
$scope.roundCards.forEach(function(card, index){
if(card == 0){
allIn = false;
}
});
return allIn;
}

$scope.getTurnCard = function(){
var card = 1;
var searching = true;
while(searching){
if($scope.roundCards.indexOf(card)==-1){
searching = false;
}else{
card++;
}
}
return card;
}

$scope.allVotesCorrectOrNot = function(allCorrectOrNot, turnCard){
var areAllVotesCorrect = true;
$scope.roundVotes.forEach(function(vote, index){
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
}



$scope.processPoints = function(){
if($scope.allVotesIn()){
$scope.turnCard = $scope.getTurnCard();
if($scope.allVotesCorrectOrNot(true, $scope.turnCard)){
$scope.roundVotes.forEach(function(vote, index){
if(vote!=999){
$scope.playerPositions[index] = $scope.playerPositions[index]+2;
}
});
}else if($scope.allVotesCorrectOrNot(false, $scope.turnCard)){
$scope.roundVotes.forEach(function(vote, index){
if(vote!=999){
$scope.playerPositions[index] = $scope.playerPositions[index]+2;
$scope.playerPositions[$scope.roundCards.indexOf(vote)] = $scope.playerPositions[$scope.roundCards.indexOf(vote)] + 1;
}
});
}else{
$scope.roundVotes.forEach(function(vote, index){
if(vote == $scope.turnCard || vote == 999){
$scope.playerPositions[index] = $scope.playerPositions[index] + 3;
}else{
$scope.playerPositions[$scope.roundCards.indexOf(vote)] = $scope.playerPositions[$scope.roundCards.indexOf(vote)] + 1;
}
});
}
$scope.readyForNextRound = true;
}else{
$scope.message = "Faltan votos";
}
}



$scope.sendResetToPlayers = function(){
$scope.channel.trigger('client-newRound', $scope.getPlayerPositions());
}

$scope.resetForNextRound = function(){
$scope.activePlayers.forEach(function(player, index){
$scope.roundVotes[index] = 0;
$scope.roundCards[index] = 0;
});
$scope.turnCard = 0;
$scope.readyForNextRound = false;
$scope.message = ""
$scope.sendResetToPlayers();

}


}]);
*/
