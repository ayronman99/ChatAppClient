import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import "./chatApp.css";

const ChatApp = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const socket = io('ws://localhost:3001'); // Connect to the Socket.io server

    useEffect(() => {
        socket.on('chatMessage', (message: string) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // return () => {
        //     socket.disconnect();
        // };
    }, []);

    function wsEmitter() {
        socket.emit('chatMessage', newMessage.trim());
        setNewMessage('');
    }
    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            socket.emit('chatMessage', newMessage.trim());
            setNewMessage('');
        }
    };

    const enterHandler = (evt: React.KeyboardEvent) => {
        if (evt.key === "Enter" && newMessage.trim() !== '') {
            socket.emit('chatMessage', newMessage.trim());
            setNewMessage('');
        }
    };

    return (
        <div className="chat-app border border-2 border-danger min-vh-100 p-2 d-flex flex-column justify-content-center align-items-center">
            <div className="chat-app__msgsContainer border border-2 border-secondary w-75">
                {messages.length < 1 ? <div className="text-align-center">"No messages yet. Start chatting!"</div> :
                    messages.map((message, index) => (
                        <div key={index} className="chat-app__message border border-2 border-info my-2">
                            <div className='d-flex border-radius-2'>
                                <img src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp" className="rounded-circle" style={{ width: "50px" }} alt="Avatar" />
                                <div className='text-bg-success w-50 rounded ms-2'>
                                    {message}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            <div className="chat-app__input border border-2 border-primary w-75">
                <input
                    className='w-75'
                    type="text"
                    value={newMessage}
                    onKeyDown={enterHandler}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button className="w-25" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatApp;