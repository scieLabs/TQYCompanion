import { useState } from 'react';
import Login from "../pages/modals/Login";
import Logout from "../pages/modals/LogOut";
import Register from "../pages/modals/NewUser";
import { useAuthContext } from "../contexts/authContext.jsx";
import { useNavigate } from 'react-router-dom';
import { useSeason } from "../contexts/seasonContext.jsx";
import rulesPdf from "../assets/rules.pdf";
import titleImage from "../assets/titlepngedit.png"; // Import the image

const HomeHeader = ({ onLoginClick, onRegisterClick }) => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [showLogOutModal, setShowLogOutModal] = useState(false);

    const { currentSeason = 'Spring', setCurrentSeason, seasonThemes = {} } = useSeason(); // Access season context
    const theme = seasonThemes[currentSeason] || { bodyBg: 'bg-white', bodyText: 'text-black' }; // Get the theme based on the current season


    const handleNewGameClick = () => {
        navigate('/new-game'); // Navigate to the NewGame page
    };
    //{``}
    return (
        <header
            className={`home-header 
                ${theme.headerBg} ${theme.headerText} ${theme.headerTextHover} ${theme.headerBg}
                width-full py-4 px-6 flex justify-between items-center`}
            role="banner"
        >

            <nav className="flex space-x-4">
                <a href="/"
                    className={`btn about-button border-none shadow-md
                        ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText}
                py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                >
                    About
                </a>
                <a
                    href={rulesPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn rules-button border-none shadow-md
                        ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
                    py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                >
                    View Rules
                </a>
            </nav>
            {/* <h1
                className={`game-title text-5xl font-bold 
                    ${theme.headerText} ${theme.headerBg}`}
                style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }} // Optional: Add a shadow effect to the text
            >
                THE QUIET YEAR
            </h1> */}

                          {/* Header Image */}
            <img
                src={titleImage}
                alt="The Quiet Year"
                className="w-64 h-auto mb-4" // Adjust width and height as needed
            />
            <div className="header-content flex space-x-4">
                {!user && (
                    <>
                        <button
                            onClick={onLoginClick}
                            className={`btn login-button border-none shadow-md
                                ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
                                py-2 px-4 rounded`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={onRegisterClick}
                            className={`btn register-button border-none shadow-md
                                ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
                                py-2 px-4 rounded`}
                        >
                            Register
                        </button>
                    </>
                )}
                {user && (
                    <>
                        <button
                            className={`btn border-none shadow-md ${theme.bodyBg} ${theme.bodyText} hover:bg-gray-200`}
                            onClick={() => {
                                console.log('Log Out button clicked');
                                setShowLogOutModal(!showLogOutModal); // Show the logout modal
                                console.log('showLogOutModal:', showLogOutModal);
                            }}
                        >
                            Log Out
                        </button>
                        <button
                            onClick={handleNewGameClick}
                            className={`btn new-game-button border-none shadow-md
                                ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
                                py-2 px-4 rounded focus:outline-none focus:shadow-outline`}>
                            New Game
                        </button>
                    </>
                )}
            </div>
            {showLogOutModal && (
                // <Logout  />
                <Logout onClose={() => setShowLogOutModal(false)} />
                // 
            )}
        </header>
    );
};

export default HomeHeader;