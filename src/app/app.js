var app = angular.module('dixit', ['ui.router', 'LocalStorageModule']);

app.config(function($stateProvider, localStorageServiceProvider){
  var welcome = {
    name: 'welcome',
    url: '/welcome',
    templateUrl: 'app/states/welcome/index.html',
    controller: 'WelcomeController'
  }

  var boardConfig = {
    name:'boardConfig',
    url: '/boardConfig',
    templateUrl: 'app/states/boardConfig/index.html',
    controller: 'BoardConfigController'
  }

  var playerConfig = {
    name: 'playerConfig',
    url: '/playerConfig',
    templateUrl: 'app/states/playerConfig/index.html',
    controller: 'PlayerConfigController'
  }

  var playerPlaying = {
    name: 'playerPlaying',
    url: '/playerPlaying',
    params: {playerNumber: null, playerColor: null, channel: null},
    templateUrl: 'app/states/playerPlaying/index.html',
    controller: 'PlayerPlayingController'
  }

  var boardPlaying = {
    name: 'boardPlaying',
    url: '/boardPlaying',
    params: {activePlayers: null, playerColors: null, playerRabbits: null, channel: null},
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
  localStorageServiceProvider.setDefaultToCookie(true);
  localStorageServiceProvider.setStorageCookie(3, '/', false);
  localStorageServiceProvider.setStorageCookieDomain('window.location');

});

app.run(function($state){
  console.log("angular run");
  $state.go('welcome');
});
