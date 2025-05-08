import { useState } from 'react';
import Login from "../pages/modals/Login";
import Logout from "../pages/modals/LogOut";
import Register from "../pages/modals/NewUser";
import { useAuthContext } from "../contexts/authContext.jsx";
import { useNavigate } from 'react-router-dom';
import { useSeason } from "../contexts/seasonContext.jsx";
import rulesPdf from "../assets/rules.pdf";

const HomeHeader = ({ onLoginClick, onRegisterClick }) => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [showLogOutModal, setShowLogOutModal] = useState(false);

    const { currentSeason = 'Spring', setCurrentSeason, seasonThemes = {} } = useSeason(); // Access season context
    const theme = seasonThemes[currentSeason] || { bodyBg: 'bg-white', bodyText: 'text-black' }; // Get the theme based on the current season


    const handleNewGameClick = () => {
        navigate('/new-game'); // Navigate to the NewGame page
    };

    return (
        <header
            className="home-header ${theme.headerBg} ${theme.headerText} width-full py-4 px-6 flex justify-between items-center "
            role="banner"
        >
            <nav className="flex space-x-4">
                <a href="/"
                    className="about-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    About
                </a>
                <a
                    href={rulesPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rules-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    View Rules
                </a>
            </nav>
            <div className="header-content flex space-x-4">
                {!user && (
                    <>
                        <button
                            onClick={onLoginClick}
                            className="login-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Login
                        </button>
                        <button
                            onClick={onRegisterClick}
                            className="register-button bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Register
                        </button>
                    </>
                )}
                {user && (
                    <>
                        <button
                            className="hover:underline"
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
                            className="new-game-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
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