import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../styles/dashboard.css'

const token = localStorage.getItem('token');

const DetailsMessage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const  location  = useLocation(); 
  const navigate = useNavigate()
  const  id  = location.state.id
  const [message, setMessage] = useState(null);
  

  useEffect(() => {
    fetch(`http://localhost:3333/message/${id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
      .then((response) => response.json())
      .then((data) => setMessage(data))
      .catch((error) => console.log(error));
  }, [id]);

  const handleReturn = () => {
    navigate('/dashboard')
  }

  const handleUpdate = () => {
    const changes = {title, description }
    fetch(`http://localhost:3333/message/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify(changes),
    })
      .then((response) => response.json())
      .then((data) =>navigate('/dashboard'))
      .catch((error) => console.log(error));
  };

  const handleDelete = () => {
    fetch(`http://localhost:3333/message/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) =>  navigate('/dashboard'))
      .catch((error) => console.log(error));
  };

  if (!message) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Message {message._id}</h1>
      <p>Title: {message.title}</p>
      <p>Description: {message.description}</p>
      <button onClick={handleReturn} >Return</button>
      <button onClick={handleDelete} >Delete</button>
      <form>
      <label>
            Title:
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <br />
        <label>
            Description:
            <input type="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <br />
        <button type="button" onClick={handleUpdate}>Update</button>
      </form>
    </div>
  );
};

export default DetailsMessage;