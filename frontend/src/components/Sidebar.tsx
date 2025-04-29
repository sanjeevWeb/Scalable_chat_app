import axios from "axios";
import { useEffect, useState } from "react";
import CreateGroupModal from "./CreateGroupModal";

function Sidebar({ onChatSelect }: { onChatSelect: (group: any) => void }) {
    const [groups, setGroups] = useState([{ name: "my-group", members: 10 }]);
    const [showModal, setShowModal] = useState(false);

    const fetchGroups = async () => {
        try {
            const res = await axios.get("http://localhost:7000/api/groups");
            setGroups(res.data);
        } catch (err) {
            console.error("Failed to fetch groups", err);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    return (
        <div className="w-72 bg-green-100 shadow-md p-4 overflow-y-auto rounded-2xl">
            <div className="text-lg font-bold mb-4 flex justify-between items-center">
                Your Chats..
                <span onClick={() => setShowModal(true)} className="cursor-pointer text-3xl font-extrabold text-green-900">+</span>
            </div>

            {groups.map((group:any, idx) => (
                <div
                    key={idx}
                    onClick={() => onChatSelect(group)}
                    className="flex items-center gap-4 mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded"
                >
                    <img src={group.img || "https://picsum.photos/200/300"} className="w-10 h-10 rounded-full" />
                    <div>
                        <div className="font-semibold">{group.name}</div>
                        <div className="text-sm text-gray-500">{group.members.length} members</div>
                    </div>
                </div>
            ))}

            {showModal && (
                <CreateGroupModal
                    onClose={() => setShowModal(false)}
                    onGroupCreated={fetchGroups}
                />
            )}
        </div>
    );
}

export default Sidebar
