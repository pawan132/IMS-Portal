// utils.js
import axios from "axios";
import UAParser from "ua-parser-js";

export const getIpAddress = async () => {
  try {
    const response = await axios.get("/api/ipinfo/json?token=d680a4c575ece6");
    return response.data.ip;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return null;
  }
};

export const getBrowserInfo = () => {
  const parser = new UAParser();
  const browserInfo = parser.getResult();
  return browserInfo.ua;
};
