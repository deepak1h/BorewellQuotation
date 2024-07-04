import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import Adminlogin from './pages/adminlogin';
import AdminHome from './pages/adminhome';
import Register from './pages/register';
import { AuthProvider, useAuth } from "./AuthContext";
import PrivateRoute from "./PrivateRoute"; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/adminlogin" element={<Adminlogin />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/adminhome" element={<PrivateRoute><AdminHome /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
