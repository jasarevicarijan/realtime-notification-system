<?php
// backend/public/send.php

require __DIR__ . "/../vendor/autoload.php";

use WebSocket\Client;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $input = json_decode(file_get_contents("php://input"), true);

    $userId = $input["userId"] ?? null;
    $message = $input["message"] ?? null;

    if (!$userId || !$message) {
        http_response_code(400);
        echo json_encode(["error" => "Missing userId or message"]);
        exit;
    }

    try {
        $client = new Client("ws://localhost:8080/?userId=sender");

        $payload = json_encode([
            "targetUserId" => $userId,
            "message" => $message,
            "senderId" => $input["senderId"] ?? "unknown",
            "timestamp" => date("c"),
        ]);

        $client->send($payload);

        echo json_encode(["success" => true, "message" => "Message sent to user $userId"]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
