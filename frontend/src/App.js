import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewMessage from "./pages/NewMessages";
import DetailsMessage from "./pages/DetailsMessages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />}> </Route>
        <Route path="/" element={<Registration />}> </Route>
        <Route path="/dashboard" element = {<Dashboard />}></Route>
        <Route path="/messages/new" element = {<NewMessage />}></Route>
        <Route path="/messages/info" element = {<DetailsMessage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
