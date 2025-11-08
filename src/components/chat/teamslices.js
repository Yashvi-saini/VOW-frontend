// actions
export const setTeam = (team) => ({
  type: "SET_TEAM",
  payload: team,
});

// reducer
const initialState = {
  currentTeam: null,
};

export default function teamReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_TEAM":
      return { ...state, currentTeam: action.payload };
    default:
      return state;
  }
}