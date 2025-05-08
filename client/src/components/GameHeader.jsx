// for gameplay, not the landing page
import { useState, useEffect } from 'react';
import { NavLink,Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/authContext';
import { useSeason } from '../contexts/seasonContext.jsx';
import Logout from '../pages/modals/LogOut';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const GameHeader = () => {
  const { user } = useAuthContext();
  const { currentSeason = 'Spring', seasonThemes = {} } = useSeason();
  const theme = seasonThemes[currentSeason] || { bodyBg: 'bg-white', bodyText: 'text-black' };
  const [showLogOutModal, setShowLogOutModal] = useState(false);
  // const [popupType, setPopupType] = useState('');
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

  const handleNavigation = (path) => {
    const confirmLeave = window.confirm('Are you sure you want to leave your ongoing game without saving?');
    if (confirmLeave) {
      navigate(path);
    }
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
          <a
            href="/"
            className="hover:underline"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/')
            }}
          >
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
          <div className="user-info flex space-x-4">
            <span className="username">{user.username}</span>
          </div>
          <button
            className="hover:underline"
            onClick={() => {
              console.log('Log Out button clicked');
              setShowLogOutModal(!showLogOutModal); // Show the logout modal
              console.log('showLogOutModal:', showLogOutModal);
            }}
          >
            {/* {showLogOutModal&&`Log Out`} */}
            Log Out
          </button>
          {/* <Link
            to="/logout"
            className="hover:underline"
            onClick={(e) => {
              e.preventDefault();
              console.log('Log Out button clicked');
              setShowLogOutModal(true); // Show the logout modal
              console.log('showLogOutModal:', showLogOutModal);
            }}
          >
            Log Out
          </Link> */}
        </div>
      </div>
      {showLogOutModal && (
        // <Logout  />
        <Logout onClose={() => setShowLogOutModal(false)} />
        // 
      )}
    </header>
  );
};

export default GameHeader;