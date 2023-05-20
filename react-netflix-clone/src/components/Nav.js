import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Nav.css';


function Nav() {
  const [show, setShow] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  
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

  const handleChange = (e) => {
    setSearchValue(e.target.value);
    navigate(`/search?q=${e.target.value}`);
  }

  return (
    <nav className={`nav ${show && "nav__black"}`}>
      <img 
        alt="Neflix logo" 
        src= {process.env.PUBLIC_URL + '/assets/netflix_logo.png'}
        className="nav__logo"
        onClick={()=>window.location.reload()}
      />
      <input value={searchValue} onChange={handleChange} className="nav__input" type="text" placeholder="영화명, TV 프로그램명" />
      <img
        alt="User logged"
        src={process.env.PUBLIC_URL + '/assets/netflix_profile_icon.png'}
        className="nav__avatar"
      />
    </nav>
  )
}

export default Nav;