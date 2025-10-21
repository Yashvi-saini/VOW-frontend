
import React, { useState } from "react";
import AvatarSelector from "./avatarselector"; 

const ProfileForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    organization: "",
    dob: "",
    avatar: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (selectedAvatar) => {
    setFormData((prev) => ({ ...prev, avatar: selectedAvatar }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.gender ||
      !formData.organization ||
      !formData.dob
    ) {
      alert("Please fill in all fields!");
      return;
    }

    if (!formData.avatar) {
      alert("Please select an avatar!");
      return;
    }

    if (onSubmit) onSubmit(formData);
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        Complete Your Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
      
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <div className="flex gap-6">
            {["Male", "Female", "Other"].map((g) => (
              <label key={g} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={formData.gender === g}
                  onChange={handleChange}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700">{g}</span>
              </label>
            ))}
          </div>
        </div>

       
        {formData.gender && (
          <div className="mt-4 transition-all duration-300">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Choose Your Avatar
            </h3>
            <AvatarSelector
              gender={formData.gender}
              onSelect={handleAvatarSelect}
            />
          </div>
        )}

       
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization
          </label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            placeholder="Enter your organization name"
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

       
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;


