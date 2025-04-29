import './App.css'
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import LandingPage from './pages/LandingPage.jsx';
import GameProgress from './pages/GameProgress.jsx';
import { SeasonProvider } from './contexts/seasonContext.jsx';


function App() {
  return (
    <SeasonProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/game" element={<GameProgress />} />
          {/* <Route path="/summary/:id" element={<GameSummary />} /> */}
        </Routes>
        <Footer />
      </Router>
    </SeasonProvider>
  );
}

export default App;