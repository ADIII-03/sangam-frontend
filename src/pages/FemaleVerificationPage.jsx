// src/pages/FemaleVerification.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { femaleVerifyThunk } from "../store/slice/user/user.thunk";
import { useNavigate } from "react-router-dom";

const FemaleVerificationPage = () => {
  const [document, setDocument] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!document) return alert("Please upload a valid document");

    const formData = new FormData();
    formData.append("idProof", document);

    const result = await dispatch(femaleVerifyThunk(formData));

    if (femaleVerifyThunk.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Female Verification</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setDocument(e.target.files[0])}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>
      </form>
    </div>
  );
};

export default FemaleVerificationPage;
