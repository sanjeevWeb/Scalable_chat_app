import { Link } from "react-router-dom";
import rightImage from '../assets/purple_flower_chat2.jpg'

function RegisterPage() {
    return (
        <div className="bg-white rounded-2xl shadow-lg flex overflow-hidden max-w-4xl w-full">
            {/* Left */}
            <div className="w-1/2 p-8 flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                <p className="text-gray-600 mb-6">Let's get you started!</p>
                <form className="space-y-4">
                    <input type="text" placeholder="Username" className="input-style" />
                    <input type="email" placeholder="Email" className="input-style" />
                    <input type="password" placeholder="Password" className="input-style" />
                    <input type="text" placeholder="Profile Status" className="input-style" />
                    <input type="file" className="input-style" />
                    <button className="w-full bg-green-800 text-white py-2 rounded-md">Register</button>
                </form>
                <p className="text-center mt-6 text-sm">
                    Already have an account? <Link to="/" className="text-green-700 font-semibold">Login</Link>
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
