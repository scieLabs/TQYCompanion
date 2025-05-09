import HomeHeader from "../components/HomeHeader";
import Login from "../pages/modals/Login";
import Register from "../pages/modals/NewUser";
import { useAuthContext } from "../contexts/authContext";
import { useState, useEffect } from "react";
import titleImage from "../assets/title.png";
import quietYearImage from "../assets/The-Quiet-Year.webp";
import { useNavigate } from 'react-router-dom';
import { useSeason } from "../contexts/seasonContext";

const LandingPage = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const { currentSeason = 'Spring', setCurrentSeason, seasonThemes = {} } = useSeason(); // Access season context
    const theme = seasonThemes[currentSeason] || { bodyBg: 'bg-white', bodyText: 'text-black' }; // Get the theme based on the current season

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
        setCurrentSeason('Spring');
        navigate('/new-game'); // Navigate to the NewGame page
    };
//{``}
    return (
        <div>
            <HomeHeader
                onLoginClick={handleLoginClick}
                onRegisterClick={handleRegisterClick}
            />
            {/* As soon as the NewGameHeader is done, we need to move this to the routing in App.jsx, just like the footer */}
            <main className={`
                landing-page grid 
                grid-rows-[150px_minmax(900px,1fr)_100px] 
                grid-cols-3 grid-cols-[1fr_3fr]
                ${theme.bodyBg} ${theme.bodyText}
                p-6`}>
                {/*<img
                    src={quietYearImage}
                    alt="The Quiet Year gameplay example"
                    className="mx-auto"
                />*/}

                <section 
                className={`p-4 col-start-1 row-start-2 row-span-3 ${theme.statsBg} rounded text-justify`}>
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus nam sed architecto est temporibus unde rem exercitationem asperiores tempora ea, aliquam quaerat praesentium eos fugit sint officia mollitia at optio?
                    </p>
                    <img
                        src={quietYearImage}
                        alt="The Quiet Year gameplay example"
                        className={`mx-auto object-contain p-4 col-start-2 row-start-2 row-span-3`}
                    />
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis enim unde repellendus mollitia suscipit, impedit ad fuga accusantium commodi facere similique, amet iste iure esse consequatur placeat eum maxime! Earum!
                    </p>
                </section>
                

                <section className={`text-center col-start-1 col-end-3 row-start-1 row-span-2`}>
                    {/*<img
                        src={titleImage}
                        alt="The Quiet Year Game Title"
                        className="title-image mx-auto mb-6"
                    />
                    <h1 className="text-4xl font-bold mb-4">Welcome to The Quiet Year!</h1>
                    */}
                    <h1 className={`text-5xl mb-4`}>
                        The Quiet Year is a map-drawing game about community, difficult choices, and the struggle to rebuild after the collapse of civilization.
                    </h1>
                </section>

                <section className={`features grid grid-flow-col grid-rows-3 col-start-2 row-start-2 row-span-2 gap-4`}>
                    <div className={`feature-item flex items-center mt-5 mr-20 ml-20`}>
                        <p>
                            Explore the challenges of rebuilding a community in the aftermath of a disaster. Make decisions that shape the future of your people. Lorem ipsum dolor sit amet consectetur adipisicing elit. Est eos odio, maiores doloremque enim dolore eius sit iure blanditiis deleniti doloribus voluptatum similique! A sint corporis, rerum officia sed cum? Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, itaque. Debitis tempora minus corrupti esse eveniet accusantium soluta sunt magnam porro eum dolorem laudantium, beatae similique amet illo labore suscipit? Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem accusantium quibusdam asperiores consectetur. Eius inventore veniam culpa, magni deleniti aliquid autem qui rerum architecto accusantium tenetur est fugiat quae dolorum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis necessitatibus, itaque cupiditate tempora commodi deleniti illum quia repellat
                        </p>
                        <img
                            src={quietYearImage}
                            alt="The Quiet Year gameplay example"
                            className={`h-72 w-101 object-contain p-4`}
                        />
                    </div>
                    <div className={`feature-item flex items-center mt-5 mr-20 ml-20`}>
                        <img
                            src={quietYearImage}
                            alt="The Quiet Year map example"
                            className={`h-72 w-101 object-contain p-4`}
                        />
                        <p>
                            Draw maps, tell stories, and create a unique narrative with your friends. Every game is a new adventure. Lorem ipsum dolor sit amet consectetur adipisicing elit. Est eos odio, maiores doloremque enim dolore eius sit iure blanditiis deleniti doloribus voluptatum similique! A sint corporis, rerum officia sed cum? Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, itaque. Debitis tempora minus corrupti esse eveniet accusantium soluta sunt magnam porro eum dolorem laudantium, beatae similique amet illo labore suscipit? Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem accusantium quibusdam asperiores consectetur. Eius inventore veniam culpa, magni deleniti aliquid autem qui rerum architecto accusantium tenetur est fugiat quae dolorum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis necessitatibus, itaque cupiditate tempora commodi deleniti illum quia repellat nulla perferendis reprehenderit molestiae rerum architecto culpa, saepe, laboriosam harum labore maiores.
                        </p>
                    </div>
                    <div className={`feature-item flex items-center mt-5 mr-20 ml-20`}>
                        <p>
                            Make tough decisions as the seasons change. Will your community thrive, or will it fall apart under the weight of its challenges? Lorem ipsum dolor sit amet consectetur adipisicing elit. Est eos odio, maiores doloremque enim dolore eius sit iure blanditiis deleniti doloribus voluptatum similique! A sint corporis, rerum officia sed cum? Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, itaque. Debitis tempora minus corrupti esse eveniet accusantium soluta sunt magnam porro eum dolorem laudantium, beatae similique amet illo labore suscipit? Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem accusantium quibusdam asperiores consectetur. Eius inventore veniam culpa, magni deleniti aliquid autem qui rerum architecto accusantium tenetur est fugiat quae dolorum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis necessitatibus, itaque cupiditate tempora commodi deleniti illum quia repellat nulla perferendis reprehenderit molestiae rerum architecto culpa, saepe, laboriosam harum labore maiores.
                        </p>
                        <img
                            src={quietYearImage}
                            alt="The Quiet Year decision-making example"
                            className={`h-72 w-101 object-contain p-4`}
                        />
                    </div>
                </section>

                <section className={`cta text-center mt-8 col-start-1 col-end-3 row-start-4 row-span-1 justify-self-center`}>
                    {!user ? (
                        <button
                            onClick={handleLoginClick}
                            className={`login-button flex justify-center items-center mt-4
                            ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
                            py-2 px-4 rounded hover:cursor-pointer`}
                        >
                            Get Started!
                        </button>
                    ) : (
                        <button
                            onClick={handleNewGameClick}
                            className={`new-game-button flex justify-center mt-4
                            ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
                            py-2 px-4 rounded hover:cursor-pointer`}
                        >
                            New Game
                        </button>
                    )}
                </section>

            </main>
            
            {showLogin || showRegister ? (
                <div
                    className={`
                        modal-wrapper fixed inset-0 flex justify-center items-center
                        `}
                    onClick={handleCloseModal}
                >
                    {showLogin && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Login onClose={handleCloseModal} handleRegisterClick={handleRegisterClick} />
                        </div>
                    )}
                    {showRegister && (
                        <div
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