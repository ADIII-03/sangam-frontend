import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUserThunk } from "../store/slice/user/user.thunk";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const { buttonLoading } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.email || !formData.password) {
    toast.error("Please fill in all fields");
    return;
  }

  try {
     await dispatch(loginUserThunk(formData)).unwrap();

    toast.success("Login successful!");
    navigate("/");

  } catch (err) {
    toast.error(err?.message || "Invalid credentials");
  }
};


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-xl p-8 mx-auto mt-12"
    >
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
        Login <span className="text-white">Sangam</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-gray-300 text-sm mb-1 block">Email</label>
          <input
            type="text"
            name="email"
            placeholder="Enter email"
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

        <div className="flex justify-between text-sm mt-2 text-gray-400">
          <Link to="/forgot-password" className="hover:underline hover:text-blue-500">
            Forgot Password?
          </Link>
          <Link to="/signup" className="hover:underline hover:text-blue-500">
            Don't have an account?
          </Link>
        </div>

       <motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  type="submit"
  disabled={buttonLoading}
  className="mt-4 w-full min-w-[140px] py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white 
    font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition duration-200"
>
  {buttonLoading ? (
    <div className="flex justify-center items-center gap-2">
      <span className="loading loading-spinner text-white" />
      <span>Logging in...</span>
    </div>
  ) : (
    "Login"
  )}
</motion.button>

      </form>
    </motion.div>
  );
};

export default LoginPage;
