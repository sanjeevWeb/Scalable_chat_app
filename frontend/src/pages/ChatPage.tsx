import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

function ChatPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* <SearchBar /> */}
      <Sidebar />
      <ChatWindow />
    </div>
  );
}

export default ChatPage;
