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
  teams: [],              // teams in workspace
  selectedTeamId: null,   // selected team for meeting scheduling
};

export default function teamReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_TEAM":
      return { ...state, currentTeam: action.payload };
    case "SET_TEAMS_LIST":
      return { ...state, teams: action.payload || [] };
    case "SET_SELECTED_TEAM_ID":
      return { ...state, selectedTeamId: action.payload || null };
    default:
      return state;
  }
}