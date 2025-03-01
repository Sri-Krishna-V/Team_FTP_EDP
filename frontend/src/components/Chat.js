import React, { useState } from "react";
import { chatWithAI } from "../api";  // Import API function

const Chat = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (message.trim() === "") return;
    
    setIsLoading(true);
    try {
      const aiResponse = await chatWithAI(message);  // Call API
      setResponse(aiResponse);  // Update UI with AI response
    } catch (error) {
      setResponse("Error connecting to the AI service. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">AI Assistant</h2>
      <textarea 
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-4"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        rows={4}
      />
      <button 
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        onClick={handleSend}
        disabled={isLoading || message.trim() === ""}
      >
        {isLoading ? "Sending..." : "Send"}
      </button>
      
      {response && (
        <div className="mt-6">
          <h3 className="font-medium text-gray-700 mb-2">Response:</h3>
          <div className="bg-gray-100 p-4 rounded-md">
            {response}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;