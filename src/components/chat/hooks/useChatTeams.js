import { useState, useEffect } from "react";
import { getTeams } from "../../../api/teamApi";

export const useChatTeams = (workspaceId) => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeamsData = async () => {
      if (!workspaceId) return;

      try {
        const response = await getTeams(workspaceId);
        setTeams(response?.data?.teams || response?.data || []);
      } catch (err) {
        console.error("Failed to fetch teams:", err);
      }
    };

    fetchTeamsData();
  }, [workspaceId]);

  return { teams };
};