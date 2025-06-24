import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { forgotPasswordThunk } from '../store/slice/user/user.thunk';
import { motion } from 'framer-motion';

import {Helmet } from 'react-helmet';

const ForgotPasswordPage = () => {

  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { buttonLoading } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!email) {
    toast.error('Please enter your email');
    return;
  }

  try {
    await dispatch(forgotPasswordThunk({ email })).unwrap();
    toast.success('Reset link sent successfully! Please check your inbox.');
  } catch (err) {
    toast.error(err?.message || 'Failed to send reset link. Please try again.');
  }
};


  return (

    <>
    <Helmet><title>Forgot Password</title></Helmet>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-xl p-8 mx-auto mt-12"
    >
      <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
        Forgot Password
      </h2>
      <p className="text-gray-400 text-sm text-center mb-6">
        Enter your email address and we’ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-gray-300 text-sm mb-1 block">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full input input-bordered h-10 bg-gray-900 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={buttonLoading}
          className="mt-2 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white 
            font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition duration-200"
        >
          {buttonLoading ? (
            <div className="flex justify-center items-center gap-2">
  <span className="loading loading-spinner text-white" />
  <span>Sending...</span>
</div>

          ) : (
            'Send Reset Link'
          )}
        </motion.button>
      </form>
    </motion.div>
    </>
  );
};

export default ForgotPasswordPage;
