import React from 'react';
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

function MiniModal({ id, 
                     officialVideos,
                     backdrop_path,
                     popularity,
                     release_date,
                     first_air_date,
                     runtime,
                     number_of_seasons,
                     number_of_episodes,
                     title,
                     name,
                     genres,
                     categoryId, 
                     setMiniModalOpen, 
                     setBigModalOpen, 
                     setMiniModalMovieId, 
                     modalTop, 
                     modalLeft
  }) {
  
  const miniModalStyle = {
    top : modalTop,
    left : modalLeft
  }

  const YouTubeOpts = {
    width: 400,
    height: 230,
    playerVars : {
      rel : 0,
      modestbranding : 1,
      controls : 0,
      loop : 1
    }
  }

  const handleMouseOut = (outYn) => {
    setMiniModalOpen(outYn);
    setMiniModalMovieId("");
  }

  const handleBigModal = () => {
    setMiniModalOpen(false);
    setBigModalOpen({id: id});
  }
  return (
    <div className='presentation-mini' style={miniModalStyle}>
      <div className='wrapper-mini-modal' onMouseLeave={() => handleMouseOut(false)}>
        <div className='mini__modal'>
          <span onClick={()=> {setMiniModalOpen(false)}} className='mini__modal-close'>
            ✕
          </span>
          {officialVideos && officialVideos.length > 0 ? 
            <Container>
            <HomeContainer>
              <Iframe 
                src={`https://www.youtube.com/embed/${officialVideos[0].key}?controls=0&autoplay=1&loop=1&showinfo=0&mute=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="autoplay; fullscreen;"
                >
              </Iframe>
            </HomeContainer>
          </Container>
            : 
            <img 
              className='mini__modal__poster-img'
              src={`https://image.tmdb.org/t/p/original/${backdrop_path}`}
              alt='mini__modal__poster-img'
            />
          }
          
          <div className='mini__modal__content'>
            <p className='mini__modal__details'>
              <span className='mini__modal__user-perc'>
                {`조회수 ${popularity.toFixed(0)}회`}
              </span>
              <span className='mini__modal__release-date'>
                {release_date ? release_date.substr(0,4) : first_air_date.substr(0,4)}
              </span>
              <span className='mini__modal__episode-num'>
                {categoryId === "TV" ? "시즌" +number_of_seasons + " 에피소드 " +  number_of_episodes + "개" : runtimeFunc(runtime)}
              </span>
              <span className='mini__modal_dtl_btn' onClick={() => handleBigModal()}>▽</span>
            </p>
            <div className='mini__modal_title_div'>
              <span className='mini__modal__title'>{title? title: name}</span>
            </div>
            {genres.map((obj, idx)=>(
              <span key={obj.id} className='mini__modal__genre'>
                {obj.name + (idx === (genres.length-1) ? " " : " • ")}
              </span>
            ))}
          </div>
        </div>  
      </div>    
    </div>
  ) 
  }
  


export default React.memo(MiniModal);