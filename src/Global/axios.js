import axios from "axios";

const language = localStorage.getItem("language") || "en";
const instance = axios.create({
  baseURL: "https://sla.torcdeveloper.com/api/v1",
  headers: {
    "Content-type": "application/json",
    "X-localization": language,
    Accept: "application/json",
  },
});

export default instance;
