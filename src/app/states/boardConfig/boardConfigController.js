app.controller("BoardConfigController", [
  '$scope',
  'BoardConfigService',
  function (
    $scope,
    BoardConfigService
  ) {


    $scope.data = BoardConfigService.data;

    BoardConfigService.initialize();

    $scope.startPlaying = BoardConfigService.startPlaying;

    $scope.verTodo = BoardConfigService.verTodo;



  }]);
