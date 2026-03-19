import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

async function testApi() {
  const key = process.env.GEMINI_API_KEY?.trim();
  console.log("Using key:", key?.substring(0, 5) + "...");
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  
  try {
    const res = await axios.get(url);
    console.log("Models:", JSON.stringify(res.data.models.map((m: any) => m.name), null, 2));
  } catch (err: any) {
    if (err.response) {
      console.error("Error Status:", err.response.status);
      console.error("Error Data:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error("Error:", err.message);
    }
  }
}

testApi();
