import React from 'react'
import Main from '../components/main'
import { useNavigate } from 'react-router-dom';

// import "../css/home.css"

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };
  return (
    <div className='home'>
      <div className="container">
        <Main/>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  )
}

export default Home