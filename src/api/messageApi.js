import api from "./axiosConfig";

export const sendMessageToChannel = (channelId, content, attachments = []) => {
  return api.post("/messages", {
    channelId,
    content,
    attachments,
  });
};

export const fetchChannelMessages = (channelId) => {
  return api.get(`/messages/channel/${channelId}`);
};

export const deleteChannelMessage = (messageId) => {
  return api.delete(`/messages/message/${messageId}`);
};

export const getDirectMessages = (workspaceId, user1, user2, params = {}) => {
  const query = new URLSearchParams(params).toString();

  return api.get(
    `/dm/${workspaceId}/${user1}/${user2}${query ? `?${query}` : ""}`
  );
};

export const deleteDirectMessage = (messageId) => {
  return api.delete(`/dm/${messageId}`);
};