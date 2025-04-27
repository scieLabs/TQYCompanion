//the initial landing page

import HomeHeader from "../components/homeHeader";
import Login from "../pages/modals/Login";
import { useAuthContext } from "../context/userContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LandingPage = () => {

    const [showLogin, setShowLogin] = useState(false);
    const { user } = useAuthContext();

    const handleLoginClick = () => {
        setShowLogin(true);
        setShowRegister(false);
    };

    return (
        <div>
            <HomeHeader />
            <div>
                <img
                    src={require("../assets/title.png")}
                    alt="Game Title"
                    className="title-image"
                />
                <div>
                    <div>
                        <h1 className="text-4xl font-bold mb-4">Welcome to The Quiet Year!</h1>
                        <div className="flex text-center mb-4">
                            <p className="mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus assumenda eaque unde dicta ut ad sapiente id est quidem rem quibusdam, aliquid aperiam hic, laboriosam provident sequi enim laborum deserunt!</p>
                            <img src="./assets/The-Quiet-Year.webp" alt="" />
                        </div>
                        <div className="flex text-center mb-4">
                            <img src="./assets/The-Quiet-Year.webp" alt="" />
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo aliquam in iure id explicabo vitae consequuntur facere incidunt cupiditate nobis laudantium quibusdam impedit voluptatum, dignissimos inventore, consectetur temporibus cumque ipsum?</p>
                        </div>
                        <div className="flex text-center mb-4">
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore eos aut rem temporibus sit obcaecati odit hic eligendi beatae veritatis dolorem impedit culpa, ex tempora. Saepe libero dolorem consequatur quos.</p>
                            <img src="./assets/The-Quiet-Year.webp" alt="" />
                        </div>
                        {!user && (
                            <>
                                <button
                                    onClick={handleLoginClick}
                                    className="login-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Get Started!
                                </button>
                            </>
                        )}
                        {user && (
                            <>
                                <a
                                    href="/new-game"
                                    className="new-game-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    New Game
                                </a>
                            </>
                        )}
                    </div>
                    {showLogin && <Login onClose={handleCloseModal} />}

                </div>
            </div>
        </div>
    );
}

export default LandingPage;