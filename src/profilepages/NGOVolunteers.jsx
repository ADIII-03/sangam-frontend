// src/pages/NGOVolunteers.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";

const NGOVolunteers = () => {
  const { id } = useParams(); // NGO ID
  const [volunteers, setVolunteers] = useState([]);
  const [ngoName, setNgoName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        // 1. Get NGO name
        const ngoRes = await axiosInstance.get(`/ngo/${id}`);
        setNgoName(ngoRes.data.ngo?.name || "NGO");

        // 2. Get populated volunteer list
        const volRes = await axiosInstance.get(`/ngo/${id}/get-volunteers`);
        setVolunteers(volRes.data.volunteers || []);
      } catch (err) {
        console.error("Error fetching volunteers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, [id]);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading volunteers...</p>;



  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">{ngoName}'s Volunteers</h2>

      {volunteers.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {volunteers.map((vol) => (
            <Link
              key={vol._id}
              to={`/user/${vol._id}`}
              className="p-4 border rounded-md hover:shadow transition text-center hover:bg-gray-800 "
            >
              <img
                src={vol.profilepic}
                alt={vol.name}
                className="w-16 h-16 mx-auto rounded-full object-cover mb-2"
              />
              <p className="text-sm font-medium text-white">{vol.name}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No volunteers found.</p>
      )}
    </div>
  );
};

export default NGOVolunteers;
