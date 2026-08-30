import { getWorkspaceForUsers } from "../../../api/workspaceApi";

// Resolve or ensure a DM channel between two userIds
// Returns the resolved channelId formatted as dm-peerId
export default async function resolveDirectDMChannel(selfId, peerId) {
  if (!selfId || !peerId) return null;
  try {
    const res = await getWorkspaceForUsers(selfId, peerId);
    const data = res?.data || {};
    const channelId =
      data.channelId ||
      data.channel?._id ||
      data.workspace?.channelId ||
      data.workspaceId ||
      data.workspace?._id ||
      null;
    return channelId ? `dm-${channelId}` : `dm-${peerId}`;
  } catch (e) {
    return `dm-${peerId}`;
  }
}
