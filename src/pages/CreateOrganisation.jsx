import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createngoThunk } from '../store/slice/ngo/ngo.thunk.js';
import { useNavigate } from 'react-router-dom';
import LocationAutocomplete from '../components/LocationAutocomplete';
import { CameraIcon } from 'lucide-react';

const CreateNGOForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', description: '', establishedYear: '',
    idType: '', phone: '', website: '', instagram: '', facebook: '', twitter: '',
    address: '', coordinates: '', logo: null, doc: null,
  });
  const [logoPreview, setLogoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === 'logo') {
        setLogoPreview(URL.createObjectURL(files[0]));
      }
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleLocationSelect = ({ lng, lat, placeName }) => {
    setFormData((prev) => ({
      ...prev,
      coordinates: `${lng},${lat}`,
      address: placeName,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ['name', 'email', 'password', 'description', 'address', 'coordinates'];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        alert(`Please fill the ${field} field`);
        return;
      }
    }
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      await dispatch(createngoThunk(data)).unwrap();
      navigate("/");
    } catch (error) {
      alert("Failed to create NGO. Please try again.");
    }
  };

  return (
   <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
  <form
    onSubmit={handleSubmit}
    className="card w-full max-w-3xl bg-base-100 shadow-xl p-10 space-y-6"
  >
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
        {logoPreview ? (
          <img src={logoPreview} alt="Logo Preview" className="object-cover w-full h-full" />
        ) : (
          <CameraIcon className="w-full h-full p-8 text-base-content opacity-30" />
        )}
        <input
          type="file"
          name="logo"
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
      <p className="mt-2 font-semibold text-base-content">Upload Logo</p>
    </div>

    <h2 className="text-3xl font-bold text-center text-primary">Register Your NGO</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        'name', 'email', 'password', 'description', 'establishedYear',
        'idType', 'phone', 'website', 'instagram', 'facebook', 'twitter'
      ].map((field) => (
        <input
          key={field}
          type={field === 'password' ? 'password' : 'text'}
          name={field}
          value={formData[field] || ''}
          onChange={handleChange}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
          className="input input-bordered w-full"
        />
      ))}
    </div>

    <div>
      <label className="label">
        <span className="label-text">Upload Government Document</span>
      </label>
      <input
        type="file"
        name="doc"
        onChange={handleChange}
        accept="application/pdf,image/*"
        className="file-input file-input-bordered w-full"
      />
    </div>

    <div>
      <label className="label">
        <span className="label-text font-semibold">NGO Location</span>
      </label>
      <LocationAutocomplete onSelect={handleLocationSelect} />
    </div>

    <div className="text-center">
      <button
        type="submit"
        className="btn btn-primary btn-wide"
      >
        Submit NGO
      </button>
    </div>
  </form>
</div>

  );
};

export default CreateNGOForm;