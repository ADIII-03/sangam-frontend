import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-hot-toast";
import { registerUserThunk ,getUserProfileThunk } from "../store/slice/user/user.thunk";
import { Loader, CameraIcon } from "lucide-react";

const SignUpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { buttonLoading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    profilepic: null,
  });

  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === "profilepic") {
      const file = e.target.files[0];
      setProfilePicPreview(URL.createObjectURL(file));
      setFormData({ ...formData, profilepic: file });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, gender, profilepic } = formData;

    if (!name || !email || !password || !confirmPassword || !gender || !profilepic) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", name);
    formDataToSend.append("email", email);
    formDataToSend.append("password", password);
    formDataToSend.append("gender", gender);
    formDataToSend.append("profilepic", profilepic);

    try {
      await dispatch(registerUserThunk(formDataToSend)).unwrap();
      setTimeout(() => {
  dispatch(getUserProfileThunk()); // 👈 update pic after backend upload
}, 5000);
          toast.success("Registration successful! Please check your email for verification.");
      navigate("/verify-email");
  
    } catch (err) {
      toast.error(err?.message || "Registration failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-xl p-8 mx-auto mt-12"
    >
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
        Create Account
      </h2>

      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-4 border-blue-500">
          {profilePicPreview ? (
            <img src={profilePicPreview} alt="Profile Preview" className="object-cover w-full h-full" />
          ) : (
            <CameraIcon className="w-full h-full p-8 text-gray-400" />
          )}
          <input
            type="file"
            name="profilepic"
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
        <p className="mt-2 text-gray-300 font-medium">Upload Profile Picture</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <div>
          <label className="text-gray-300 text-sm mb-1 block">Name</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            className="w-full input input-bordered h-10 bg-gray-900 text-white"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm mb-1 block">Email</label>
          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            className="w-full input input-bordered h-10 bg-gray-900 text-white"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm mb-1 block">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            className="w-full input input-bordered h-10 bg-gray-900 text-white"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm mb-1 block">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full input input-bordered h-10 bg-gray-900 text-white"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-4 mt-2 text-gray-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === "male"}
              onChange={handleChange}
              className="radio border-slate-600"
            />
            Male
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === "female"}
              onChange={handleChange}
              className="radio border-slate-600"
            />
            Female
          </label>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={buttonLoading}
          className="mt-4 w-full min-w-[140px] py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white 
          font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition duration-200 text-center"
        >
          {buttonLoading ? (
            <div className="flex justify-center items-center gap-2">
              <Loader className="animate-spin" size={20} />
              <span>Signing up...</span>
            </div>
          ) : (
            "Sign Up"
          )}
        </motion.button>
      </form>

      <div className="text-center mt-4 text-sm text-gray-400">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-400 hover:underline">
          Login
        </Link>
      </div>
    </motion.div>
  );
};

export default SignUpPage;
