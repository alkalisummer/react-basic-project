import { useNavigate } from 'react-router-dom';
import { useState, useRef, useContext, useEffect } from 'react';

import Myheader from './MyHeader';
import MyButton from './MyButton';
import EmotionItem from './EmotionItem';
import { DiaryDispatchContext } from './../App'

const emotionList = [
    {
        emotion_id : 1,
        emotion_img : process.env.PUBLIC_URL + `/assets/emotion1.png`,
        emotion_descript: '매우 좋음'
    },
    {
        emotion_id : 2,
        emotion_img : process.env.PUBLIC_URL + `/assets/emotion2.png`,
        emotion_descript: '좋음'
    },
    {
        emotion_id : 3,
        emotion_img : process.env.PUBLIC_URL + `/assets/emotion3.png`,
        emotion_descript: '보통'
    },
    {
        emotion_id : 4,
        emotion_img : process.env.PUBLIC_URL + `/assets/emotion4.png`,
        emotion_descript: '나쁨'
    },
    {
        emotion_id : 5,
        emotion_img : process.env.PUBLIC_URL + `/assets/emotion5.png`,
        emotion_descript: '매우 나쁨'
    }
]

const getStringDate = (date) => {
    return date.toISOString().slice(0, 10)
  }

const DiaryEditor = ({isEdit, originData}) => {
    const navigate = useNavigate();
    const contentRef = useRef();
    const [date, setDate] = useState(getStringDate(new Date()));
    const [emotion, setEmotion] = useState(3);
    const [content, setContent] = useState("");
    const {onCreate, onEdit} = useContext(DiaryDispatchContext);

    const handleClickEmote = (emotion) => {
      setEmotion(emotion)
    }

    const handleSubmit = () => {
        if(content.length < 1){
            contentRef.current.focus();
            return;
        }

        if(window.confirm(isEdit? "게시글을 수정하시겠습니까?" : "게시글을 등록하시겠습니까?")){
          if(!isEdit){
            onCreate(date, content, emotion);
          }else {
            onEdit(originData.id, date, content, emotion);
          }
        }

        navigate('/', {replace:true})
    };
    useEffect(() => {
      if(isEdit){
        setDate(getStringDate(new Date(parseInt(originData.date))));
        setEmotion(originData.emotion);
        setContent(originData.content);
      }
    }, [isEdit, originData]);
    return (
      <div className="DiaryEditor">
        <Myheader headText={isEdit ? "게시글 수정" : "게시글 등록"} leftChild={<MyButton text={"< 뒤로가기"} onClick={()=>{navigate(-1)}}/>} />
        <div>
          <section>
            <h4>오늘은 언제인가요?</h4>
            <div className="input_box">
              <input className="input_date" type="date" value={date} onChange={(e)=>{setDate(e.target.value)}}/>
            </div>
          </section>
          <section>
            <h4>오늘의 감정</h4>
            <div className="input_box emotion_list_wrapper">
                {emotionList.map((obj) => (
                    <EmotionItem 
                      key={obj.emotion_id} 
                      onClick={handleClickEmote} 
                      isSelected={obj.emotion_id === emotion}
                      {...obj}/>
                ))}
            </div>
          </section>
          <section>
            <h4>오늘의 다이어리</h4>
            <div className='input_box text_wrapper'>
                <textarea 
                  ref={contentRef} 
                  value={content} 
                  onChange={(e)=>setContent(e.target.value)}
                  placeholder='오늘은 무슨일이 있었나요?'
                />
            </div>
          </section>
          <section>
            <div className='control_box'>
                <MyButton text={'취소'} onClick={() => {navigate(-1)}}/>
                <MyButton text={'저장'} type={'positive'} onClick={handleSubmit}/>
            </div>
          </section>
        </div>
      </div>
    );
} 

export default DiaryEditor;