import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/dashboard.css' 

const token = localStorage.getItem('token');

function Dashboard() {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  const handleCreateMessage = () => {
    navigate("/messages/new");
  };

  const handleMessage = (messageId) => {
    navigate("/messages/info", {state: {id: messageId}});
  };

  useEffect(() => {
    fetch('http://localhost:3333/message', {
      headers: {
        'Authorization':  `Bearer ${token}`,
      },
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => setMessages(data))
      .catch(error => console.log(error));
  }, []);
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard! Here you can view and manage your messages.</p>
      <div className="messages">
        {messages.map((message) => (
            <div key={message._id} className="message" onClick={() => handleMessage(message._id)}>
                <h2>{message.title}</h2>
                <p>{message.description}</p>
            </div>
        ))}
      </div>
      <button onClick={handleCreateMessage}>Create New Message</button>
    </div>
  );
}

export default Dashboard;