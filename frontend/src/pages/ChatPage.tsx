import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { useState } from "react";
import axios from "axios";

function ChatPage() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);

    const handleChatSelect = async (group: any) => {
        setSelectedChat(group);  // update selected group/user

        try {
            const res = await axios.get(`http://localhost:7000/api/messages/${group.id}`);
            setMessages(res.data);
        } 
        catch (err) {
            console.error("Failed to load messages", err);
        }
    };

    return (
        <div className="flex h-screen w-full">
            <Sidebar onChatSelect={handleChatSelect} />
            <ChatWindow chat={selectedChat} messages={messages} />
        </div>
    );
}

export default ChatPage;

