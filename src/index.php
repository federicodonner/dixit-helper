<?php
include "pusher/Pusher.php";

$app_id = '373225';
$app_key = 'a9b70dd2140d41d3e8dd';
$app_secret = '425a57aac91d5ddb0c2c';
$app_cluster = 'us2';

$pusher = new Pusher\Pusher( $app_key, $app_secret, $app_id, array('cluster' => $app_cluster));

?>


<!DOCTYPE html><html ng-app="dixit">
<head>
	<meta name="viewport" content="width=device-width">
	<title>Dixit</title>
	<meta charset="UTF-8">
</head>
<body>
	<ui-view></ui-view>


	<link rel="stylesheet" type="text/css" href="css/css.css">
	<link href="https://fonts.googleapis.com/css?family=Quicksand:300,400,500,700" rel="stylesheet">

	<script src="scripts/angular.min.js"></script>
	<script src="scripts/angular-ui-router.min.js" ></script>
	<script src="https://js.pusher.com/4.1/pusher.min.js"></script>
	<script src="scripts/angular-local-storage.min.js"></script>
	<script src="app/app.js"></script>

	<script src="app/states/welcome/welcomeController.js"></script>

	<script src="app/states/boardConfig/boardConfigController.js"></script>
	<script src="app/states/boardConfig/boardConfigService.js"></script>

	<script src="app/states/playerConfig/playerConfigController.js"></script>
<script src="app/states/playerConfig/playerConfigService.js"></script>

	<script src="app/states/playerPlaying/playerPlayingController.js"></script>
	<script src="app/states/playerPlaying/playerPlayingService.js"></script>

	<script src="app/states/boardPlaying/boardPlayingController.js"></script>
	<script src="app/states/boardPlaying/boardPlayingService.js"></script>

	<script src="app/directives/colors/colorsDirective.js"></script>
	<script src="app/directives/votes/votesDirective.js"></script>

	<script src="app/services/localStorageService.js"></script>



</body>
</html>
