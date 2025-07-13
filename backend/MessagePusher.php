<?php

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

require __DIR__ . "/vendor/autoload.php";

class MessagePusher implements MessageComponentInterface
{
    protected $clients = [];
    protected $userConnections = [];

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $queryParams = [];
        parse_str($conn->httpRequest->getUri()->getQuery(), $queryParams);
        $userId = $queryParams["userId"] ?? null;

        if ($userId) {
            $this->clients->attach($conn);
            $this->userConnections[$userId] = $conn;
            echo "New connection for User $userId ({$conn->resourceId})\n";
        } else {
            $conn->close();
        }
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $data = json_decode($msg, true);

        if (!$data || !isset($data["targetUserId"]) || !isset($data["message"])) {
            $from->send(json_encode(["error" => "Invalid message format"]));
            return;
        }

        $targetUserId = $data["targetUserId"];

        if (!isset($this->userConnections[$targetUserId])) {
            $from->send(json_encode(["error" => "User $targetUserId not connected"]));
            return;
        }

        $this->sendToUser($targetUserId, $msg);
    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);

        foreach ($this->userConnections as $userId => $connection) {
            if ($connection === $conn) {
                unset($this->userConnections[$userId]);
                echo "Connection closed for User $userId\n";
                break;
            }
        }
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error occurred: {$e->getMessage()}\n";
        $conn->close();
    }

    public function sendToUser($userId, $message)
    {
        if (isset($this->userConnections[$userId])) {
            $this->userConnections[$userId]->send($message);
        }
    }
}
