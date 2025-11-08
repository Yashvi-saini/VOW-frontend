import api from "./axiosConfig";

// Create or update a layout
export async function createLayout(payload) {
  // payload shape: { name, layoutUrl, rooms: [id], metadata }
  return api.post("/maps", payload);
}
