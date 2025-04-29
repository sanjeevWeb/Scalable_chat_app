import { useEffect, useState } from "react";
import axios from "axios";

function CreateGroupModal({ onClose, onGroupCreated }: any) {
    const [groupName, setGroupName] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`http://localhost:7000/api/users`, {
                params: { search, page }
            });
            setUsers(res.data.users);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search, page]);

    const toggleUser = (user:any) => {
        if (selectedUsers.find((u:any) => u.id === user.id)) {
            setSelectedUsers(prev => prev.filter((u:any) => u.id !== user.id));
        } 
        else {
            // setSelectedUsers((prev: React.SetStateAction<users[]>) => [...prev, user]);
            setSelectedUsers((prev): any => {
                return [...prev, user]
            });
        }
    };

    const handleCreateGroup = async () => {
        if (!groupName || selectedUsers.length < 3) return;

        try {
            await axios.post("http://localhost:7000/api/groups", {
                name: groupName,
                members: selectedUsers.map((u: any) => u.id),
            });
            onGroupCreated();
            onClose();
        } catch (err) {
            console.error("Group creation failed", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-green-100 bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[500px] max-h-[80vh] overflow-auto">
                <h2 className="text-xl font-bold mb-4">Create New Group</h2>
                <input
                    type="text"
                    placeholder="Group Name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full mb-3 px-3 py-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Search users by name or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full mb-3 px-3 py-2 border rounded"
                />

                <div className="space-y-2 mb-4">
                    {users.length> 0 && users.map((user: any) => (
                        <div
                            key={user.id}
                            onClick={() => toggleUser(user)}
                            className={`p-2 rounded cursor-pointer ${selectedUsers.find((u: any) => u.id === user.id) ? "bg-green-100" : "hover:bg-gray-100"}`}
                        >
                            <div className="font-semibold">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center mb-4">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="text-sm px-3 py-1 border rounded">Prev</button>
                    <span className="text-sm">Page {page} of {totalPages}</span>
                    <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="text-sm px-3 py-1 border rounded">Next</button>
                </div>

                <button
                    onClick={handleCreateGroup}
                    disabled={groupName === "" || selectedUsers.length < 3}
                    className="w-full bg-green-800 text-white py-2 rounded disabled:opacity-50"
                >
                    Create Group ({selectedUsers.length} selected)
                </button>

                <button onClick={onClose} className="mt-2 w-full text-gray-500 hover:underline">Cancel</button>
            </div>
        </div>
    );
}

export default CreateGroupModal;
