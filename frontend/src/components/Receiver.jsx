import { useEffect, useState, useRef } from 'react';

export default function Receiver() {
    const [userId, setUserId] = useState("1");
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState('disconnected');
    const wsRef = useRef(null);
    const reconnectTimeout = useRef(null);
    const reconnectAttempts = useRef(0);

    useEffect(() => {
        setMessages([]);
        setStatus('connecting');

        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        const connect = () => {
            const socket = new WebSocket(`ws://localhost:8080/?userId=${userId}`);

            socket.onopen = () => {
                setStatus('connected');
                reconnectAttempts.current = 0;
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.message && data.timestamp && data.senderId) {
                        setMessages((prev) => [...prev, data]);
                    } else {
                        setMessages((prev) => [...prev, { message: event.data, senderId: 'Unknown', timestamp: new Date().toISOString() }]);
                    }
                } catch {
                    setMessages((prev) => [...prev, { message: event.data, senderId: 'Unknown', timestamp: new Date().toISOString() }]);
                }
            };

            socket.onclose = () => {
                setStatus('disconnected');
                attemptReconnect();
            };

            socket.onerror = () => {
                setStatus('error');
                socket.close();
            };

            wsRef.current = socket;
        };

        const attemptReconnect = () => {
            const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
            reconnectTimeout.current = setTimeout(() => {
                reconnectAttempts.current++;
                setStatus('reconnecting');
                connect();
            }, delay);
        };

        connect();

        return () => {
            if (wsRef.current) wsRef.current.close();
            if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
        };
    }, [userId]);

    return (
        <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-md">
            <h1 className="text-xl font-bold mb-4">Receiver View</h1>

            <label className="block mb-2">Select User</label>
            <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="border rounded px-2 py-1 mb-2 w-full"
            >
                <option value="1">User 1</option>
                <option value="2">User 2</option>
                <option value="3">User 3</option>
            </select>

            <div className="mb-4 text-sm">
                Status: <span className={`font-semibold ${status === 'connected' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-yellow-600'}`}>
          {status}
        </span>
            </div>

            <h2 className="text-lg font-semibold mb-2">Notifications:</h2>
            <div className="border rounded p-4 h-48 overflow-y-scroll bg-gray-100">
                {messages.length === 0 && <div className="text-gray-500">No notifications yet</div>}
                {messages.map(({ message, senderId, timestamp }, idx) => (
                    <div key={idx}>
                        <div><strong>{senderId}</strong> — {new Date(timestamp).toLocaleTimeString()}</div>
                        <div>{message}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
