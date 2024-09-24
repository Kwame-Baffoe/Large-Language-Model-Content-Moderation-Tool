import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [flaggedContent, setFlaggedContent] = useState([]);
  const [message, setMessage] = useState('');
  const [inputContent, setInputContent] = useState('');

  // Fetch flagged content on component mount
  useEffect(() => {
    const fetchFlaggedContent = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/flagged');
        setFlaggedContent(response.data);
      } catch (error) {
        console.error("Error fetching flagged content:", error);
      }
    };
    fetchFlaggedContent();
  }, []);

  const handleModerate = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/moderate', { content: inputContent });
      setMessage(`Prediction: ${response.data.prediction}`);
    } catch (error) {
      console.error("Error moderating content:", error);
    }
  };

  const handleApprove = async (id) => {
    await axios.post(`http://localhost:5000/api/approve/${id}`);
    setFlaggedContent(flaggedContent.filter(item => item.id !== id));
    setMessage('Content approved.');
  };

  const handleReject = async (id) => {
    await axios.post(`http://localhost:5000/api/reject/${id}`);
    setFlaggedContent(flaggedContent.filter(item => item.id !== id));
    setMessage('Content rejected.');
  };

  return (
    <div>
      <h1>Moderation Dashboard</h1>
      <input
        type="text"
        placeholder="Enter text to moderate"
        value={inputContent}
        onChange={(e) => setInputContent(e.target.value)}
      />
      <button onClick={handleModerate}>Moderate Content</button>
      {message && <p>{message}</p>}
      <ul>
        {flaggedContent.map(item => (
          <li key={item.id}>
            {item.text}
            <button onClick={() => handleApprove(item.id)}>Approve</button>
            <button onClick={() => handleReject(item.id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;