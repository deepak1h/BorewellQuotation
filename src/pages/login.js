import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../image/logo.png"
import "../css/style.css"
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    // Simple validation
    console.log(e)
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("User logged in successfully");
      navigate("/home");
    } catch (error) {
      alert("Invalid Credential");
      console.log(error)
    }

    
  };


  return (
    <div className="formContainer">
      <div className="formWrapper">
        <div className='icon'>
          <img src={Logo} alt="" />
        </div>
        <div className="boddy">
          <span className="title">Login</span>
          <form onSubmit={handleLogin}>
            <input className='question' required type="text" id='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
            <label for="email"><span>What's your email?</span></label>
            <input required type="password" id="password" className='question' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <label for="password"><span>password?</span></label>
            <button handleLogin>Sign in</button>
            <div className='signinbutton'>
            <Link to="/adminlogin">ADMIN</Link>
            <Link to="/register">REGISTER</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;
