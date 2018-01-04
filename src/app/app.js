var app = angular.module('dixit', ['ui.router', 'LocalStorageModule']);

app.config(function($stateProvider, localStorageServiceProvider){
  var welcome = {
    name: 'welcome',

    templateUrl: 'app/states/welcome/index.html',
    controller: 'WelcomeController'
  }

  var boardConfig = {
    name:'boardConfig',
    templateUrl: 'app/states/boardConfig/index.html',
    controller: 'BoardConfigController'
  }

  var playerConfig = {
    name: 'playerConfig',
    templateUrl: 'app/states/playerConfig/index.html',
    controller: 'PlayerConfigController'
  }

  var playerPlaying = {
    name: 'playerPlaying',
    params: {playerNumber: null, playerName: null, playerColor: null, gameId: null, recoverGame:false},
    templateUrl: 'app/states/playerPlaying/index.html',
    controller: 'PlayerPlayingController'
  }

  var boardPlaying = {
    name: 'boardPlaying',
    params: {activePlayers: null, playerNames: null, playerColors: null, playerRabbits: null, gameId: null},
    templateUrl: 'app/states/boardPlaying/index.html',
    controller: 'BoardPlayingController'
  }



  $stateProvider.state(welcome);
  $stateProvider.state(boardConfig);
  $stateProvider.state(playerConfig);
  $stateProvider.state(playerPlaying);
  $stateProvider.state(boardPlaying);


  localStorageServiceProvider.setPrefix('dixit');
  localStorageServiceProvider.setStorageType('localStorage');
  localStorageServiceProvider.setDefaultToCookie(false);
  localStorageServiceProvider.setStorageCookie(3, '/', false);
  localStorageServiceProvider.setStorageCookieDomain('window.location');

});

app.run(function($state){
  console.log("angular run");
  $state.go('welcome');
});
