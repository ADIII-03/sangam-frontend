import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNgoProfileThunk, updateNgoProfileThunk } from '../store/slice/ngo/ngo.thunk';
import { useNavigate } from 'react-router-dom';


const UpdateNgoProfile = () => {
  const dispatch = useDispatch();
  const { createNGOLoading, createNGOError, createNGOSuccess, ngo } = useSelector(state => state.ngo);
 const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', description: '', idType: '', address: '', phone: '', website: '',
    instagram: '', facebook: '', twitter: '', coordinates: ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    dispatch(getNgoProfileThunk());
  }, [dispatch]);

  useEffect(() => {
    if (ngo) {
      setFormData({
        name: ngo.name || '',
        email: ngo.email || '',
        description: ngo.description || '',
        idType: ngo.govtVerification?.idType || '',
        address: ngo.address || '',
        phone: ngo.phone || '',
        website: ngo.website || '',
        instagram: ngo.socialLinks?.instagram || '',
        facebook: ngo.socialLinks?.facebook || '',
        twitter: ngo.socialLinks?.twitter || '',
        coordinates: ngo.location?.coordinates ? ngo.location.coordinates.join(',') : ''
      });
      setLogoPreview(ngo.logoUrl || '');
    }
  }, [ngo]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData();
  Object.entries(formData).forEach(([key, value]) => data.append(key, value));
  if (logoFile) data.append('logo', logoFile);

  const result = await dispatch(updateNgoProfileThunk({ ngoId: ngo._id, data }));

  if (updateNgoProfileThunk.fulfilled.match(result)) {
    navigate('/ngo-profile');
  }
};


  return (
    <div className="max-w-3xl mx-auto p-6 bg-base-200 rounded-lg shadow-md mt-10">
      <div className="flex flex-col items-center mb-6">
        {logoPreview && (
          <div className="relative w-32 h-32">
            <img src={logoPreview} alt="NGO Logo" className="rounded-full w-32 h-32 object-cover" />
            <label className="absolute bottom-0 right-0 btn btn-xs btn-circle btn-primary cursor-pointer">
              ✎
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        )}
        <h2 className="text-3xl font-bold mt-4">Update NGO Profile</h2>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        {[
          ['name', 'text', 'Name'],
          ['email', 'email', 'Email'],
          ['idType', 'text', 'ID Type'],
          ['address', 'text', 'Address'],
          ['phone', 'tel', 'Phone'],
          ['website', 'url', 'Website'],
          ['instagram', 'text', 'Instagram'],
          ['facebook', 'text', 'Facebook'],
          ['twitter', 'text', 'Twitter'],
          ['coordinates', 'text', 'Coordinates (lng,lat)']
        ].map(([name, type, label]) => (
          <div key={name} className="form-control">
            <label className="label" htmlFor={name}>
              <span className="label-text font-semibold">{label}</span>
            </label>
            <input
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              type={type}
              placeholder={label}
              className="input input-bordered w-full"
            />
          </div>
        ))}

        <div className="form-control">
          <label className="label" htmlFor="description">
            <span className="label-text font-semibold">Description</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Brief description about the NGO"
            className="textarea textarea-bordered w-full"
          />
        </div>

        <button
          type="submit"
          disabled={createNGOLoading}
          className={`btn btn-primary w-full ${createNGOLoading ? 'loading' : ''}`}
        >
          {createNGOLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default UpdateNgoProfile;
