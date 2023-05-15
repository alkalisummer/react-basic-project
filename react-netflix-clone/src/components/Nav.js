import React, { useState, useEffect } from 'react';
import './Nav.css';

function Nav() {
  const [show, setShow] = useState(false);
  
  useEffect(()=>{
    window.addEventListener("scroll", () => {
        if(window.scrollY > 50) {
          setShow(true);    
        } else{
          setShow(false);
        }
    })

    return () => {
      window.removeEventListener("scroll", () => {});
    }
  }, []);

  return (
    <nav className={`nav ${show && "nav__black"}`}>
      <img 
        alt="Neflix logo" 
        src= {process.env.PUBLIC_URL + '/assets/netflix_logo.png'}
        className="nav__logo"
        onClick={()=>window.location.reload()}
      />
      <img
        alt="User logged"
        src={process.env.PUBLIC_URL + '/assets/netflix_profile_icon.png'}
        className="nav__avatar"
      />
        
      
    </nav>
  )
}

export default Nav;