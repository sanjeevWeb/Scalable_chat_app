import { useState, useEffect, useRef } from "react";
import MessageInput from "./MessageInput";

// [
//     { text: "Hey Elon How Tesla going? 😊", sender: "me", time: "1 hour ago" },
//     { text: "Oh faced a lot of hard time but now everything is good", sender: "them", time: "1 hour ago" },
//     { text: "yes what about you", sender: "them", time: "1 hour ago" },
//     { text: "Seems good now", sender: "me", time: "1 hour ago" },
//     { text: "Elon why are you offline now 😁", sender: "me", time: "1 hour ago" },
// ]
function ChatWindow({ chat, messages }: { chat: any, messages: any[] }) {
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef: any = useRef(null);

    const handleSend = (newMessage: string) => {
        // Optimistically update messages
        // You may want to POST to backend too
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (!chat) {
        return <div className="flex-1 flex items-center justify-center text-gray-500">Select a chat to start messaging</div>;
    }

    return (
        <div className="flex-1 h-full flex flex-col bg-gradient-to-tr from-white to-blue-50">
            <div className="flex items-center gap-4 p-4 border-b">
                <img src={chat.img || "https://picsum.photos/200"} className="w-12 h-12 rounded-full" alt="User" />
                <div className="text-lg font-bold">{chat.name}</div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs px-4 py-2 rounded-xl text-white ${msg.sender === "me" ? "bg-cyan-500" : "bg-gradient-to-r from-orange-400 to-orange-500"}`}>
                            <div>{msg.text}</div>
                            <div className="text-xs text-white/80 text-right">{msg.time}</div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm">
                            Typing...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <MessageInput onSend={handleSend} onTyping={() => setIsTyping(true)} />
        </div>
    );
}


export default ChatWindow;
