import React, { useState, useEffect } from "react";
import fallbackAvatar from "../map assets/avatar1.jpg";

const getDicebearAvatar = (seed) => {
  const cleanSeed = encodeURIComponent((seed || "User").trim());
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${cleanSeed}`;
};

const Avatar = React.memo(({ image, size = 48, name, style }) => {
  const seed = name || "User";
  const isValidCustomImage =
    typeof image === "string" &&
    image.trim() !== "" &&
    !image.includes("avatar1.jpg");

  const avatarUrl = isValidCustomImage ? image : getDicebearAvatar(seed);
  const [src, setSrc] = useState(avatarUrl);

  useEffect(() => {
    const nextUrl = isValidCustomImage ? image : getDicebearAvatar(seed);
    setSrc(nextUrl);
  }, [image, seed, isValidCustomImage]);

  return (
    <div
      className="rounded-full overflow-hidden border-2 border-white shadow-md flex items-center justify-center bg-gray-200 shrink-0"
      style={{ width: size, height: size, ...style }}
      title={name}
    >
      <img
        src={src}
        alt={name || "Avatar"}
        className="w-full h-full object-cover"
        onError={() => {
          if (src !== fallbackAvatar) {
            setSrc(fallbackAvatar);
          }
        }}
      />
    </div>
  );
});

export default Avatar;
