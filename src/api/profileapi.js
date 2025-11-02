import api from "./axiosConfig";
export const 
createProfile = (formData) => {
  return api.post("me/updateprofile",formData);
}
export const getProfileInfo = () => {
  return api.get("me/info");
};