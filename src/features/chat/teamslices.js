// actions
export const setTeam = (team) => ({
  type: "SET_TEAM",
  payload: team,
});

export const setTeamsList = (teams) => ({
  type: "SET_TEAMS_LIST",
  payload: teams,
});

export const setSelectedTeamId = (teamId) => ({
  type: "SET_SELECTED_TEAM_ID",
  payload: teamId,
});

// reducer
const initialState = {
  currentTeam: null,      // last created/updated team
  teams: [],              // teams in workspace (team documents)
  selectedTeamId: null,   // selected team for meeting scheduling
  channelTeamMap: {},     // channelId -> teamId mapping for lookups
  channelCreatorMap: {},  // channelId -> creatorId mapping for fallback access
};

export default function teamReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_TEAM":
      return { ...state, currentTeam: action.payload };
    case "SET_TEAMS_LIST":
      return { ...state, teams: action.payload || [] };
    case "SET_SELECTED_TEAM_ID":
      return { ...state, selectedTeamId: action.payload || null };
    case "MAP_CHANNEL_TEAM": {
      const { channelId, teamId } = action.payload || {};
      if (!channelId || !teamId) return state;
      return {
        ...state,
        channelTeamMap: { ...state.channelTeamMap, [channelId]: teamId },
      };
    }
    case "MAP_CHANNEL_CREATOR": {
      const { channelId, creatorId } = action.payload || {};
      if (!channelId || !creatorId) return state;
      return {
        ...state,
        channelCreatorMap: { ...state.channelCreatorMap, [channelId]: creatorId },
      };
    }
    default:
      return state;
  }
}

export const mapChannelTeam = (channelId, teamId) => ({
  type: "MAP_CHANNEL_TEAM",
  payload: { channelId, teamId },
});

export const mapChannelCreator = (channelId, creatorId) => ({
  type: "MAP_CHANNEL_CREATOR",
  payload: { channelId, creatorId },
});