import React, { useState } from 'react';
import axios from 'axios'

export default function Home() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleSendMessage = async () => {
    if (query.trim()) {
      const res = await axios.post("/api/queryResponse",{query});
      console.log(res);
      setResponse(res.data);
    }
  };

  return (
    <>
      <div>
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Type your message here..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <p>{response}</p>
    </>
  );
}