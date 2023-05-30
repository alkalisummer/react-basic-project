import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import "./Row.css";
import MovieModal from './MovieModal/MovieModal';
import MiniModal from './MovieModal/MiniModal';
import fetchMovie from '../api/fetchMovie';

//Import Swiper React Components & Swiper CSS
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';


function Row({ isLargeRow, title, id, fetchUrl }) {
  
  const [movies, setMovies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [miniModalOpen, setMiniModalOpen] = useState(false);
  const [miniModalOpenTrigger, setMiniModalOpenTrigger] = useState(false);
  const [movieSelected, setMovieSelected] = useState({});
  const [miniModalMovieId, setMiniModalMovieId] = useState("");
  const [modalTop, setModalTop] = useState(0);
  const [modalLeft, setModalLeft] = useState(0);
  const [swiperTrans, setSwiperTrans] = useState(0);

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
    setMiniModalOpenTrigger(false);
  };

  const handleMouseEnter = (movie, overYn, event) => {
      setMiniModalMovieId(movie.id);
      setMiniModalOpenTrigger(overYn);
      setModalTop(event.target.offsetParent.offsetParent.offsetParent.offsetTop);
      setModalLeft(event.target.offsetParent.offsetLeft - Math.abs(swiperTrans));
  };

  const handleMouseLeave = (overYn) => {
    if(!miniModalOpen){
      setMiniModalOpenTrigger(overYn);
    }
  }

  return (
    <section className="row">
      <h2>{title}</h2>
      <Swiper
        id = {id}
        spaceBetween={7}
        modules={[A11y, Navigation]}
        navigation
        loop={true}
        breakpoints={{
          1378: {
            slidesPerView: 6,
            slidesPerGroup: 6,
          },
          998: {
            slidesPerView: 5,
            slidesPerGroup: 5
          },
          625: {
            slidesPerView: 4,
            slidesPerGroup: 4
          },
          0: {
            slidesPerView: 3,
            slidesPerGroup: 3
          },
        }}
        onSlideChange={(swiper) => {
          setSwiperTrans(Math.round(swiper.translate));
        }}
      >
        <div id={id} className="row__posters">
          {movies.map(obj=>(
            <SwiperSlide key = {obj.id}>
              <img 
                id = {obj.id}
                className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                src={`https://image.tmdb.org/t/p/original/${isLargeRow ? obj.poster_path : obj.backdrop_path}`}
                alt={obj.name}
                onClick={()=> handleClick(obj)}
                onMouseEnter={(e) => handleMouseEnter(obj, true, e)}
                onMouseLeave={() => handleMouseLeave(false)}
              />
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
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
        {
          modalOpen && <MovieModal {...movieSelected} setModalOpen={setModalOpen} categoryId={id}/>
        }
    </section>
  )
}

export default React.memo(Row);