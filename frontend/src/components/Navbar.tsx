import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  
  // Example: if user logged in, you can use context/auth state instead of hardcoded false
  const isLoggedIn = false; // Change later when you add auth

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex items-center justify-between">
      {/* Left Side - Logo */}
      <div className="text-2xl font-bold text-green-900">
        <Link to="/">ScaledChat</Link>
      </div>

      {/* Right Side - Links or Icons */}
      <div className="flex items-center gap-6">
        {!isLoggedIn ? (
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
        ) : (
          <>
            {/* Placeholder for when logged in */}
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div> {/* User Icon Placeholder */}
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div> {/* Notification Icon Placeholder */}
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
