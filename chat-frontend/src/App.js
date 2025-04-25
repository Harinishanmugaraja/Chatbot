import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Connect to backend

function App() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on("receiveMessage", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => socket.off("receiveMessage");
    }, []);

    const sendMessage = () => {
        if (input.trim() !== "") {
            const userMessage = { sender: "User", text: input };
            //setMessages([...messages, userMessage]); // Show user message immediately
            socket.emit("sendMessage", input); // Send to backend
            setInput("");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "20px auto", textAlign: "center" }}>
            <h2>Chat App</h2>
            <div style={{ 
                border: "1px solid #ccc", padding: "10px", height: "300px", 
                overflowY: "auto", marginBottom: "10px", textAlign: "left"
            }}>
                {messages.map((msg, index) => (
                    <p key={index}><strong>{msg.sender}:</strong> {msg.text}</p>
                ))}
            </div>
            <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                style={{ width: "70%", padding: "5px" }}
            />
            <button onClick={sendMessage} style={{ marginLeft: "5px", padding: "5px 10px" }}>Send</button>
        </div>
    );
}

export default App;
