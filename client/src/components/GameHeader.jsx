// for gameplay, not the landing page
import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/authContext';
import { useSeason } from '../contexts/seasonContext.jsx';
import Logout from '../pages/modals/LogOut';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import rulesPdf from "../assets/rules.pdf";
import titleImage from "../assets/titlepngedit.png";

const GameHeader = () => {
  const { user } = useAuthContext();
  const { currentSeason = 'Spring', seasonThemes = {} } = useSeason();
  const theme = seasonThemes[currentSeason] || { bodyBg: 'bg-white', bodyText: 'text-black' };
  const [showLogOutModal, setShowLogOutModal] = useState(false);
  // const [popupType, setPopupType] = useState('');
  const [gameDescription, setGameDescription] = useState('');
  const [showGameModal, setShowGameModal] = useState(false); // State to control the game modal
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
      {/* <h1 className="text-2xl font-bold">The Quiet Year</h1> */}

      {/* Navigation and User Info */}
      <div className="flex justify-between w-full mt-4">
        {/* <nav className="flex space-x-4">
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
        </nav> */}
        <nav className="flex space-x-4">
          <a
            href="/"
            className={`btn border-none shadow-md ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} py-2 px-4 rounded`}
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/');
            }}
          >
            Home
          </a>
          <a
            href={rulesPdf}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn border-none shadow-md ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} py-2 px-4 rounded`}
          >
            Rules
          </a>
        </nav>

        <div className="flex flex-col items-center">
          <img
            src={titleImage}
            alt="The Quiet Year"
            className="w-64 h-auto mb-2" // Adjust width and height as needed
          />
          {/* Game Title (only on game progress page) */}
          {isGameProgressPage && gameTitle && (
            <h2
              className={`text-lg font-semibold mt-2 cursor-pointer underline ${theme.headerTextHover}`}
              onClick={() => setShowGameModal(true)} // Open the modal when the title is clicked
            >
              {gameTitle}
            </h2>
          )}
        </div>

        <div className="flex space-x-4 items-center">
          {/* <div className="user-info flex space-x-4">
          <span className="username">{user.username}</span>
        </div> */}
          <button
            className="hover:underline"
            onClick={() => {
              console.log('Log Out button clicked');
              setShowLogOutModal(!showLogOutModal); // Show the logout modal
              console.log('showLogOutModal:', showLogOutModal);
            }}
          >
            {/* {showLogOutModal&&`Log Out`} */}
            Log Out {user.username}
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

      {/* Game Modal */}
      {showGameModal && (
        <dialog id="gameModal" className="modal modal-open">
          <div className="modal-box p-0">
            <header className={`p-4 text-center max-h-120 break-words overflow-y-auto ${theme.headerBg} ${theme.headerText}`}>
              <h3 className="font-bold text-lg mb-4 uppercase">{gameTitle}</h3>
            </header>

            <div className={`p-6 ${theme.bodyBg} ${theme.bodyText}`}>
              <div className="max-h-120 break-words overflow-y-auto pr-4">
                <p>{gameDescription || 'No description available.'}</p>
              </div>
              <div className="modal-action">
                <button
                  className="btn border-none shadow-md bg-white text-grey-600 hover:bg-gray-200"
                  onClick={() => setShowGameModal(false)} // Close the modal
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </dialog>
      )}
      {
        showLogOutModal && (
          // <Logout  />
          <Logout onClose={() => setShowLogOutModal(false)} />
          // 
        )
      }
    </header >
  );
};

export default GameHeader;