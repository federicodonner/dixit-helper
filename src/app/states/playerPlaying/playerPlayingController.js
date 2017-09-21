app.controller("PlayerPlayingController", [
  '$scope',
  '$state',
  '$stateParams',
  'PlayerPlayingService',
  function (
    $scope,
    $state,
    $stateParams,
    PlayerPlayingService
  ) {


    $scope.data = PlayerPlayingService.data;

    PlayerPlayingService.initialize();

    $scope.sendVote = PlayerPlayingService.sendVote;
    $scope.myVote = PlayerPlayingService.myVote;
    $scope.myCard = PlayerPlayingService.myCard;
    $scope.myTurn = PlayerPlayingService.myTurn;
    $scope.vote = PlayerPlayingService.vote;
    $scope.notMyTurn = PlayerPlayingService.notMyTurn;


  }]);
