import api from "./axiosConfig";

export async function createLayout(payload) {
  return api.post("/maps", payload);
}
