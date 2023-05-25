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
  
  useEffect(()=>{
    fetchMovieData();
  }, []);

  useEffect(()=>{
    setMiniModalOpen(miniModalOpenTrigger);    
  }, [miniModalOpenTrigger])

  const fetchMovieData = async () => {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
  };

  const handleClick = async (movie) => {
    const movieDetails = await axios.get(id === 'TV' ? 'tv/'+movie.id : 'movie/'+movie.id);
    setModalOpen(true); 
    setMovieSelected(movieDetails.data);
  };

  const handleMouseOver = (movie) => {
    setMiniModalMovieId(movie.id);
    setMiniModalOpenTrigger(true);
    
  };

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
              className={`row__poster ${isLargeRow && "row__posterLarge"}`}
              src={`https://image.tmdb.org/t/p/original/${isLargeRow ? obj.poster_path : obj.backdrop_path}`}
              alt={obj.name}
              onClick={()=> handleClick(obj)}
              onMouseOver={() => handleMouseOver(obj)}
            />
          ))}
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
      {
        miniModalOpen && <MiniModal movieId={miniModalMovieId} setMiniModalOpen={setMiniModalOpen} categoryId={id} setMiniModalOpenTrigger={setMiniModalOpenTrigger} />
      }

    </section>
  )
}

export default React.memo(Row);