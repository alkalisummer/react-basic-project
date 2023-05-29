import axios from './axios';

const fetchMovie = async (movieId, categoryId) => {
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
  return movieDetails;
}

export default fetchMovie;