import HomeHeader from "../components/homeHeader";
import Login from "../pages/modals/Login";
import { useAuthContext } from "../context/userContext";
import { useState } from "react";
import titleImage from "../assets/title.png";
import quietYearImage from "../assets/The-Quiet-Year.webp";

const LandingPage = () => {
    const [showLogin, setShowLogin] = useState(false);
    const { user } = useAuthContext();

    const handleLoginClick = () => {
        setShowLogin(true);
    };

    const handleCloseModal = () => {
        setShowLogin(false);
    };

    return (
        <div>
            <HomeHeader />
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
                        <a
                            href="/new-game"
                            className="new-game-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            New Game
                        </a>
                    )}
                </section>

                {showLogin && <Login onClose={handleCloseModal} />}
            </main>
        </div>
    );
};

export default LandingPage;