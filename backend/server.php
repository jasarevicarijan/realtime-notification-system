<?php
// backend/server.php

require __DIR__ . "/vendor/autoload.php";
require_once "MessagePusher.php";

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

$pusher = new MessagePusher();

$server = IoServer::factory(
    new HttpServer(
        new WsServer($pusher)
    ),
    8080
);

echo "WebSocket server running at ws://localhost:8080\n";
$server->run();
