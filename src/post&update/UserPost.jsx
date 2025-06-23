import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUserPostThunk } from "../store/slice/userpost/userpost.thunk";
import { toast } from "react-hot-toast";
import LocationAutocomplete from "../components/LocationAutocomplete";
import { useNavigate } from "react-router-dom";
const UserPost = () => {
  const dispatch = useDispatch();

const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState({ address: "", coordinates: [0, 0] });
  const [files, setFiles] = useState({ images: [], videos: [], documents: [] });
  const [previewUrls, setPreviewUrls] = useState([]);

const createLoading = useSelector((state) => state.userpost.createLoading);

  const handleFileChange = (e, type) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => ({ ...prev, [type]: selectedFiles }));

    if (type === "images" || type === "videos") {
      const urls = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    } else {
      setPreviewUrls([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption.trim()) return toast.error("Caption is required");
    if (!category.trim()) return toast.error("Category is required");
    if (!location.address.trim()) return toast.error("Location is required");

    const postData = {
      caption,
      category,
      location,
      images: files.images.length ? files.images : null,
      videos: files.videos.length ? files.videos : null,
      documents: files.documents.length ? files.documents : null,
    };

    try {
      await dispatch(createUserPostThunk(postData)).unwrap();
      setCaption("");
      setCategory("");
      setLocation({ address: "", coordinates: [0, 0] });
      setFiles({ images: [], videos: [], documents: [] });
      setPreviewUrls([]);
      navigate('/');

    } catch (error) {
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-md shadow-md space-y-6">
      <h2 className="text-2xl font-bold">Create New Post</h2>

      {previewUrls.length > 0 && (
        <div className="flex flex-wrap gap-4 border p-4 rounded-md bg-gray-50">
          {previewUrls.map((url, i) => (
            <div key={i} className="w-32 h-32 border rounded overflow-hidden">
              {files.videos.length > 0 ? (
                <video src={url} controls className="w-full h-full object-cover" />
              ) : (
                <img src={url} alt={`preview-${i}`} className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="font-medium block mb-1">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e, "images")}
            className="file-input file-input-bordered w-full"
          />
        </div>

        <div>
          <label className="font-medium block mb-1">Upload Videos</label>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={(e) => handleFileChange(e, "videos")}
            className="file-input file-input-bordered w-full"
          />
        </div>

        <div>
          <label className="font-medium block mb-1">Upload Documents (Image/Video)</label>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(e) => handleFileChange(e, "documents")}
            className="file-input file-input-bordered w-full"
          />
        </div>

        <div>
          <label className="font-medium block mb-1">Caption</label>
          <textarea
            className="textarea textarea-bordered w-full h-24"
            placeholder="Write your post caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label className="font-medium block mb-1">Category</label>
          <select
            className="select select-bordered w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Old Age Home">Old Age Home</option>
            <option value="Orphanage">Orphanage</option>
            <option value="Slum">Slum</option>
            <option value="Donation">Donation</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="font-medium block mb-1">Location</label>
          <LocationAutocomplete
            onSelect={({ lat, lng, placeName }) =>
              setLocation({ address: placeName, coordinates: [lat, lng] })
            }
          />
          {location.address && (
            <p className="text-sm text-gray-600 mt-1">
              📍 {location.address} (Lat: {location.coordinates[0]}, Lng: {location.coordinates[1]})
            </p>
          )}
        </div>

  <button
  type="submit"
  disabled={createLoading}
  className={`btn btn-primary w-full ${createLoading ? 'loading' : ''}`}
>
  {createLoading ? 'Creating...' : 'Create Post'}
</button>


      </form>
    </div>
  );
};

export default UserPost;
