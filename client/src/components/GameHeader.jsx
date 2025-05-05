// for gameplay, not the landing page
import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/authContext';
import { useSeason } from '../contexts/seasonContext.jsx'; 
import LogOut from '../pages/modals/LogOut';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const GameHeader = () => {
  const { user, logout } = useAuthContext();
  const { currentSeason = 'Spring', seasonThemes = {} } = useSeason(); // Access the season context
  const theme = seasonThemes[currentSeason] || { bodyBg: 'bg-white', bodyText: 'text-black' }; // Get the theme based on the current season
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(''); // 'home' or 'logout'
  const [showLogOut, setShowLogOut] = useState(true);
  const [gameTitle, setGameTitle] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const isGameProgressPage = location.pathname.includes('/game'); // Check if the current page is the game progress page

  useEffect(() => {
    if (isGameProgressPage) {
      // Fetch the game title from the database
      const fetchGameTitle = async () => {
        try {
          const gameId = location.pathname.split('/')[2]; // Extract game ID from the URL
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/game/${gameId}`,
            { withCredentials: true }
          );
          setGameTitle(response.data.title); // Set the game title from the response
        } catch (err) {
          console.error('Error fetching game title:', err);
        }
      };

      fetchGameTitle();
    }
  }, [isGameProgressPage, location.pathname]);

  const handleNavigation = (type) => {
    setPopupType(type);
    setShowPopup(true);
  };

  // const handleLogoutClick = () => {
  //   const confirmLeave = window.confirm('Are you sure you want to leave your ongoing game without saving?');
  //   if (confirmLeave) {
  //     LogOut();
  //     const notLoggedIn = window.confirm('You are not logged in. Would you like to log in to play?');
  //     navigate('/');

  //   }
  // };

  const handlePopupAction = (action) => {
    if (action === 'leave') {
      if (popupType === 'home') {
        navigate('/');
      } else if (popupType === 'logout') {
        logout();
        navigate('/');
      }
    }
    setShowPopup(false);
  };

  return (
    <header
      className={`game-header w-full ${theme.headerBg} ${theme.textColor} py-4 px-6 flex flex-col items-center`}
      role="banner"
    >
      {/* App Title */}
      <h1 className="text-2xl font-bold">The Quiet Year</h1>

      {/* Game Title (only on game progress page) */}
      {isGameProgressPage && gameTitle && (
        <h2 className="text-lg font-semibold mt-2">{gameTitle}</h2>
      )}

      {/* Navigation and User Info */}
      <div className="flex justify-between w-full mt-4">
        <nav className="flex space-x-4">
          <a href="/"  
            onClick={() => handleNavigation('home')}
            className="hover:underline" >
              Home
            </a>
          <a
            href="rules.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download
            className="hover:underline"
          >
            Rules
          </a>
        </nav>
        <div className="flex space-x-4">
          {user && user.isLoggedIn && (
            <div className="user-info flex space-x-4">
              <span className="username">{user.username}</span>
              <a
                href="/logout"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('logout');
                }}
                className="hover:underline"
              >
                Log Out
              </a>
            </div>
          )}
          {showPopup && <LogOut onClose={() => setShowLogOut(false)} />}
        </div>
      </div>
{/* Popup Modal */}
{showPopup && (
        <div className="popup-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="mb-4">
              {popupType === 'home'
                ? 'Are you sure you want to leave your ongoing game without saving?'
                : 'Are you sure you want to log out without saving?'}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handlePopupAction('leave')}
                className="btn btn-primary"
              >
                {popupType === 'home' ? 'Leave without saving?' : 'Log out without saving?'}
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default GameHeader;