import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../image/logo.png"
import "../css/style.css"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

function Register(){

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    // Simple validation
    console.log(e)

    try{
        const result = await createUserWithEmailAndPassword(auth, email, password)

        await updateProfile(result?.user, {
            displayName: name,
          })
          alert("User registered successfully");
          navigate("/")
    }
    catch(error){
      console.log("lol")
        alert("Error registering user:", error);
    }

  };


  return (
    <div className="formContainer">
      <div className="formWrapper">
        <div className='icon'>
          <img src={Logo} alt="" />
        </div>
        <div className="boddy">
          <span className="title">Register</span>
          <form onSubmit={handleRegister}>
            <input className='question' required type="text" id='name' value={name} onChange={(e) => setName(e.target.value)}/>
            <label for="name"><span>Name</span></label>
            <input className='question' required type="text" id='email' value={email}
        onChange={(e) => setEmail(e.target.value)}
/>
            <label for="email"><span>email</span></label>
            <input required type="password" id="password" className='question' value={password}
        onChange={(e) => setPassword(e.target.value)}/>
            <label for="password"><span>password</span></label>
            <div className='signinbutton'>
            <button onClick={handleRegister}>Register</button>
            <Link to="/">LOGIN</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register;
