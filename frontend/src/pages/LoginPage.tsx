import { Link } from "react-router-dom";
import rightImage from '../assets/purple_flower_chat2.jpg'
import { useState } from "react";
import axios from "axios";
import { useUser } from "../context/userContext";

function LoginPage() {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const {setUser} = useUser()

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);

    try {
      const response = await axios.post("http://localhost:7000/api/login", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Login success", response.data);
      setUser(response.data.user)
      // Optionally redirect or show success message
    } catch (err) {
      console.error("Registration failed", err);
    }
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg flex overflow-hidden max-w-4xl w-full">
      {/* Left */}
      <div className="w-1/2 p-8 flex flex-col justify-center">
        <div className="flex flex-col justify-center h-full">
          <h2 className="text-3xl font-bold mb-2 text-green-900 text-center">Welcome Back</h2>
          <p className="text-gray-600 mb-6 text-center">Login to your account</p>
          <form className="space-y-4 w-full" onSubmit={handleSubmit}>
            <input
              type="email"
              name="username"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="input-style w-full p-1 outline-1 rounded m-1.5"
            />
            <input
              type="password"
              name="username"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="input-style w-full p-1 outline-1 rounded m-1.5"
            />
            <button type="submit" className="w-full bg-green-800 hover:bg-green-700 text-white py-2 rounded-md">
              Sign In
            </button>
          </form>

          <div className="flex items-center justify-center gap-4 my-6">
            <div className="border-t w-1/3"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="border-t w-1/3"></div>
          </div>

          <button
            disabled
            className="w-full bg-gray-100 text-gray-700 py-2 rounded-md flex items-center justify-center gap-2"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google (Coming Soon)
          </button>

          <p className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-green-700 font-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="w-1/2 relative">
        <img
          src={rightImage}
          alt="Login Visual"
          className="object-cover h-full w-full"
        />
        {/* <div className="absolute inset-0 bg-black bg-opacity-20"></div> Optional: slight dark overlay */}
      </div>
    </div>
  );
}

export default LoginPage;
