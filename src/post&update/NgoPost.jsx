import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNGOPostThunk } from '../store/slice/ngopost/ngopost.thunk';
import { useNavigate } from 'react-router-dom';
const NGOPostForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createLoading, createError, createSuccess } = useSelector(state => state.ngopost);

  const [caption, setCaption] = useState('');
  const [type, setType] = useState('image');
  const [files, setFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
const [location, setLocation] = useState({
  address: '',
  coordinates: [0, 0],
});

  const handleFiles = (e) => {
    const file = e.target.files[0];
    setFiles([file]);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const postPayload = {
    caption,
    type,
    location,
  };

  if (type === 'image') {
    postPayload.images = files;
  } else if (type === 'video') {
    postPayload.videos = files;
  } else if (type === 'document') {
    postPayload.documents = files;
  }

  try {
    const resultAction = await dispatch(createNGOPostThunk(postPayload));
    if (createNGOPostThunk.fulfilled.match(resultAction)) {
      // Success — only now navigate
      navigate('/');
    } else {
      // Optionally handle failure case here (maybe show error)
      console.error('Failed to create post:', resultAction.error);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};


  return (
    <div className="max-w-3xl mx-auto p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-3xl font-semibold mb-6 text-center">Create NGO Post</h2>

      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-6">
          <div className="card w-96 bg-base-100 shadow-xl mx-auto">
            <figure>
              <img src={imagePreview} alt="Uploaded Preview" className="rounded-t-lg" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Uploaded Image</h2>
              <p>Preview of the image you've selected to post.</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Caption</span>
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Enter post caption"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Type</span>
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Files</span>
          </label>
          <input
            type="file"
            onChange={handleFiles}
            accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : '.pdf,.doc,.docx'}
            className="file-input file-input-bordered w-full"
            required
          />
        </div>

        <button
          type="submit"
          className={`btn btn-primary w-full ${createLoading ? 'loading' : ''}`}
          disabled={createLoading}
        >
          {createLoading ? 'Posting...' : 'Post'}
        </button>

        {createError && <p className="text-red-600">{createError}</p>}
        {createSuccess && <p className="text-green-600">Post created successfully!</p>}
      </form>
    </div>
  );
};

export default NGOPostForm;
