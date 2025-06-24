import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { femaleVerifyThunk } from "../store/slice/user/user.thunk";
import { useNavigate } from "react-router-dom";

const FemaleVerificationPage = () => {
  const [document, setDocument] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);
const { buttonLoading } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!document) {
      return alert("Please upload a valid document");
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];
    if (!allowedTypes.includes(document.type)) {
      return alert("Only image files or PDFs are allowed.");
    }

    const formData = new FormData();
    formData.append("idProof", document);

  const result = await dispatch(femaleVerifyThunk(formData));

if (femaleVerifyThunk.fulfilled.match(result)) {
  navigate("/");
} else {
  alert(result.payload || "Verification failed");
}

  };
  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-base-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        Female Verification
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <label
          htmlFor="file-upload"
          className="btn btn-outline btn-primary w-full cursor-pointer"
          tabIndex={0}
        >
          {document ? (
            <span className="truncate">{document.name}</span>
          ) : (
            "Upload ID Proof (JPG, PNG, PDF)"
          )}
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setDocument(e.target.files[0])}
          className="hidden"
        />

        <p className="text-sm text-gray-500 text-center">
          * Only image (JPG/PNG) or PDF files are allowed
        </p>

   <button
  type="submit"
  disabled={buttonLoading}
  className={`btn btn-primary btn-wide mx-auto ${buttonLoading ? "loading" : ""}`}
>
  {buttonLoading ? "Verifying..." : "Verify & Continue"}
</button>


      </form>
    </div>
  );
};

export default FemaleVerificationPage;
