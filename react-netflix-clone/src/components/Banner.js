import React, { useState, useEffect, useContext } from 'react';
import requests from '../api/requests';
import YouTube from 'react-youtube';
import axios from '../api/axios';
import { CommonStateContext } from '../App';
import MovieModal from './MovieModal/MovieModal';
import "./Banner.css";

const YouTubeOpts = {
  width: "100%",
  height: 600,
  playerVars : {
    rel : 0,
    modestbranding : 1,
    controls : 0,
    loop: 1
  }
}

function Banner() {
  const [movie, setMovie] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { isClicked, setIsClicked } = useContext(CommonStateContext);
  let videosArr = [];

  useEffect(() => {
      fetchData();
  }, []);

  const fetchData = async() => {
    // 현재 상영중인 영화정보를 가져오기(여러 영화)
    const request = await axios.get(requests.fetchNowPlaying);   

   
    do {
      // 여러 영화중 하나의 영화 ID를 가져오기
      const movieId = request.data.results[
        Math.floor(Math.random() * request.data.results.length)
      ].id;

       // 특정 영화의 상세정보 가져오기(동영상 포함)
      const {data : movieDetail} = await axios.get(`movie/${movieId}`, {
        params: {append_to_response : "videos"}
      });
      
      // 비디오가 있고 기존 영화정보가 없을때 만 setMovie 
      if(movieDetail.videos.results.length > 0 && videosArr.length === 0){
        movieDetail.officialVideos = [];
        for (let obj of movieDetail.videos.results){
          if(obj.type === 'Teaser' || obj.type === 'Trailer' ){
            movieDetail.officialVideos.push(obj);
          }
        }
        videosArr.push(movieDetail);
        setMovie(videosArr[0]);
      }
    } while (videosArr.length === 0)
    
  };

  const handleClick = () => {
    setModalOpen(true); 
  };

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n-1) + "..." : str  
  } 

  if(!isClicked){
    return (
      <header 
        className="banner"
        style={{
          backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie.backdrop_path}")`,
          backgroundPosition: "top center",
          backgroundSize: "cover"
        }}
      >
        <div className="banner__contents">
          <h1 className="banner__title">{movie.title || movie.name || movie.original_name}</h1>
          <h1 className="banner__description">{truncate(movie.overview, 100)}</h1>
          <div className="banner__buttons">
            <button className="banner__button play" onClick={()=>setIsClicked(true)}>▶︎ 재생</button>    
            <button className="banner__button info" onClick={()=>handleClick(movie)} >ⓘ 상세 정보</button>
          </div>
        </div>
        <div className="banner--fadeBottom"></div>
        {
          modalOpen && <MovieModal {...movie} setModalOpen={setModalOpen}/>
        }
      </header>
    )
  } else {
    return(
      <YouTube videoId={movie.officialVideos[0].key} opts={YouTubeOpts} onReady={(e) => e.target.playVideo()}></YouTube>
    )
  }
}

export default React.memo(Banner);