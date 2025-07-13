# Realtime Notification System

A simple realtime notification system built with **PHP (Ratchet WebSocket server)** for the backend and **React** for the frontend. This project demonstrates how to send and receive live notifications between multiple users using WebSockets.

---

## Features

* WebSocket server implemented with Ratchet PHP library
* React frontend with separate **Sender** and **Receiver** components
* Clean message handling with sender info and timestamps

---

## Project Structure

```
backend/
  ├─ public/
  │   └─ send.php           # REST endpoint to send messages via WebSocket
  ├─ MessagePusher.php      # WebSocket server class handling connections & messages
  └─ server.php             # WebSocket server bootstrap script

frontend/
  ├─ Sender.jsx             # React component to send messages to a selected user
  └─ Receiver.jsx           # React component to receive messages for a selected user
```

---

## Requirements

* PHP 8.1+ with [Composer](https://getcomposer.org/)
* Node.js & npm
* Ratchet WebSocket library (installed via Composer)
* Modern browser supporting WebSocket

---

## Installation

### Backend

1. Clone this repository and navigate to the backend folder:

   ```bash
   cd backend
   ```

2. Install PHP dependencies:

   ```bash
   composer install
   ```

3. Start the WebSocket server inside the backend directory(open console in backend):

   ```bash
   php server.php
   ```

4. Start the PHP built-in server for the REST API endpoint inside the `public` directory(open console in backend):

   ```bash
   php -S localhost:8081 -t public
   ```

---

### Frontend

1. Navigate to the frontend directory (or your React project folder):

   ```bash
   cd frontend
   ```

2. Install npm dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:

   ```bash
   npm start
   ```

---

## Usage

* Open the React app in your browser (usually `http://localhost:3000`)
* Use the **Sender** view to select a user and send a notification message
* Switch to the **Receiver** view, select the user to receive messages for, and watch live notifications appear in realtime
* Multiple browser tabs or windows can simulate multiple users and connections

---

## Future Improvements

* Add authentication and authorization for users
* Store messages persistently in a database
* Improve UI/UX with better notification styling and read/unread status
* Add message acknowledgments and delivery status
* Implement robust error handling and logging

---

## License

MIT License — feel free to use and modify this project!
