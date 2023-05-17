import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import "./Row.css";

function Row({ isLargeRow, title, id, fetchUrl }) {
  
  const [movies, setMovies] = useState([]);
  
  useEffect(()=>{
    fetchMovieData();  

  }, []);

  const fetchMovieData = async () => {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
  }

  return (
    <section className="row">
      <h2>{title}</h2>
      <div className="slider">
        <div className="slider__arrow-left">
          <span className="arrow">{"<"}</span>
        </div>
        <div id={id} className="row__posters">
          {movies.map(obj=>(
            <img 
              key = {obj.id}
              className={`row__poster ${isLargeRow && "row__posterLarge"}`}
              src={`https://image.tmdb.org/t/p/original/${isLargeRow ? obj.poster_path : obj.backdrop_path}`}
              alt={obj.name}
            />
          ))}
        </div>
        <div className="slider__arrow-right">
          <span className="arrow">{">"}</span>
        </div>
      </div>
    </section>
  )
}

export default Row;