import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";  // FastAPI backend URL

// Function to Send Message to Backend
export const chatWithAI = async (message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat`, { message });
    return response.data.response;  // Extract AI response from JSON
  } catch (error) {
    console.error("Error connecting to backend:", error);
    return "Error processing your request.";
  }
};