import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import "./Row.css";
import MovieModal from './MovieModal/MovieModal';
import MiniModal from './MovieModal/MiniModal';

function Row({ isLargeRow, title, id, fetchUrl }) {
  
  const [movies, setMovies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [miniModalOpen, setMiniModalOpen] = useState(false);
  const [miniModalOpenTrigger, setMiniModalOpenTrigger] = useState(false);
  const [movieSelected, setMovieSelected] = useState({});
  const [miniModalMovieId, setMiniModalMovieId] = useState("");
  const [modalTop, setModalTop] = useState(0);
  const [modalLeft, setModalLeft] = useState(0);

  useEffect(()=>{
    fetchMovieData();
  }, []);

  useEffect(()=>{
    const handler = setTimeout(()=>{
      if(miniModalMovieId){
        setMiniModalOpen(miniModalOpenTrigger);
      }
    }, 1000);

    return () => {
      clearTimeout(handler);
    }
  }, [miniModalOpenTrigger, miniModalMovieId])

  const fetchMovieData = async () => {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
  };

  const handleClick = async (movie) => {
    const movieDetails = await axios.get(id === 'TV' ? 'tv/'+movie.id : 'movie/'+movie.id);
    setModalOpen(true); 
    setMovieSelected(movieDetails.data);
  };

  const handleMouseOver = (movie, overYn, event) => {
      setMiniModalMovieId(movie.id);
      setMiniModalOpenTrigger(overYn);
      setModalTop(event.currentTarget.offsetTop);
      setModalLeft(event.currentTarget.offsetLeft - document.getElementById(id).scrollLeft);
  };

  const handleMouseOut = (overYn) => {
    if(!miniModalOpen){
      setMiniModalOpenTrigger(overYn);
    }
  }

  return (
    <section className="row">
      <h2>{title}</h2>
      <div className="slider">
        <div className="slider__arrow-left" 
             onClick={() => {
               document.getElementById(id).scrollLeft -= window.innerWidth - 80;
             }}>
          <span className="arrow">{"<"}</span>
        </div>
        <div id={id} className="row__posters">
          {movies.map(obj=>(
            <img 
              key = {obj.id}
              id = {obj.id}
              className={`row__poster ${isLargeRow && "row__posterLarge"}`}
              src={`https://image.tmdb.org/t/p/original/${isLargeRow ? obj.poster_path : obj.backdrop_path}`}
              alt={obj.name}
              onClick={()=> handleClick(obj)}
              onMouseOver={(e) => handleMouseOver(obj, true, e)}
              onMouseLeave={() => handleMouseOut(false)}
            />
          ))}
          {
            miniModalOpen && <MiniModal movieId={miniModalMovieId} 
                                        setMiniModalOpen={setMiniModalOpen} 
                                        setMiniModalMovieId={setMiniModalMovieId} 
                                        setModalOpen={handleClick}
                                        categoryId={id} 
                                        modalTop={modalTop}
                                        modalLeft={modalLeft}
                                        />
          }
        </div>
        <div className="slider__arrow-right" 
             onClick={() => {
               document.getElementById(id).scrollLeft += window.innerWidth - 80;
             }}>
          <span className="arrow">{">"}</span>
        </div>
      </div>
      {
        modalOpen && <MovieModal {...movieSelected} setModalOpen={setModalOpen} categoryId={id}/>
      }

    </section>
  )
}

export default React.memo(Row);