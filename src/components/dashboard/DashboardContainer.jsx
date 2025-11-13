import React, { useEffect, useState } from "react";
import DashboardMain from "../dashboard/DashboardMain";
import DashboardNewUser from "./DashboardNewUser";

const DashboardContainer = () => {
  const [isNewUser, setIsNewUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.isNewUser === true) {
      setIsNewUser(true);
    } else {
      setIsNewUser(false);
    }
  }, []);

  if (isNewUser === null) {
    return <div className="text-center mt-20 text-lg">Loading dashboard...</div>;
  }

  return isNewUser ? <DashboardNewUser /> : <DashboardMain />;
};

export default DashboardContainer;
