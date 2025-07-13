import { useState } from 'react';

export default function Sender() {
    const [userId, setUserId] = useState("1");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(null);

    const senderId = "sender1";

    const sendMessage = async () => {
        setStatus(null);
        if (!message.trim()) {
            setStatus({ error: "Message cannot be empty" });
            return;
        }

        try {
            const res = await fetch("http://localhost:8081/send.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    message,
                    senderId
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setStatus({ success: data.message });
                setMessage("");
            } else {
                setStatus({ error: data.error || "Failed to send message" });
            }
        } catch (error) {
            setStatus({ error: error.message });
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-md">
            <h1 className="text-xl font-bold mb-4">Sender View</h1>
            <label className="block mb-2">Select User</label>
            <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="border rounded px-2 py-1 mb-4 w-full"
            >
                <option value="1">User 1</option>
                <option value="2">User 2</option>
                <option value="3">User 3</option>
            </select>

            <label className="block mb-2">Message</label>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border rounded px-2 py-1 mb-4 w-full"
            />

            <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={!message.trim()}
            >
                Send
            </button>

            {status?.success && <p className="mt-2 text-green-600">{status.success}</p>}
            {status?.error && <p className="mt-2 text-red-600">{status.error}</p>}
        </div>
    );
}
