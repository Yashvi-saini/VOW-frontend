import api from "./axiosConfig";

export const createTeam = (workspaceId, payload) =>
  api.post(`/manager/team/create/${workspaceId}`, payload);

export const getTeams = (workspaceId) =>
  api.get(`/manager/team/all/${workspaceId}`);

export const assignTeamLead = (workspaceId, teamId, leadId) =>
  api.put(
    `/manager/team/assign-lead/${workspaceId}/${teamId}`,
    { leadId }
  );

export const renameTeam = (workspaceId, teamId, newName) =>
  api.put(
    `/manager/team/rename/${workspaceId}/${teamId}`,
    { newName }
  );