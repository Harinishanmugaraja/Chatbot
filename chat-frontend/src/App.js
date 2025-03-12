import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);

    useEffect(() => {
        socket.on("receiveMessage", (msg) => {
            setChat((prev) => [...prev, msg]);
        });
    }, []);

    const sendMessage = () => {
        socket.emit("sendMessage", message);
        setMessage("");
    };

    return (
        <div>
            <h2>Chat App</h2>
            <div>
                {chat.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default App;
