import { useEffect, useState } from "react";
import { getMembers } from "../api/authApi";

// Fetch members for a given workspace using the scoped workspace token
export const useMembers = (workspaceId) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!workspaceId) {
        throw new Error("Missing workspaceId");
      }
      const response = await getMembers(workspaceId);
      if (response.data?.success) {
        setMembers(response.data.members || []);
      } else {
        throw new Error(response.data?.message || "Failed to fetch members");
      }
    } catch (err) {
      console.error("Error fetching members:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // refetch when workspaceId changes
    if (workspaceId) fetchMembers();
  }, [workspaceId]);

  return { members, loading, error, refetch: fetchMembers };
};