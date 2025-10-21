import React, { useState } from "react";

// Avatar lists per gender
const maleAvatars = [
  { id: 1, src: "/avatars/male/avatar1.png" },
  { id: 2, src: "/avatars/male/avatar2.png" },
  { id: 3, src: "/avatars/male/avatar3.png" },
];

const femaleAvatars = [
  { id: 1, src: "/avatars/female/avatar1.png" },
  { id: 2, src: "/avatars/female/avatar2.png" },
  { id: 3, src: "/avatars/female/avatar3.png" },
];

const otherAvatars = [
  { id: 1, src: "/avatars/other/avatar1.png" },
  { id: 2, src: "/avatars/other/avatar2.png" },
  { id: 3, src: "/avatars/other/avatar3.png" },
];

const AvatarSelector = ({ onSelect, gender }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  let avatars = [];
  if (gender === "Male") avatars = maleAvatars;
  else if (gender === "Female") avatars = femaleAvatars;
  else if (gender === "Other") avatars = otherAvatars;

  const handleSelect = (avatar) => {
    setSelectedAvatar(avatar.id);
    if (onSelect) onSelect(avatar.src);
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Choose Your Avatar
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-items-center">
        {avatars.map((avatar) => (
          <div
            key={avatar.id}
            onClick={() => handleSelect(avatar)}
            className={`cursor-pointer rounded-full border-4 ${
              selectedAvatar === avatar.id ? "border-indigo-600" : "border-transparent"
            } transition duration-200`}
          >
            <img
              src={avatar.src}
              alt={`Avatar ${avatar.id}`}
              className="rounded-full w-20 h-20 object-cover"
            />
          </div>
        ))}
      </div>
      {selectedAvatar && (
        <p className="mt-4 text-center text-sm text-gray-600">
          Selected Avatar #{selectedAvatar}
        </p>
      )}
    </div>
  );
};

export default AvatarSelector;

