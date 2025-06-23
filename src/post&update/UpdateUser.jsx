import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserProfileThunk } from "../store/slice/user/user.thunk";


const UpdateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userProfile, buttonLoading } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "");
      setPreview(userProfile.profilepic || "");
    }
  }, [userProfile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    if (profilePic) {
      formData.append("profilepic", profilePic);
    }

    const resultAction = await dispatch(updateUserProfileThunk(formData));
    
    if (updateUserProfileThunk.fulfilled.match(resultAction)) {
      navigate(`/user/${userProfile._id}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Update Profile</h2>

      {/* Profile picture preview */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <img
            src={preview || "/default.png"}
            alt="Profile Preview"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

       <div className="form-control">
  <label className="label">
    <span className="label-text font-medium">Change Profile Picture</span>
  </label>

  <div className="flex items-center gap-4">
    <label className="btn btn-outline btn-sm">
      <span>Upload</span>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </label>
    {profilePic && (
      <span className="text-sm text-gray-500 truncate max-w-xs">
        {profilePic.name}
      </span>
    )}
  </div>
</div>


        <button
          type="submit"
          disabled={buttonLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {buttonLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
