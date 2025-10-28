import React, { useState } from "react";
import { createProfile } from "../../api/profileapi"; 

const ProfileForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    organisation: "",
    dob: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.gender || !formData.organisation || !formData.dob) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      setLoading(true);
      const response = await createProfile(formData); 
      if (response.success) {
        onSubmit(response.data);
      } else {
        alert("Failed to save profile. Please try again.");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      {!profile ? (
       
          <ProfileForm onSubmit={handleFormSubmit} />
        
      ) : (
        <ProfileCard profile={profile} />
      )}
    </div>
  );
};

export default ProfileForm;




