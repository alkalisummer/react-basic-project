import DiaryEditor from "../components/DiaryEditor";
import { useEffect } from "react";

const New = () => {
  useEffect(()=>{
    const titleElment = document.getElementsByTagName('title')[0];
    titleElment.innerHTML = `Emotion Dairy - 새 게시글 작성`;
  }, [])
  
  return (
  <div>
    <DiaryEditor/>
  </div>
  );
};

export default New;
