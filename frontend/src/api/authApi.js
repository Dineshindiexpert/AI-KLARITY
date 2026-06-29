import api from "./axios";

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};


export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/users/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};



 
export const resetuser = async (data) =>{
  const response = await api.post("/change-password",data);
  return response.data;
}