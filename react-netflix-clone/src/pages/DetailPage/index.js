import axios from '../../api/axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

function DetailPage () {
  const { movieId } = useParams();
  const [movie, setMovie] = useState({});

  useEffect(()=>{
    async function fetchData() {
      const request = await axios.get(`/movie/${movieId}`);
      setMovie(request.data);
    }
    fetchData();

  },[movieId]) 

  if(!movie) return <div>영화 정보가 존재하지 않습니다.</div>

  return (
    <section>
      <img className='modal__poster-img' 
           src = {`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`} 
           alt="poster"/>
    </section>
  )
}

export default DetailPage;