import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import "./Row.css";
import MovieModal from './MovieModal/index';

function Row({ isLargeRow, title, id, fetchUrl }) {
  
  const [movies, setMovies] = useState([]);
  const [movie, setMovie] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [movieSelected, setMovieSelected] = useState({});
  
  useEffect(()=>{
    fetchMovieData();  
  }, []);

  // 포스터에 onmouse 이벤트 무분별한 api 호출을 방지 
  useEffect(()=>{
    if(movie && Object.keys(movie).length !== 0){
      const handler = setTimeout(()=>{
        handleMouseOver(movie);    
      }, 1000); 

      return () => {
        // delay로 정해둔 시간안에 새로운 value가 들어오면 기존 handler의 delay 초기화
        clearTimeout(handler);
      }
    }
  }, [movie]);

  const fetchMovieData = async () => {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
  };

  const handleClick = async (movie) => {
    const movieDetails = await axios.get(id === 'TV' ? 'tv/'+movie.id : 'movie/'+movie.id);
    setModalOpen(true); 
    setMovieSelected(movieDetails.data);
  };

  const handleMouseOver = async (movie) => {
    const movieDetails = await axios.get(id === 'TV' ? 'tv/'+movie.id : 'movie/'+movie.id);
    console.log(movieDetails);
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
              className={`row__poster ${isLargeRow && "row__posterLarge"}`}
              src={`https://image.tmdb.org/t/p/original/${isLargeRow ? obj.poster_path : obj.backdrop_path}`}
              alt={obj.name}
              onClick={()=> handleClick(obj)}
              onMouseOver={() => setMovie(obj)}
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
    </section>
  )
}

export default Row;