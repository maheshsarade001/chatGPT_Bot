import axios from "axios";
const API = process.env.NEXT_PUBLIC_API || "https://api.openai.com/v1";

const apiKey = process.env.NEXT_PUBLIC_APIKEY;

const AxiosInstance = axios.create({
  baseURL: API,
  headers: {
    Authorization: `Bearer ${apiKey}`,
  },
});

export default AxiosInstance;
