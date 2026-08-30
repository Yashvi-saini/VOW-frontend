import api from "./axiosConfig";

export const createChannel = (data) =>
  api.post("/channels", data);

export const renameChannel = (channelId, name) =>
  api.put(`/channels/${channelId}`, { name });

export const getChannels = (workspaceId) =>
  api.get(`/channels/workspace/${workspaceId}`);