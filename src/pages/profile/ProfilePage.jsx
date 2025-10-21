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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {!profile ? (
        <div className="flex flex-col w-full max-w-4xl justify-center items-start">
          <ProfileForm onSubmit={handleFormSubmit} />
        </div>
      ) : (
        <ProfileCard profile={profile} />
      )}
    </div>
  );
};

export default ProfilePage;




