import './App.css';
import Nav from './components/Nav';
import Banner from './components/Banner';
import requests from './api/requests';
import Row from './components/Row';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app">
      <Nav />
      <Banner />
      <Row
        title="오직 넷플릭스에서"
        id="NO"
        fetchUrl={requests.fetchNetfilxOriginals}
        isLargeRow 
      />
      <Row
        title="지금 뜨는 콘텐츠"
        id="TN"
        fetchUrl={requests.fetchTrending}
      />
      <Row
        title="넷플릭스 인기 콘텐츠"
        id="TR"
        fetchUrl={requests.fetchTopRated}
      />
      <Row
        title="액션 영화"
        id="AM"
        fetchUrl={requests.fetchActionMovies}
      />
      <Row
        title="코미디 영화"
        id="CM"
        fetchUrl={requests.fetchComedyMovies}
      />
      <Row
        title="무서운 영화"
        id="HM"
        fetchUrl={requests.fetchHorrorMovies}
      />
      <Row
        title="로맨스 영화"
        id="RM"
        fetchUrl={requests.fetchRomanceMovies}
      />
      <Row
        title="다큐멘터리"
        id="DM"
        fetchUrl={requests.fetchDocumentariesMovies}
      />
      <Footer/>
    </div>
  );
}

export default App;
