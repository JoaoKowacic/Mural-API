import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const token = localStorage.getItem('token');

const NewMessage = () => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };
    const handleSubmit = (event) => {
        const data = { 
            title:title,  
            description:message
        };
        fetch('http://localhost:3333/message', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization':  `Bearer ${token}`
            },
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error creating message');
            }
            return response.json();
        })
        .then(data => {
            alert('Message created successfully!');
            
            setMessage('');
            
        })
        .catch(error => {
            console.log(error);
            alert(error.message);
        });
    navigate('/dashboard');
  }

  return (
    <div>
      <h1>Create New Message</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="titleInput">Title:</label>
          <input
            type="text"
            id="titleInput"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <label htmlFor="messageInput">Message:</label>
          <textarea
            id="messageInput"
            value={message}
            onChange={handleMessageChange}
          />
        </div>
        <button type="submit">Create Message</button>
      </form>
    </div>
  );
};

export default NewMessage;