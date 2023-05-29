import './App.css';
import Nav from './components/Nav';
import Footer from './components/Footer';
import SearchPage from './pages/SearchPage';
import MainPage from './pages/MainPage';
import React, { useState } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <Nav />

      <Outlet />

      <Footer />
    </div>
  );
};

export const CommonStateContext = React.createContext();

function App() {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <CommonStateContext.Provider value={{isClicked, setIsClicked}}>
      <div className="app">
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<MainPage/>} />
            <Route path="search" element={<SearchPage/>} />
          </Route>  
        </Routes>  
      </div>
    </CommonStateContext.Provider>
  );
}

export default App;
