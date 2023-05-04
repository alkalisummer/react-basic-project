import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DiaryStateContext } from "../App";
import * as utils from "../util/date";
import * as emotion from '../util/emotion'
import MyHeader from "../components/MyHeader";
import MyButton from "../components/MyButton";
const Diary = () => {
  const { id } = useParams();
  const [data, setData] = useState();
  const diaryList = useContext(DiaryStateContext);
  const navigate = useNavigate();

  useEffect(()=>{
    if(diaryList.length >= 1){
      const targetDiary = diaryList.find(
        (obj) => parseInt(obj.id) === parseInt(id)
      );
      
      if(targetDiary){ //게시글이 있을 때
        setData(targetDiary);
      }else{// 게시글이 존재하지 않을 때
        alert("없는 게시글입니다.");
        navigate('/',{replace: true});
      }
    }
  }, [id, diaryList]);

  if(!data){
    return <div className="DiaryPage">로딩중입니다...</div>
  }else {
    const curEmotionData = emotion.emotionList.find((obj) => (parseInt(obj.emotion_id) === parseInt(data.emotion)))
    console.log(curEmotionData);
    return (
      <div className="DiaryPage">
        <MyHeader headText={`${utils.getStringDate(new Date(data.date))} 기록`}
                  leftChild={<MyButton text={"< 뒤로가기"} onClick={() => navigate(-1)}/>}
                  rightChild={<MyButton text={"수정"} onClick={() => navigate(`/edit/${data.id}`)}/>}
        />
        <article>
          <section>
            <h4>오늘의 감정</h4>
            <div className={["diary_img_wrapper", `diary_img_wrapper_${data.emotion}`].join(" ")}>
              <img src={curEmotionData.emotion_img}/> 
              <div className = "emotion_descript">
                {curEmotionData.emotion_descript}  
              </div> 
            </div>  
          </section>
          <section>
            <h4>오늘의 Diary</h4>
            <div className="diary_content_wrapper">
              <p>{data.content}</p>
            </div>
          </section>  
        </article>
      </div>
    );
  }
};

export default Diary;
