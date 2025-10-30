import React, { useState } from "react";
import ProfileForm from "../../components/profilegeneration/profileform";
import ProfileCard from "../../components/profilegeneration/profilecard";
import Background from "../../components/background";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const handleProfileSubmit = (data) => {
    setProfile(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <Background className=" absolute inset-0 z-0" />
      <div className="relative z-10 w-[80%] max-w-lg">
      {!profile ? (
        <ProfileForm onSubmit={handleProfileSubmit} />
      ) : (
        <ProfileCard profile={profile} />
      )}
      </div>
    </div>
  );
};

export default ProfilePage;




