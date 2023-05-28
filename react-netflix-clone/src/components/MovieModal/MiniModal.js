import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import "./MiniModal.css";
import { styled } from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 400px;
  height: 230px;
`;
const HomeContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  z-index: -1;
  border: none;

  &::after {
    content:"";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const runtimeFunc = (time) => {
  let hour = parseInt(time/60);
  let minute = time%60;
  let result = hour + "시간 " + minute + "분";
  return result;
}

function MiniModal({ movieId, 
                     categoryId, 
                     setMiniModalOpen, 
                     setBigModalOpen, 
                     setMiniModalMovieId, 
                     modalTop, 
                     modalLeft
  }) {
  const [movie, setMovie] = useState({});
  const miniModalStyle = {
    top : modalTop,
    left : modalLeft
  }

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
    if(movieDetails.data.videos.results.length > 0){
      movieDetails.data.officialVideos = [];
      for (let obj of movieDetails.data.videos.results){
        if(obj.type === 'Teaser' || obj.type === 'Trailer'){
          movieDetails.data.officialVideos.push(obj);
        }
      }
    }
    setMovie(movieDetails.data);
  };

  const handleMouseOut = (outYn) => {
    setMiniModalOpen(outYn);
    setMiniModalMovieId("");
  }

  const handleBigModal = () => {
    setMiniModalOpen(false);
    setBigModalOpen(movie);
  }
  
  const renderSearchResult = () => {
    return Object.keys(movie).length > 0 ? (
      <div className='presentation-mini' style={miniModalStyle}>
        <div className='wrapper-mini-modal' onMouseLeave={() => handleMouseOut(false)}>
          <div className='mini__modal'>
            <span onClick={()=> {setMiniModalOpen(false);
                                 }} className='mini__modal-close'>
              ✕
            </span>
            {movie.officialVideos && movie.officialVideos.length > 0 ? 
              <Container>
                <HomeContainer>
                  <Iframe 
                    src={`https://www.youtube.com/embed/${movie.officialVideos[0].key}?controls=0&autoplay=1&loop=1&mute=1&playlist=${movie.officialVideos[0].key}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="autoplay; fullscreen;"
                    >
                  </Iframe>
                </HomeContainer>
              </Container> : 
              <img 
                className='mini__modal__poster-img'
                src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                alt='mini__modal__poster-img'
              />
            }
            
            <div className='mini__modal__content'>
              <p className='mini__modal__details'>
                <span className='mini__modal__user-perc'>
                  {`조회수 ${movie.popularity.toFixed(0)}회`}
                </span>
                <span className='mini__modal__release-date'>
                  {movie.release_date ? movie.release_date.substr(0,4) : movie.first_air_date.substr(0,4)}
                </span>
                <span className='mini__modal__episode-num'>
                  {categoryId === "TV" ? "시즌" +movie.number_of_seasons + " 에피소드 " +  movie.number_of_episodes + "개" : runtimeFunc(movie.runtime)}
                </span>
                <span className='mini__modal_dtl_btn' onClick={() => handleBigModal()}>▽</span>
              </p>
              <div className='mini__modal_title_div'>
                <span className='mini__modal__title'>{movie.title? movie.title: movie.name}</span>
              </div>
              {movie.genres.map((obj, idx)=>(
                <span key={obj.id} className='mini__modal__genre'>
                  {obj.name + (idx === (movie.genres.length-1) ? " " : " • ")}
                </span>
              ))}
              
            </div>
          </div>  
        </div>    
      </div>
    ) : <></>
  }
  
  return renderSearchResult();
}

export default MiniModal;