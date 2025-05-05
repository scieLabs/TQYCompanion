import './App.css';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import LandingPage from './pages/LandingPage.jsx';
import GameProgress from './pages/GameProgress.jsx';
import CreateNewGame from './pages/NewGame.jsx';
import { SeasonProvider } from './contexts/seasonContext.jsx';
import { AuthProvider } from './contexts/authContext.jsx';
import ProtectedRoute from './layouts/authLayout.jsx'; // Import the ProtectedRoute function

function App() {
  return (
    <Router>
      <AuthProvider>
        <SeasonProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/new-game"
              element={
                <ProtectedRoute>
                  <CreateNewGame />
                </ProtectedRoute>
              }
            />
              <Route
                path="/game/:game_id/week/:week"
                element={
                  <ProtectedRoute>
                    <GameProgress />
                  </ProtectedRoute>
                }
            />
          </Routes>
          <Footer />
        </SeasonProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;





//FIXME: OLD VERSION
// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <SeasonProvider>
//           <Routes>
//             <Route path="/" element={<LandingPage />} />
//             {/* <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/logout" element={<Logout />} /> */}
//             <Route path="/new-game" element={<CreateNewGame />} />
//             <Route path="/game" element={<GameProgress />} />
//             {/* <Route path="/summary/:id" element={<GameSummary />} /> */}
//           </Routes>
//           <Footer />
//         </SeasonProvider>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;