import React, { useMemo, useReducer, useRef, useEffect } from "react";

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
      newState = action.data;
      break;
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
  
  localStorage.setItem("diary", JSON.stringify(newState));
  
  return newState;
}

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
  const [data, dispatch] = useReducer(reducer, []);
  const dataId = useRef(0);
  
  useEffect(()=>{
    const localData = localStorage.getItem("diary");
    if(localData && localData.length > 0){
      const diaryList = JSON.parse(localData).sort((a, b)=>parseInt(b.id) - parseInt(a.id));
      if(diaryList.length > 0){
        dataId.current = parseInt(diaryList[0].id + 1);
        dispatch({type: "INIT", data: diaryList});
      }
    }
  }, []);
  
  
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
