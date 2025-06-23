import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { verifyEmailThunk } from "../store/slice/user/user.thunk";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const VerifyEmailPage = () => {
 const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const dispatch = useDispatch();
  const { buttonLoading } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!verificationCode) {
    toast.error("Please enter the verification code");
    return;
  }

  try {
    await dispatch(verifyEmailThunk({ verificationCode })).unwrap();

    toast.success("Email verified successfully!");
    navigate("/who-are-you");
  } catch (err) {
    toast.error(err?.message || "Verification failed. Please try again.");
  }
};


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-xl p-8 mx-auto mt-12"
    >
      <h1 className="text-3xl font-semibold mb-6 text-center bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
        Verify Your Email
      </h1>
      <p className="text-center text-gray-300 mb-6">
        A verification code has been sent to your email.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-gray-300 text-sm mb-1 block">
            Verification Code
          </label>
          <input
            type="text"
            placeholder="Enter code"
            className="w-full input input-bordered h-10 bg-gray-900 text-white"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
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
      <span>Verifying...</span>
    </div>
  ) : (
    "Verify Email"
  )}
</motion.button>

      </form>
    </motion.div>
  );
};

export default VerifyEmailPage;
