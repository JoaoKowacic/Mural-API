import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />}> </Route>
        <Route path="/" element={<Registration />}> </Route>
        <Route path="/dashboard" element = {<Dashboard />}> </Route>
      </Routes>
    </Router>
  );
}

export default App;
