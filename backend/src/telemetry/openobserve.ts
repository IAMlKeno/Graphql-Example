import axios from "axios";
// import { Axios as axios } from "axios";

export async function sendToOpenObserve(log) {
  try {
    await axios.post(process.env.OO_ENDPOINT, log, {
      headers: {
        Authorization: process.env.OO_AUTH,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Failed to send log", err.message);
  }
}