import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

function MessageInput({ onSend, onTyping }: any) {
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const handleEmojiClick = (emojiData: any) => {
    setMessage((prev) => prev + emojiData.emoji);
    onTyping(); // also trigger typing when emoji is selected
  };

  const handleSend = () => {
    if (message.trim() !== "") {
      onSend(message);
      setMessage("");
    }
  };

  const handleInputChange = (e: any) => {
    setMessage(e.target.value);
    onTyping();
  };

  return (
    <div className="p-4 border-t bg-white relative">
      {showEmoji && (
        <div className="absolute bottom-16 left-4 z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <div className="flex items-center gap-2">
        <button onClick={() => setShowEmoji(!showEmoji)} className="text-2xl">
          😊
        </button>

        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
          placeholder="Type a message"
        />

        <button
          onClick={handleSend}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
