import api from "./axiosConfig";
export const 
createProfile = (formData) => {
  return api.post("me/updateprofile",formData);
}
export const getProfileInfo = () => {
  return api.get("me/info");
}
export const uploadProfilePhoto =(file)=>{
  const formData = new FormData();
  formData.append("avatar",file);
  return api.post("me/uploadprofile",formData,{
    headers:{
      "content-type": "multipart//form-data",
    },
  });
}