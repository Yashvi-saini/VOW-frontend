import api from "./axiosConfig";

export const createWorkspace = (data) =>
  api.post("workspaces/create", data);

export const joinWorkspace = (inviteCode) =>
  api.post("workspaces/join", { inviteCode });

export const getJoinedWorkspaces = () =>
  api.get("/workspaces/details");

export const rejoinWorkspace = (workspaceId) =>
  api.get(`/workspaces/${workspaceId}/rejoin`);

export const deleteWorkspace = (workspaceId) =>
  api.delete(`/workspaces/${workspaceId}`);

export const getMembers = (workspaceId) =>
  api.get(`/workspaces/${workspaceId}/members`);