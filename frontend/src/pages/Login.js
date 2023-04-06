import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/styles.css';

function Login() {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    const credentials = { email, password };
    fetch('http://localhost:3333/login', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(credentials)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then(data => {
        localStorage.setItem('token', data.token);
        navigate('/dashboard', {
            token: data.token
        });
      })
      .catch(error => console.log(error));
  };
  return (
    <div>
        <h1>Login Page</h1>
        <form >
            <label>
                Email:
                <input type="text" value={email} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <br />
            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <br />
            <button type="button" onClick={handleSubmit}>Login</button>
        </form>
    </div>
  );
}

export default Login;