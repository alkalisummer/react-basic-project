import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommonStateContext } from '../App';
import './Nav.css';


function Nav() {
  const [show, setShow] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { setIsClicked } = useContext(CommonStateContext);
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

  const goIndex = () => {
    setSearchValue("");
    setIsClicked(false);
    navigate("/");
  }

  return (
    <nav className={`nav ${show && "nav__black"}`}>
      <img 
        alt="Neflix logo" 
        src= {process.env.PUBLIC_URL + '/assets/netflix_logo.png'}
        className="nav__logo"
        onClick={()=>goIndex()}
      />
      <div className="nav__right">
      <input value={searchValue} onChange={handleChange} className="nav__input" type="text" placeholder="영화명, TV 프로그램명" />
      <img
        alt="User logged"
        src={process.env.PUBLIC_URL + '/assets/netflix_profile_icon.png'}
        className="nav__avatar"
      />
      </div>
    </nav>
  )
}

export default React.memo(Nav);