import api from "./axios";

/* ------------------------
   START INTERVIEW
-------------------------*/
export const startInterview = async (data) => {
  const res = await api.post("/interview/start", data);
  return res.data;
};


/* ------------------------
   NEXT QUESTION + SAVE ANSWER
   backend -> /interview/next
-------------------------*/
export const nextQuestion = async (data) => {
  const res = await api.post("/interview/next", data);
  return res.data;
};


/* ------------------------
   FINISH INTERVIEW
-------------------------*/
export const finishInterview = async (data) => {
  const res = await api.post("/interview/finish", data);
  return res.data;
};


 
/* ------------------------
   FINAL REPORT (COMPLETELY SYNCHRONIZED)
-------------------------*/
export const getLatestReport = async () => {
  try {
    // सीधे फिक्स एंडपॉइंट पर हिट मारो, टोकन अपने आप यूजर पहचान लेगा
    const res = await api.get("/interview/latest-report");
    return res.data;
  } catch (error) {
    console.error("[AXIOS ERROR] Failed to fetch latest report:", error);
    return null;
  }
};




/* ------------------------
   DASHBOARD ANALYTICS (NEW SAAS ROUTE)
-------------------------*/
export const getDashboardAnalytics = async () => {
  const res = await api.get("/interview/dashboard/analytics");
  return res.data;
};