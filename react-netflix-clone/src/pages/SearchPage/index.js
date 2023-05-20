import React, { useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../../api/axios';

function SearchPage () {
  const [serchResults, setSearchResults] = useState([]);
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);  
  };
  let query = useQuery();
  const searchTerm = query.get("q");

  useEffect(()=>{
    if(searchTerm) {
        fetchSearchMovie(searchTerm);
    }
  }, [searchTerm])
  
  const fetchSearchMovie = async (searchTerm) => {
    try{
      const request = await axios.get(`/search/multi?include_adult=false&query=${searchTerm}`) 
      setSearchResults(request.data.results);
    } catch (error) {
      console.log("error", error)
    }
  }


  return (
    <div>index</div>
  )
}

export default SearchPage;