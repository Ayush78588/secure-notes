import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});


API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  console.log(token,123);
  
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// OTP login
export const sendOtp = (email) => API.post("/auth/otp/start", { email });
export const loginWithOtp = (email, otp) =>
  API.post("/auth/otp/verify", { email, otp });

// Google login
export const loginWithGoogle = (token) =>
  API.post("/auth/google", { token });

// Notes
export const getNotes = () => API.get("/notes");
export const createNote = ({ title, body }) =>
  API.post("/notes", { title, body });

export const deleteNote = (id) => API.delete(`/notes/${id}`);

export default API;
