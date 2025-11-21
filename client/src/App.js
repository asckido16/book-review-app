import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookList from "./pages/BookList";
import BookDetail from "./pages/BookDetail";
import Dashboard from "./pages/Dashboard";
import AddBook from "./pages/AddBook";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="App min-vh-100 bg-light">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="container-fluid">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/register"
            element={<Register onLogin={handleLogin} />}
          />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/:id" element={<BookDetail user={user} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/add-book" element={<AddBook user={user} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
