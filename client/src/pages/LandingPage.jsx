import HomeHeader from "../components/HomeHeader";
import Login from "../pages/modals/Login";
import Register from "../pages/modals/NewUser";
import { useAuthContext } from "../contexts/authContext";
import { useState } from "react";
import titleImage from "../assets/title.png";
import quietYearImage from "../assets/The-Quiet-Year.webp";
import { useNavigate } from 'react-router-dom';
import { useSeason } from "../contexts/seasonContext";

const LandingPage = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const { user } = useAuthContext();
    const navigate = useNavigate();

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

    const handleNewGameClick = () => {
        navigate('/new-game'); // Navigate to the NewGame page
    };

    return (
        <div>
            <HomeHeader
                onLoginClick={handleLoginClick}
                onRegisterClick={handleRegisterClick}
            />
            {/* As soon as the NewGameHeader is done, we need to move this to the routing in App.jsx, just like the footer */}
            <main className="landing-page">
                <img
                    src={quietYearImage}
                    alt="The Quiet Year gameplay example"
                    className="mx-auto"
                />
                <section className="text-center">
                    <img
                        src={titleImage}
                        alt="The Quiet Year Game Title"
                        className="title-image mx-auto mb-6"
                    />
                    <h1 className="text-4xl font-bold mb-4">Welcome to The Quiet Year!</h1>
                    <p className="mb-4">
                        The Quiet Year is a map-drawing game about community, difficult choices, and the struggle to rebuild after the collapse of civilization.
                    </p>
                </section>

                <section className="features grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                    <div className="feature-item">
                        <p>
                            Explore the challenges of rebuilding a community in the aftermath of a disaster. Make decisions that shape the future of your people.
                        </p>
                        <img
                            src={quietYearImage}
                            alt="The Quiet Year gameplay example"
                            className="mx-auto"
                        />
                    </div>
                    <div className="feature-item">
                        <img
                            src={quietYearImage}
                            alt="The Quiet Year map example"
                            className="mx-auto"
                        />
                        <p>
                            Draw maps, tell stories, and create a unique narrative with your friends. Every game is a new adventure.
                        </p>
                    </div>
                    <div className="feature-item">
                        <p>
                            Make tough decisions as the seasons change. Will your community thrive, or will it fall apart under the weight of its challenges?
                        </p>
                        <img
                            src={quietYearImage}
                            alt="The Quiet Year decision-making example"
                            className="mx-auto"
                        />
                    </div>
                </section>

                <section className="cta text-center mt-8">
                    {!user ? (
                        <button
                            onClick={handleLoginClick}
                            className="login-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Get Started!
                        </button>
                    ) : (
                        <button
                            onClick={handleNewGameClick}
                            // onClick={() => navigate('/login')} TODO: suggested code
                            className="new-game-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            New Game
                        </button>
                    )}
                </section>

            </main>
            {showLogin || showRegister ? (
                <div
                    //remember to change pitch black background to something prettier
                    className="modal-wrapper fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={handleCloseModal}
                >
                    {showLogin && (
                        <div
                            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Login onClose={handleCloseModal} handleRegisterClick={handleRegisterClick} />
                        </div>
                    )}
                    {showRegister && (
                        <div
                            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Register onClose={handleCloseModal} />
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
};

export default LandingPage;