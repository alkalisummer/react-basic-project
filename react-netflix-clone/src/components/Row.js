import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import "./Row.css";
import MovieModal from './MovieModal/MovieModal';
import MiniModal from './MovieModal/MiniModal';
import fetchMovie from '../api/fetchMovie';

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
    const handler = setTimeout( async ()=>{
      if(miniModalMovieId && !modalOpen){
        const movieDetails = await fetchMovie(miniModalMovieId, id);
        setMovieSelected(movieDetails.data);
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
    const movieDetails = await fetchMovie(movie.id, id);
    setMovieSelected(movieDetails.data);
    setModalOpen(true); 
  };

  const handleMouseEnter = (movie, overYn, event) => {
    setMiniModalMovieId(movie.id);
    setMiniModalOpenTrigger(overYn);
    setModalTop(event.currentTarget.offsetTop);
    setModalLeft(event.currentTarget.offsetLeft - document.getElementById(id).scrollLeft);
  };

  const handleMouseLeave = (overYn) => {
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
              onMouseEnter={(e) => handleMouseEnter(obj, true, e)}
              onMouseLeave={() => handleMouseLeave(false)}
            />
          ))}
          {
            miniModalOpen && <MiniModal {...movieSelected}
                                        miniModalOpen={miniModalOpen}
                                        setMiniModalOpen={setMiniModalOpen} 
                                        setMiniModalMovieId={setMiniModalMovieId} 
                                        setBigModalOpen={handleClick}
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