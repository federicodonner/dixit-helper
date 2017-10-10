app.controller("PlayerConfigController", [
  '$scope',
  'PlayerConfigService',
  function (
    $scope,
    PlayerConfigService
  ) {
    $scope.data = PlayerConfigService.data;

    PlayerConfigService.initialize();

    $scope.sendColor = PlayerConfigService.sendColor;
    $scope.subscribeToChannel = PlayerConfigService.subscribeToChannel;

  }]);
