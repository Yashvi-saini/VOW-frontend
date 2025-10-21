import React from "react";

const ProfileCard = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="max-w-sm mx-auto bg-white p-6 rounded-2xl shadow-md mt-6 text-center">
      <img
        src={profile.avatar || "/avatars/default.png"}
        alt="Profile Avatar"
        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-indigo-500 object-cover"
      />
      <h2 className="text-xl font-semibold text-gray-800">{profile.fullName}</h2>
      <p className="text-gray-500 text-sm mb-2">{profile.organization}</p>

      <div className="text-gray-600 text-sm space-y-1">
        <p>
          <span className="font-medium text-gray-700">Gender:</span> {profile.gender}
        </p>
        <p>
          <span className="font-medium text-gray-700">DOB:</span> {profile.dob}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;

