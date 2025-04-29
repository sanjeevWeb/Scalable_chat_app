import { useState, useEffect, useRef } from "react";
import MessageInput from "./MessageInput";

function ChatWindow() {
    const [messages, setMessages] = useState([
        { text: "Hey Elon How Tesla going? 😊", sender: "me", time: "1 hour ago" },
        { text: "Oh faced a lot of hard time but now everything is good", sender: "them", time: "1 hour ago" },
        { text: "yes what about you", sender: "them", time: "1 hour ago" },
        { text: "Seems good now", sender: "me", time: "1 hour ago" },
        { text: "Elon why are you offline now 😁", sender: "me", time: "1 hour ago" },
    ]);

    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const handleSend = (newMessage: any) => {
        setMessages((prev) => [...prev, { text: newMessage, sender: "me", time: "just now" }]);
        setIsTyping(false);  // Stop typing when message sent
    };

    // Auto-scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            // messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="flex-1 h-full flex flex-col bg-gradient-to-tr from-white to-blue-50">
            <div className="flex items-center gap-4 p-4 border-b">
                <img src="https://randomuser.me/api/portraits/men/2.jpg" className="w-12 h-12 rounded-full" alt="User" />
                <div className="text-lg font-bold">Elon Musk</div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs px-4 py-2 rounded-xl text-white ${msg.sender === "me" ? "bg-cyan-500" : "bg-gradient-to-r from-orange-400 to-orange-500"}`}>
                            <div>{msg.text}</div>
                            <div className="text-xs text-white/80 text-right">{msg.time}</div>
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm">
                            Typing...
                        </div>
                    </div>
                )}

                {/* Dummy div for auto-scroll */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <MessageInput onSend={handleSend} onTyping={() => setIsTyping(true)} />
        </div>
    );
}

export default ChatWindow;
