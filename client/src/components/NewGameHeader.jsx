// for gameplay, not the landing page
import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/authContext.jsx';
import LogOut from '../pages/modals/LogOut.jsx';
import { useNavigate } from 'react-router-dom';
import { useSeason } from '../contexts/seasonContext.jsx'; // Import the season context


const NewGameHeader = () => {
  const { user } = useAuthContext();
  const { currentSeason = 'Spring', setCurrentSeason, seasonThemes = {} } = useSeason(); // Access season context
  const theme = seasonThemes[currentSeason] || { bodyBg: 'bg-white', bodyText: 'text-black' }; // Get the theme based on the current season
  const [showLogOut, setShowLogOut] = useState(true);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    const confirmLeave = window.confirm('Are you sure you want to leave your ongoing game without saving?');
    if (confirmLeave) {
      navigate(path);
    }
  };

  const handleLogoutClick = () => {
    const confirmLeave = window.confirm('Are you sure you want to leave your ongoing game without saving?');
    if (confirmLeave) {
      LogOut();
      const notLoggedIn = window.confirm('You are not logged in. Would you like to log in to play?');
      navigate('/');
    
    }
  };


  return (
    <header
      className={`game-header w-full ${theme.headerBg} ${theme.textColor} py-4 px-6 flex justify-between items-center`}
      role="banner"
    >
      {/* <img
        src={require("../assets/TheQuietYear.webp")}
        alt="Game Icon"
        className="icon-image h-12 w-12"
      /> */}
      {/* Navigation */}
      <nav className="flex space-x-4">
        <button
          onClick={() => handleNavigation('/')}
          className="hover:underline"
        >
          Home
        </button>
        <a
          href="rules.pdf"
          target="_blank"
          rel="noopener noreferrer"
          download
          className="hover:underline"
        >
          Download Rules
        </a>
      </nav>
              {/* Centered title */}
              <h1 className="text-2xl font-bold text-center flex-grow">
          The Quiet Year
        </h1>
      {/* User Info */}
      <div className="header-content flex space-x-4">
        {user && user.isLoggedIn ? (
          <div className="user-info flex space-x-4">
            <span className="username">{user.username}</span>
            <button
              onClick={handleLogoutClick}
              className="logout-button hover:underline"
            >
              Log Out
            </button>
          </div>
        ) : null}
        {showLogOut && <LogOut onClose={() => setShowLogOut(false)} />}
      </div>
    </header>
  );
};

export default NewGameHeader;