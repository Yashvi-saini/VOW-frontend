import api from "./axiosConfig";

// Send message to channel
export const sendMessageToChannel = (channelId, content, attachments = []) => {
  return api.post(`/messages`, {
    channelId,
    content,
    attachments,
  });
};

// Fetch channel messages
export const fetchChannelMessages = (channelId) => {
  return api.get(`/messages/channel/${channelId}`);
};

// Delete channel message
export const deleteChannelMessage = (messageId) => {
  return api.delete(`/messages/message/${messageId}`);
};

// Get direct messages
export const getDirectMessages = (workspaceId, user1, user2, params = {}) => {
  const query = new URLSearchParams(params).toString();

  return api.get(
    `/dm/${workspaceId}/${user1}/${user2}${query ? `?${query}` : ""}`
  );
};

// Delete direct message
export const deleteDirectMessage = (messageId) => {
  return api.delete(`/dm/${messageId}`);
};