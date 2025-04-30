import './App.css'
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import LandingPage from './pages/LandingPage.jsx';
import GameProgress from './pages/GameProgress.jsx';
import NewGame from './pages/NewGame.jsx';
import { SeasonProvider } from './contexts/seasonContext.jsx';
import { AuthProvider } from './contexts/authContext.jsx'; // Adjust the import path if needed
import Home from './pages/LandingPage';



function App() {
  return (
    <>
    <SeasonProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <AuthProvider>
          <Route path="/new-game" element={<NewGame />} />
          <Route path="/game" element={<GameProgress />} />
          {/* <Route path="/summary/:id" element={<GameSummary />} /> */}
          </AuthProvider>
        </Routes>
        <Footer />
      </Router>
    </SeasonProvider>
    </>
  );
}

export default App;