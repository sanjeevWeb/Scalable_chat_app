import { useState } from "react";
import { Link } from "react-router-dom";
import rightImage from '../assets/purple_flower_chat2.jpg';
import axios from "axios";

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        status: "",
    });
    const [file, setFile] = useState(null);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: any) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data = new FormData();
        data.append("username", formData.username);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("status", formData.status);
        if (file) data.append("profileImage", file); // backend should expect 'profileImage'

        try {
            const response = await axios.post("http://localhost:7000/api/register", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Registration success", response.data);
            // Optionally redirect or show success message
        } catch (err) {
            console.error("Registration failed", err);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg flex overflow-hidden max-w-4xl w-full">
            {/* Left */}
            <div className="w-1/2 p-8 flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                <p className="text-gray-600 mb-6">Let's get you started!</p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <label className="block">
                        <span className="text-gray-700">Username <span className="text-red-500">*</span></span>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="input-style p-1 outline-1 w-fit rounded m-0.5"
                            required
                        />
                    </label>

                    <label className="block">
                        <span className="text-gray-700">Email <span className="text-red-500">*</span></span>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input-style p-1 outline-1 w-fit rounded m-0.5"
                            required
                        />
                    </label>

                    <label className="block">
                        <span className="text-gray-700">Password <span className="text-red-500">*</span></span>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input-style p-1 outline-1 w-fit rounded m-0.5"
                            required
                        />
                    </label>

                    <label className="block">
                        <span className="text-gray-700">Profile Status</span>
                        <input
                            type="text"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="input-style p-1 outline-1 w-fit rounded m-0.5"
                        />
                    </label>

                    <label className="block">
                        <span className="text-gray-700">Profile Image</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="input-style p-1 outline-1 w-fit rounded m-0.5"
                        />
                    </label>

                    <button type="submit" className="w-full bg-green-800 text-white py-2 rounded-md">
                        Register
                    </button>
                </form>
                <p className="text-center mt-6 text-sm">
                    Already have an account?{" "}
                    <Link to="/" className="text-green-700 font-semibold">Login</Link>
                </p>
            </div>

            {/* Right */}
            <div className="w-1/2">
                <img src={rightImage} alt="Register Visual" className="object-cover h-full w-full" />
            </div>
        </div>
    );
}

export default RegisterPage;
