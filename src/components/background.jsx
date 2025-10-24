import React from "react";
import bgimage from "../assets/bg.svg";

const Background = ({ children, color = "#450B7B", className = "", style = {} }) => {
  const bgStyle = {
    backgroundColor: color,
    backgroundImage: `url(${bgimage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    ...style,
  };

  return (
    <div className={`fixed inset-0 -z-10 w-screen h-screen ${className}`} style={bgStyle}>
  <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_1px_1px,#00000010_1px,transparent_0)] bg-size-[20px_20px]" />
      {children ? <div className="relative z-10">{children}</div> : null}
    </div>
  );
};

export default Background;
