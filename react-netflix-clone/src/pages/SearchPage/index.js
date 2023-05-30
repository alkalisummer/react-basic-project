import React, { useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import axios from '../../api/axios';
import MovieModal from '../../components/MovieModal/MovieModal';
import MiniModal from '../../components/MovieModal/MiniModal';
import fetchMovie from '../../api/fetchMovie';
import "./SearchPage.css"; 

function SearchPage () {
  const [searchResults, setSearchResults] = useState([]);
  const [movieSelected, setMovieSelected] = useState({});
  
  //BigModal state
  const [modalOpen, setModalOpen] = useState(false);

  //MiniModal state
  const [miniModalOpen, setMiniModalOpen] = useState(false);
  const [miniModalOpenTrigger, setMiniModalOpenTrigger] = useState(false);
  const [miniModalMovieId, setMiniModalMovieId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [modalTop, setModalTop] = useState(0);
  const [modalLeft, setModalLeft] = useState(0);

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);  
  };
  let query = useQuery();
  const searchTerm = query.get("q");

  //한 자씩 타이핑할때마다 api를 호출하는 것을 방지하기 위해 delay 설정
  //설정한 delay 후 검색어 값이 바뀌면 api 호출
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(()=>{
    if(debouncedSearchTerm) {
        fetchSearchMovie(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  useEffect(()=>{
    const handler = setTimeout( async ()=>{
      if(miniModalMovieId && !modalOpen){
        const movieDetails = await fetchMovie(miniModalMovieId, categoryId);
        setMovieSelected(movieDetails.data);
        setMiniModalOpen(miniModalOpenTrigger);

      }
    }, 1000);

    return () => {
      clearTimeout(handler);
    }
  }, [miniModalOpenTrigger, miniModalMovieId])
  
  const fetchSearchMovie = async (searchTerm) => {
    try{
      const request = await axios.get(`/search/multi?include_adult=false&query=${searchTerm}`) 
      setSearchResults(request.data.results);
    } catch (error) {
      console.log("error", error)
    }
  }

  const handleClick = async (movie) => {
    const movieDetails = await fetchMovie(movie.id, categoryId);
    setModalOpen(true); 
    setMovieSelected(movieDetails.data);
    setMiniModalOpenTrigger(false);
  };

  const handleMouseEnter = (movie, overYn, event) => {
    setMiniModalMovieId(movie.id);
    setCategoryId(movie.media_type.toUpperCase())
    setMiniModalOpenTrigger(overYn);
    setModalTop(event.currentTarget.offsetTop);
    setModalLeft(event.currentTarget.offsetLeft);
  };

  const handleMouseLeave = (overYn) => {
    if(!miniModalOpen){
      setMiniModalOpenTrigger(overYn);
    }
  }

  const renderSearchResults = () => {
    return searchResults.length > 0 ? ( 
      <section className='search-container'>
        {searchResults.map((obj)=>{
          if(obj.backdrop_path !== null && obj.media_type !== 'person'){
            const movieImageUrl = 'https://image.tmdb.org/t/p/w400' + obj.backdrop_path
            return (
              <div className='movie' key={obj.id} >
                <div className='movie__column-poster' 
                     onClick={()=>handleClick(obj)}
                     onMouseEnter={(e) => handleMouseEnter(obj, true, e)}
                     onMouseLeave={() => handleMouseLeave(false)}
                     >
                  <img src={movieImageUrl} alt='movie' className='movie__poster'/>
                </div>
              </div>
            )
          }
        })}
        {
          modalOpen && <MovieModal {...movieSelected} setModalOpen={setModalOpen}/>
        }
        {
         miniModalOpen && <MiniModal {...movieSelected}
                                     miniModalOpen={miniModalOpen}
                                     setMiniModalOpen={setMiniModalOpen} 
                                     setMiniModalMovieId={setMiniModalMovieId} 
                                     setBigModalOpen={handleClick}
                                     categoryId={categoryId} 
                                     modalTop={modalTop}
                                     modalLeft={modalLeft}
          />
        }
      </section>
    ) : <section className='no-results'>
          <div className='no-results_text'>
            <p>
              "{debouncedSearchTerm}" 에 대한 검색결과가 없습니다.
            </p>
          </div>       
        </section>
  }


  return renderSearchResults();
}

export default React.memo(SearchPage);