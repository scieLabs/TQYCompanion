// for gameplay, not the landing page
import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/authContext';
import { useSeason } from '../contexts/seasonContext.jsx';
import LogOut from '../pages/modals/LogOut';
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

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogOutModal(true)
  };

  // const handleLogoutClick = () => {
  //   const confirmLeave = window.confirm('Are you sure you want to leave your ongoing game without saving?');
  //   if (confirmLeave) {
  //     LogOut();
  //     // const notLoggedIn = window.confirm('You are not logged in. Would you like to log in to play?');
  //     navigate('/');

  //   }
  // };


  //FIXME: Suggestion from copilot:
  // const handleNavigation = (type) => {
  //   setPopupType(type);
  //   setShowPopup(true);
  // };

  // const handlePopupConfirm = () => {
  //   if (popupType === 'home') {
  //     navigate('/'); // Navigate to the home page
  //   } else if (popupType === 'logout') {
  //     logout(); // Log out the user
  //     navigate('/'); // Redirect to the landing page
  //   }
  //   setShowPopup(false); // Close the modal
  // };

  // const handlePopupCancel = () => {
  //   setShowPopup(false); // Close the modal without taking any action
  // };

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
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/');
            }}
            className="hover:underline"
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
          <a
            href="/"
            className="hover:underline"
            onClick={handleLogoutClick}
            >
              Log Out
            </a>
            {showLogOutModal && (
              <LogoutModal onClose={() => setLogoutModalOpen(false)} />
            )};
        </div>
      </div>


      {/* 
      Popup Modal (Commented out for now)
      {showPopup && (
        <LeaveSessionModal
        actionType={popupType} // Determines the type of action (home or logout)
        onConfirm={handlePopupConfirm} // Called when the user confirms the action
        onCancel={handlePopupCancel} // Called when the user cancels the action
        />
      } 
      */}
    </header>
  );
};

export default GameHeader;