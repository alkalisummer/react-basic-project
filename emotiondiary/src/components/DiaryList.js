import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyButton from './MyButton';
import DiaryItem from './DiaryItem';

const sortOptionList = [
    { value : "latest", name : "최신순" },
    { value : "oldest", name : "오래된 순" },
];

const filterOptionList = [
    { value : "all", name : "전체" },
    { value : "good", name : "좋은감정" },
    { value : "bad", name : "나쁜감정" },
];

const ControlMenu = ({ value, onChange, optionList }) => {
  return( 
    <select className="ControlMenu" value={value} onChange={(e) => onChange(e.target.value)}>
      {optionList.map((obj, idx) => (
        <option key = {idx} value = {obj.value}>
          {obj.name}
        </option>
      ))}  
    </select>
  );
}

const DiaryList = ({ diaryList }) => {
  const navigate = useNavigate();
  const [sortType, setSortType] = useState("latest");
  const [filter, setFilter] = useState("all");

  const getProcesseDiaryList = () => {

    const filterCallBack = (obj) => {
        if(filter === "good"){
            return parseInt(obj.emotion) <= 3;
        }else {
            return parseInt(obj.emotion) > 3;
        }
    }

    const compare = (a, b) => {
      if(sortType === "latest"){
        return parseInt(b.date) - parseInt(a.date);
      }else {
        return parseInt(a.date) - parseInt(b.date);
      }
    }
    const copyList = JSON.parse(JSON.stringify(diaryList));

    const filteredList= filter === "all" ? copyList : copyList.filter(filterCallBack);

    const sortedList = filteredList.sort(compare);
    return sortedList;
  }
  return(
    <div className="DiaryList">
      <div className="menu_wrapper">
        <div className="left_col">
          <ControlMenu 
            value ={sortType} 
            onChange={setSortType} 
            optionList={sortOptionList}
          /> 
          <ControlMenu 
            value ={filter} 
            onChange={setFilter} 
            optionList={filterOptionList}
          />
        </div>
        <div className="right_col">
          <MyButton type={'positive'} text={'새 글쓰기'} onClick={()=>navigate('/new')}/>
        </div>
      </div>
      {getProcesseDiaryList().map((obj) => (
        <DiaryItem key={obj.id} {...obj}/>
      ))}
    </div>
  );
};

DiaryList.defaultProps = {
    diaryList : []
}

export default DiaryList;