<?php

include "pusher/Pusher.php";

$app_id = '373225';
$app_key = 'a9b70dd2140d41d3e8dd';
$app_secret = '425a57aac91d5ddb0c2c';
$app_cluster = 'us2';

$pusher = new Pusher\Pusher( $app_key, $app_secret, $app_id, array('cluster' => $app_cluster));

echo $pusher->socket_auth($_POST['channel_name'], $_POST['socket_id']);


?>