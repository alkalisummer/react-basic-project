import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import "./MiniModal.css";

const runtimeFunc = (time) => {
  let hour = parseInt(time/60);
  let minute = time%60;
  let result = hour + "시간 " + minute + "분";
  return result;
}

function MiniModal({ movieId, categoryId, setMiniModalOpen, setMiniModalOpenTrigger }) {
  const [movie, setMovie] = useState({});

  useEffect(()=>{
    const handler = setTimeout(()=>{
      fetchMovieData(movieId); 
    },1000);
   
    return () => {
      // delay로 정해둔 시간안에 새로운 value가 들어오면 기존 handler의 delay 초기화
      clearTimeout(handler);
    }

  },[movieId]);
  
  const fetchMovieData = async (movieId) => {
    const movieDetails = await axios.get(categoryId === 'TV' ? 'tv/'+movieId : 'movie/'+movieId, {
      params: {append_to_response : "videos"}
    });
    console.log(movieDetails)
    setMovie(movieDetails.data);
  };

  const renderSearchResult = () => {
    return Object.keys(movie).length > 0 ? (
      <div className='presentation'>
        <div className='wrapper-modal'>
          <div className='modal'>
            <span onClick={()=> {setMiniModalOpen(false);
                                setMiniModalOpenTrigger(false);
                                 }} className='modal-close'>
              ✕
            </span>
            <img 
              className='modal__poster-img'
              src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
              alt='modal__poster-img'
            />
            <div className='modal__content'>
              <p className='modal__details'>
                <span className='modal__user-perc'>
                  {`조회수 ${movie.popularity.toFixed(0)}회`}
                </span>
                <span className='modal__release-date'>
                  {movie.release_date ? movie.release_date.substr(0,4) : movie.first_air_date.substr(0,4)}
                </span>
                <span className='modal__episode-num'>
                  {categoryId === "TV" ? "시즌" +movie.number_of_seasons + " 에피소드 " +  movie.number_of_episodes + "개" : runtimeFunc(movie.runtime)}
                </span>
              </p>
              <h2 className='modal__title'>{movie.title? movie.title: movie.name}</h2>
              {movie.genres.map((obj, idx)=>(
                <span key={obj.id} className="modal__genre">
                  {obj.name + (idx === (movie.genres.length-1) ? " " : " • ")}
                </span>
              ))}
              <p className='modal__score'><span className='modal__score-star'>★</span> {movie.vote_average.toFixed(2)}</p>
              <p className='modal__overview'>{movie.overview ? movie.overview : "등록된 요약이 없습니다."}</p>
              
            </div>
          </div>  
        </div>    
      </div>
    ) : <></>
  }
  
  return renderSearchResult();
}

export default MiniModal;