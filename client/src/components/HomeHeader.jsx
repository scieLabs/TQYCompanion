import { useState } from 'react';
import Login from "../pages/modals/Login";
import Logout from "../pages/modals/LogOut";
import Register from "../pages/modals/NewUser";
import { useAuthContext } from '../path/to/userContext';

const HomeHeader = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const { user } = useAuthContext();

    const handleLoginClick = () => {
        setShowLogin(true);
        setShowRegister(false);
    };

    const handleRegisterClick = () => {
        setShowRegister(true);
        setShowLogin(false);
    };

    const handleCloseModal = () => {
        setShowLogin(false);
        setShowRegister(false);
    };

    return (
        <header
            className="home-header width-full bg-[#97be5a] text-[#f4eeee] py-4 px-6 flex justify-between items-center"
            role="banner"
        >
            <nav className="flex space-x-4">
                <a href="/about"
                    className="about-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    About
                </a>
                <a href="rules.pdf" target="_blank" rel="noopener noreferrer" download
                    className="rules-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Download Rules
                </a>
            </nav>
            <div className="header-content flex space-x-4">
                {!user && (
                    <>
                        <button
                            onClick={handleLoginClick}
                            className="login-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Login
                        </button>
                        <button
                            onClick={handleRegisterClick}
                            className="register-button bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Register
                        </button>
                    </>
                )}
                {user && (
                    <>
                        <Logout />
                        <a
                            href="/new-game"
                            className="new-game-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            New Game
                        </a>
                    </>
                )}
            </div>
            <img
                src={require("../assets/title.png")}
                alt="Game Title"
                className="title-image"
            />

            {showLogin && <Login onClose={handleCloseModal} />}
            {showRegister && <Register onClose={handleCloseModal} />}
        </header>
    );
};

export default HomeHeader;