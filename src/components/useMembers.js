import { useEffect, useState } from "react";
import { getMembers } from "../api/authApi";

export const useMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);

  const fetchMembers = async () => {
    const workspaceId = localStorage.getItem("workspaceId");
    const workspaceToken = localStorage.getItem("workspaceToken");

    if (!workspaceId || !workspaceToken) {
      alert("Missing workspace credentials");
      return;
    }

    setLoading(true);
    try {
      const response = await getMembers(workspaceId, workspaceToken);
      if (response.data.success) {
        setMembers(response.data.members);
        setShowList(true);
      } else {
        alert("Failed to fetch members");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto-fetch on mount
  useEffect(() => {
    fetchMembers();
  }, []);

 return { members, loading, showList, fetchMembers };

};