import React, { useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import axios from '../../api/axios';
import MovieModal from '../../components/MovieModal/MovieModal';
import "./SearchPage.css"; 

function SearchPage () {
  const [searchResults, setSearchResults] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [movieSelected, setMovieSelected] = useState({});

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
  }, [debouncedSearchTerm])
  
  const fetchSearchMovie = async (searchTerm) => {
    try{
      const request = await axios.get(`/search/multi?include_adult=false&query=${searchTerm}`) 
      setSearchResults(request.data.results);
    } catch (error) {
      console.log("error", error)
    }
  }

  const handleClick = async (movie) => {
    const movieDetails = await axios.get(movie.media_type === 'tv' ? 'tv/'+movie.id : 'movie/'+movie.id, {
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
    
    if(movieDetails){
      movieDetails.data.categoryId = movie.media_type.toUpperCase();
    }
    setModalOpen(true); 
    setMovieSelected(movieDetails.data);
  };

  const renderSearchResults = () => {
    return searchResults.length > 0 ? ( 
      <section className='search-container'>
        {searchResults.map((obj)=>{
          if(obj.backdrop_path !== null && obj.media_type !== 'person'){
            const movieImageUrl = 'https://image.tmdb.org/t/p/w500' + obj.backdrop_path
            return (
              <div className='movie' key={obj.id} >
                <div className='movie__column-poster' onClick={()=>handleClick(obj)}>
                  <img src={movieImageUrl} alt='movie' className='movie__poster'/>
                </div>
              </div>
            )
          }
        })}
        {
          modalOpen && <MovieModal {...movieSelected} setModalOpen={setModalOpen}/>
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

export default SearchPage;