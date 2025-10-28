import React from "react";
import desk from "./desk.svg";

const DeskUnit = ({ style = {} }) => {
  return (
    <img
      src={desk}
      alt="desk"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        display: "block",
        ...style,
      }}
    />
  );
};

export default DeskUnit;
