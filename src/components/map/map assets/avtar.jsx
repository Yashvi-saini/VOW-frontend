import React from "react";
import avtar from "../assets/avatar1.jpg"
const Avatar = React.memo(({ image, size = 48, name, style }) => {
  return (
    <div
      className="rounded-full overflow-hidden border-2 border-white shadow-md flex items-center justify-center bg-gray-200"
      style={{ width: size, height: size, ...style }}
      title={name}
    >
      <img
        src={avtar}
        alt={name || "Avatar"}
        className="w-full h-full object-cover"
      />
    </div>
  );
});

export default Avatar;
