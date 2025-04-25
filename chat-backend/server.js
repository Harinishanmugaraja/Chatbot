const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config(); // Load API key from .env file

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sendMessage", async (message) => {
        console.log(`User: ${message}`);

        // Get response from OpenRouter
        const botReply = await getBotResponse(message);

        // Send bot response
        io.emit("receiveMessage", { sender: "User", text: message });
        setTimeout(() => {
            io.emit("receiveMessage", { sender: "Chatbot", text: botReply });
        }, 1000); // Simulate delay
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Function to fetch chatbot response from OpenRouter
async function getBotResponse(userMessage) {
    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }]
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "HTTP-Referer": "http://localhost:3000", // Change if deployed
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error fetching chatbot response:", error.response ? error.response.data : error.message);
        return "Sorry, I couldn't process your request right now.";
    }
}

server.listen(5000, () => console.log("Server running on port 5000"));
