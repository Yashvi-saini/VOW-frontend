import React from "react";

const defaultAvatars = {
  male: "/avatars/default-male.png",
  female: "/avatars/default-female.png",
  other: "/avatars/default-other.png",
};

const ProfileCard = ({ profile }) => {
  if (!profile) return null;

  const genderKey = profile.gender?.toLowerCase() || "other";

  // Prefer backend avatar URL if available, otherwise fallback
  const avatarSrc = profile.avatar?.trim()
    ? profile.avatar
    : defaultAvatars[genderKey] || defaultAvatars.other;

  return (
    <div className="max-w-sm mx-auto bg-white p-6 rounded-2xl shadow-md mt-6 text-center">
      <img
        src={avatarSrc}
        alt={`${profile.fullName}'s Avatar`}
        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-indigo-500 object-cover"
        onError={(e) => {
          // fallback in case backend URL is broken
          e.target.src = defaultAvatars[genderKey];
        }}
      />

      <h2 className="text-xl font-semibold text-gray-800">{profile.fullName}</h2>
      <p className="text-gray-500 text-sm mb-2">{profile.organisation}</p>

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


