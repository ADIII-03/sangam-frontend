import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { resetPasswordThunk } from '../store/slice/user/user.thunk';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {Helmet} from 'react-helmet'
 
const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token } = useParams();
  const dispatch = useDispatch();
  const { buttonLoading } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!password || !confirmPassword) {
    toast.error('Please fill in all fields');
    return;
  }

  if (password !== confirmPassword) {
    toast.error('Passwords do not match');
    return;
  }

  try {
    await dispatch(resetPasswordThunk({ token, password })).unwrap();
    navigate('/login');
  } catch (err) {
    toast.error(err?.message || 'Failed to reset password. Please try again.');
  }
};


  return (
    <>
    <Helmet><title>Reset Password</title></Helmet>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-xl p-8 mx-auto mt-12"
    >
      <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
        Reset Password
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-gray-300 text-sm mb-1 block">New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full input input-bordered h-10 bg-gray-900 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm mb-1 block">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full input input-bordered h-10 bg-gray-900 text-white"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
      <span>Resetting...</span>
    </div>
  ) : (
    'Reset Password'
  )}
</motion.button>

      </form>
    </motion.div>
    </>
  );
};

export default ResetPasswordPage;
