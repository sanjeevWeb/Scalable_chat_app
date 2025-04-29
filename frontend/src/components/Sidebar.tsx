import { useState } from "react";

const initialState = [
    { name: "Paul Walker", status: "Offline", img: "https://randomuser.me/api/portraits/men/1.jpg" },
    { name: "Elon Musk", status: "Offline", img: "https://randomuser.me/api/portraits/men/2.jpg" },
    { name: "Mark ZuckerBurg", status: "Offline", img: "https://randomuser.me/api/portraits/men/3.jpg" },
    { name: "Chou Tzu-yu", status: "Offline", img: "https://randomuser.me/api/portraits/women/1.jpg" },
];

function Sidebar() {
    const [users, setUsers] = useState(initialState);


    return (
        <div className="w-72 bg-white shadow-md p-4 overflow-y-auto">
            <div className="text-lg font-bold mb-4">Chats</div>
            {users.length > 0 && users.map((user, idx) => (
                <div key={idx} className="flex items-center gap-4 mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded">
                    <img src={user.img} alt={user.name} className="w-10 h-10 rounded-full" />
                    <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.status}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Sidebar;
