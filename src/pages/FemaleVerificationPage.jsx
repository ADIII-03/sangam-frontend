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

    if (!document) {
      return alert("Please upload a valid document");
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(document.type)) {
      return alert("Only image files are allowed.");
    }

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
        <small className="text-gray-500">* Only image (JPG/PNG) or PDF files are allowed</small>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Verifying...
            </>
          ) : (
            "Verify & Continue"
          )}
        </button>
      </form>
    </div>
  );
};

export default FemaleVerificationPage;
