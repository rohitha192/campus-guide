import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './CampusQueries.css';

const CampusQueries = () => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: "Hello! I am Vignan's campus guide. How can I help you today?" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        const userMessage = { sender: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            
            // --- THIS URL MUST BE EXACTLY AS WRITTEN ---
            const res = await axios.post('http://localhost:5000/api/queries/ask', { query: userInput }, config);

            const botMessage = { sender: 'bot', text: res.data.response };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Error fetching chat response:", error);
            const errorMessage = { sender: 'bot', text: "Sorry, I'm having trouble connecting right now. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="campus-queries-container">
            <h1>Vignan Campus Queries</h1>
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-bubble ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
                {isLoading && (
                    <div className="chat-bubble bot typing-indicator">
                        <span></span><span></span><span></span>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <form className="chat-input-form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask about library timings, fests, clubs..."
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>Send</button>
            </form>
        </div>
    );
};

export default CampusQueries;

