import axios from "axios";
import config from "./apikey";

const instance = axios.create({
  baseURL : "https://api.themoviedb.org/3",
  params : {
    api_key : config.apikey,
    language : "ko-KR"
  }    
})

export default instance;