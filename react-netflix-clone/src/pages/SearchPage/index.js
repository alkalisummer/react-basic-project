import React, { useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import axios from '../../api/axios';
import "./SearchPage.css"; 

function SearchPage () {
  const [searchResults, setSearchResults] = useState([]);
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

  const renderSearchResults = () => {
    return searchResults.length > 0 ? ( 
      <section className='search-container'>
        {searchResults.map((obj)=>{
          if(obj.backdrop_path !== null && obj.media_type !== 'person'){
            const movieImageUrl = 'https://image.tmdb.org/t/p/w500' + obj.backdrop_path
            return (
              <div className='movie' key={obj.id}>
                <div className='movie__column-poster'>
                  <img src={movieImageUrl} alt='movie' className='movie__poster'/>
                </div>
              </div>
            )
          }
        })}

      </section>
    ) : <section className='no-results'>
          <div className='no-results_text'>
            <p>
              찾고자하는 검색어 "{debouncedSearchTerm}" 에 맞는 영화가 없습니다.
            </p>
          </div>       
        </section>
  }


  return renderSearchResults();
}

export default SearchPage;