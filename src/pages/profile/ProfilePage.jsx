import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileForm from "../../components/profilegeneration/profileform";
import ProfileCard from "../../components/profilegeneration/profilecard";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const handleFormSubmit = (data) => {
    setProfile(data);
    navigate("/dashboard");
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

export default ProfilePage;




