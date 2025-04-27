import './App.css'
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import GameProgress from './pages/GameProgress';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game" element={<GameProgress />} />
        {/* <Route path="/summary/:id" element={<GameSummary />} /> */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;