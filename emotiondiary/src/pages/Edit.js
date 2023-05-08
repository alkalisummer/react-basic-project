import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { DiaryStateContext } from "../App"; 
import DiaryEditor from "../components/DiaryEditor"
const Edit = () => {
  
  const [originData, setOriginData] = useState();
  const navigate = useNavigate();
  const { id } = useParams();
  const diaryList = useContext(DiaryStateContext);

  useEffect(() => {
    const titleElment = document.getElementsByTagName('title')[0];
    titleElment.innerHTML = `Emotion Dairy - ${id}번 게시글 수정`;
    if(diaryList.length >= 1){
      const targetDiary = diaryList.find((obj)=>
       parseInt(obj.id) === parseInt(id)
      );

      if(targetDiary){
        setOriginData(targetDiary)
      } else{
        navigate("/", { replace: true });
      } 
    }
  },[id, diaryList])
  return (
    <div>
      <div>{originData && <DiaryEditor isEdit={true} originData={originData}/>}</div>
    </div>
  );
};

export default Edit;
