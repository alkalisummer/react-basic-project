import React, { useMemo, useReducer, useRef } from "react";

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Diary from "./pages/Diary";

const reducer = (state, action) => {
  let newState = [];
  switch(action.type){
    case 'INIT' : {
      return action.data;
    }
    case 'CREATE' : {
      newState = [action.data, ...state];
      break;
    }
    case 'REMOVE' : {
      newState = state.filter(obj=>obj.id !== action.targetId);
      break;
    }
    case 'EDIT' : {
      newState = state.map(obj=>{
       return obj.id === action.data.id? {...action.data} : obj
      }
      );
      break;
    }
    default :
      return state;
  }
  return newState;
}

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

const dummyData = [
  {
    id:1,
    emotion:1,
    content:"오늘의일기 1번",
    date : 1682916580008
  },
  {
    id:2,
    emotion:2,
    content:"오늘의일기 2번",
    date : 1682916580009
  },
  {
    id:3,
    emotion:3,
    content:"오늘의일기 3번",
    date : 1682916580010
  },
  {
    id:4,
    emotion:4,
    content:"오늘의일기 4번",
    date : 1682916580011
  },
  {
    id:5,
    emotion:5,
    content:"오늘의일기 5번",
    date : 1682916580012
  },
]


function App() {
  const [data, dispatch] = useReducer(reducer, dummyData);

  const dataId = useRef(6);
  
  //CREATE
  const onCreate = (date, content, emotion) =>{
    dispatch({
      type : "CREATE",
      data : {
        id : dataId.current,
        date : new Date(date).getTime(),
        content,
        emotion,
      }
    });
    dataId.current += 1;
  };
  //REMOVE
  const onRemove = (targetId)=> {
    dispatch({type: "REMOVE", targetId});
  };
  //EDIT
  const onEdit = (targetId, date, content, emotion)=>{
    dispatch({
      type: "EDIT", 
      data: {
        id: targetId,
        date: new Date(date).getTime(),
        content,
        emotion
      }
    });
  };

  const memoizedDispatches = useMemo(()=>{return {onCreate, onRemove, onEdit}}, [])

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/new" element={<New />}/>
              <Route path="/edit/:id" element={<Edit />}/>
              <Route path="/diary/:id" element={<Diary />}/>
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
