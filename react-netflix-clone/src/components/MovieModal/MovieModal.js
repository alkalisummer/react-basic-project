import "./MovieModal.css";
import React, { useRef } from 'react'
import YouTube  from 'react-youtube';
import useOnClickOutside from '../../hooks/useOnClickOutside';

const YouTubeOpts = {
  width: "100%",
  height: 450,
  playerVars : {
    rel : 0,
    modestbranding : 1,
    controls : 0,
    loop: 1
  }
}

const runtimeFunc = (time) => {
  let hour = parseInt(time/60);
  let minute = time%60;
  let result = hour + "시간 " + minute + "분";
  return result;
}

function MovieModal({
  backdrop_path,
  title,
  overview,
  name,
  categoryId,
  release_date,
  first_air_date,
  vote_average,
  number_of_episodes,
  number_of_seasons,
  runtime,
  popularity,
  genres,
  officialVideos,
  setModalOpen
}) {
  const ref = useRef();
  useOnClickOutside(ref, () => {setModalOpen(false)})

  return (
    <div className='presentation'>
      <div className='wrapper-modal'>
        <div className='modal' ref={ref}>
          <span onClick={()=> setModalOpen(false)} className='modal-close'>
            ✕
          </span>
          {officialVideos && officialVideos.length > 0 ? 
            <YouTube videoId={officialVideos[0].key} opts={YouTubeOpts} onReady={(e) => e.target.playVideo()}></YouTube> :
          <img 
            className='modal__poster-img'
            src={`https://image.tmdb.org/t/p/original/${backdrop_path}`}
            alt='modal__poster-img'
          />
          }
          <div className='modal__content'>
            <p className='modal__details'>
              <span className='modal__user-perc'>
                {`조회수 ${popularity.toFixed(0)}회`}
              </span>
              <span className='modal__release-date'>
                {release_date ? release_date.substr(0,4) : first_air_date.substr(0,4)}
              </span>
              <span className='modal__episode-num'>
                {categoryId === "TV" ? "시즌" +number_of_seasons + " 에피소드 " +  number_of_episodes + "개" : runtimeFunc(runtime)}
              </span>
            </p>
            <h2 className='modal__title'>{title? title: name}</h2>
            {genres.map((obj, idx)=>(
              <span key={obj.id} className="modal__genre">
                {obj.name + (idx === (genres.length-1) ? " " : " • ")}
              </span>
            ))}
            <p className='modal__score'><span className='modal__score-star'>★</span> {vote_average.toFixed(2)}</p>
            <p className='modal__overview'>{overview ? overview : "등록된 요약이 없습니다."}</p>
            
          </div>
        </div>  
      </div>    
    </div>
  )
}

export default React.memo(MovieModal);