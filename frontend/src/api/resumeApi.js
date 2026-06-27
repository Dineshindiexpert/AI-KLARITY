import api from "./axios";

export const uploadResume = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/resumes/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return response.data;
};

export const analyzeResume = async (resumeId) => {
  const response = await api.get(
    `/resumes/analyze/${resumeId}`
  );

  return response.data;
};


export const getResume = async () => {
  const res = await api.get("/resumes/");
  return res.data;
};
