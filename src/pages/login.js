import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "../image/logo.png"
// import "../css/style.css"

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple validation
    console.log(e)
    const email = e.target[0].value;
    const password = e.target[1].value;
    
    if (email === "user@gmail.com" && password === "password") {
      navigate('/home');
    } else {
      alert("Invalid credentials!");
    }
  };


  return (
    <div className="formContainer">
      <div className="formWrapper">
      <div className='icon'>
          <img src={Logo} alt="" />
          <span className="logo">Borewell Motor</span>
        </div>
        <div className="boddy">
          <span className="title">Login</span>
          <form onSubmit={handleLogin}>
            <input required type="email" placeholder="email" />
            <input required type="password" placeholder="password" />
            <button>Sign in</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;
