import React, { useState, useEffect } from "react";
import fallbackAvatar from "../map assets/avatar1.jpg";

const isCustomUploadedImage = (url) => {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed === "" ||
    trimmed.includes("avatar1") ||
    trimmed.includes("/avatars/") ||
    trimmed.includes("/assets/") ||
    trimmed.includes("default")
  ) {
    return false;
  }
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  );
};

const getDicebearAvatar = (seed) => {
  const cleanSeed = encodeURIComponent((seed || "Player").trim());
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${cleanSeed}`;
};

const Avatar = React.memo(({ image, size = 48, name, userId, style }) => {
  let seed = userId;
  if (!seed && name && name.toLowerCase() !== "you" && name.toLowerCase() !== "user") {
    seed = name;
  }
  if (!seed) {
    seed = name || "Player";
  }

  const hasCustomUpload = isCustomUploadedImage(image);
  const avatarUrl = hasCustomUpload ? image : getDicebearAvatar(seed);
  const [src, setSrc] = useState(avatarUrl);

  useEffect(() => {
    const nextUrl = isCustomUploadedImage(image) ? image : getDicebearAvatar(seed);
    setSrc(nextUrl);
  }, [image, seed]);

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

