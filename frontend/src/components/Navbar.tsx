import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../context/userContext";

function Navbar() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Example: you will replace this later with real auth logic
  const { user } = useUser();
  const isLoggedIn = !!user; // <- change to your auth state later

  // const isLoggedIn = true

  const handleSearch = (e: any) => {
    e.preventDefault();
    // TODO: Call API to search users by name or email
    console.log("Searching for:", searchQuery);
  };

  return (
    <nav className="bg-green-50 shadow-md px-6 md:px-10 py-4 flex items-center justify-between">
      {/* Left Side - Logo */}
      <div className="text-2xl font-bold text-green-900">
        <Link to="/">ScaledChat</Link>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 md:gap-6">
        {isLoggedIn ? (
          <>
            {/* Search bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-1">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent focus:outline-none px-2 text-sm w-40 md:w-64"
              />
              <button type="submit" className="text-green-700 font-semibold text-sm ml-2 hover:text-green-900">
                Search
              </button>
            </form>

            {/* User Icon and Notification Placeholder */}
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          </>
        ) : (
          <>
            {location.pathname !== "/" && (
              <Link to="/" className="text-green-800 hover:text-green-600 font-medium">
                Login
              </Link>
            )}
            {location.pathname !== "/register" && (
              <Link to="/register" className="text-green-800 hover:text-green-600 font-medium">
                Register
              </Link>
            )}
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
