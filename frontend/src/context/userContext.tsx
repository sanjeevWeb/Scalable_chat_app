import { createContext, useContext, useState } from "react";

// 1. Create the context
const UserContext = createContext<any>(null);

// 2. Create the provider component
export function UserProvider({ children }: any) {
    const [user, setUser] = useState(null); // null means logged out

    const login = (userData: any) => {
        setUser(userData); // userData can include id, name, email, token, etc.
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}

// 3. Custom hook to use the context
export const useUser = () => useContext(UserContext);
