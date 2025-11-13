import { getWorkspaceForUsers } from "../../../api/authApi";

// Resolve or ensure a DM channel between two userIds
// Returns the resolved channelId or a synthetic fallback (sorted pair)
export default async function resolveDirectDMChannel(selfId, peerId) {
  if (!selfId || !peerId) return null;
  try {
    const res = await getWorkspaceForUsers(selfId, peerId);
    const data = res?.data || {};
    const channelId = data.channelId
      || data.channel?._id
      || data.workspace?.channelId
      || data.workspaceId
      || data.workspace?._id
      || null;
    return channelId || [selfId, peerId].sort().join('-');
  } catch (e) {
    return [selfId, peerId].sort().join('-');
  }
}
