import HomeHeader from "../components/HomeHeader.jsx";
import Login from "../pages/modals/Login.jsx";
import Register from "../pages/modals/NewUser.jsx";
import { useAuthContext } from "../contexts/authContext.jsx";
import { useState } from "react";
import titleImage from "../assets/title.png";
import rulesImage from "../assets/rulesImage.png";
import more from "../assets/more.png";
import shelter from "../assets/shelter.png";
import ship from "../assets/ship.png";
import survey from "../assets/survey.png";
import quietYearImage from "../assets/The-Quiet-Year.webp";
import TheQuietYearBag from "../assets/TheQuietYearBag.webp";
import BWCLogo from "../assets/BWCLogo.webp";
import { useNavigate } from 'react-router-dom';
import { useSeason } from "../contexts/seasonContext.jsx";

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
                grid-rows-[150px_minmax(1000px,1fr)_50px] 
                grid-cols-[1fr_3fr]
                md:grid-cols-auto md:grid-rows-auto
                ${theme.bodyBg} ${theme.bodyText}
                p-6`}>
                {/*<img
                    src={quietYearImage}
                    alt="The Quiet Year gameplay example"
                    className="mx-auto"
                />*/}

                <section 
                className={`p-4 col-start-1 row-start-1 row-span-2 ${theme.statsBg} ${theme.statsText} rounded-lg text-justify`}>
                    <h2 className="text-2xl font-bold my-8 text-center">
                        About the Game
                    </h2>
                    <img
                        src={quietYearImage}
                        alt="The Quiet Year Game Title"
                        className="title-image mx-auto mb-6 w-52 h-42 rounded-full"
                    />
                    <ul className={` list-disc list-inside my-4 text-center`}>
                        <li className="my-2">Designed and written by Avery Alder.</li>
                        <li className="my-2">Design insights from Jackson Tegu.</li>
                        <li className="my-2">Illustrations by Ariel Norris.</li>
                        <li className="my-2">First released 2013. This iteration 2019.</li>
                        <li className="my-2">Explore <a href="https://buriedwithoutceremony.com/the-quiet-year" className={`underline ${theme.statsTextHover}`}>Buried Without Ceremony</a></li>
                    </ul>

                    <img
                        src={BWCLogo}
                        alt="Buried Without Ceremony Logo"
                        className={`mx-auto my-8 rounded-sm object-contain p-4 col-start-2 row-start-2 row-span-3`}
                    />

                    <p className="mx-10 text-sm mb-2">In print, this beautiful game comes in a small burlap bag. You’ll receive a forty-page booklet, a deck of oversized game cards (3.25″ x 5″, just like the booklet), a turn summary card, six small dice, and twenty Contempt Tokens (shaped like weathered skulls).</p>
                    <p className="mx-10 text-sm mb-2 text-center"><a href="https://store.buriedwithoutceremony.com/products/the-quiet-year" className={`underline ${theme.statsTextHover}`}>Buy it here!</a></p>

                    <img
                        src={TheQuietYearBag}
                        alt="Buried Without Ceremony Logo"
                        className={`mx-auto my-8 rounded-sm object-contain p-4 rounded-full`}
                    />

                    <h3 className="text-2xl font-bold my-8 text-center">Other Games</h3>
                    <p className="mb-4 mx-10">Expand your horizons with other games from Buried Without Ceremony, such as:</p>
                    <div className={`text-sm my-4 text-center`}>
                        <h4 className="text-lg font-bold mb-4">
                            <a href="https://buriedwithoutceremony.com/the-quiet-year/the-deep-forest"
                                className={`underline ${theme.statsTextHover}`}>
                                The Deep Forest</a></h4>
                        <div className={`text-justify mx-10`}>
                            <p className="mb-4">For a long time, our monstrous home was occupied by invading humans. Now, finally, we’ve driven them off, and we’re left with this: a year of relative peace. One quiet year, with which to dismantle their settlements and reclaim our lands. Come Winter, a band of heroes will arrive and we might not survive the encounter. This is when the game will end. But we don’t know about that yet. What we know is that right now, in this moment, we monsters have an opportunity for healing and self-discovery in our deep forest, away from human eyes.</p>
                            <p>The Deep Forest is a map game of post-colonial weird fantasy. It’s a re-imagining of The Quiet Year, one that centres upon monstrosity and decolonization.</p>
                        </div>
                    </div>

                </section>

                <section className={`features grid grid-cols-1 grid-rows-auto col-start-2 row-start-1 row-span-3 gap-10`}>
                    <div className={`hero flex items-center justify-center mt-5 mx-10`}>
                        <div>
                            <h1 className={`text-4xl text-center font-bold italic m-4`}>
                                Build community after the collapse.
                            </h1>
                            {/* <img
                                src={quietYearImage}
                                alt="The Quiet Year Game Title"
                                className="title-image mx-auto mb-6 w-42 h-42 rounded-full"
                            /> */}
                            <div className={`max-w-[60%] mx-auto text-justify`}>
                                <p className="mb-2"><em>The Quiet Year</em> is a map game. You define the struggles of a community living after the collapse of civilization, and attempt to build something good within their quiet year. Every decision and every action is set against a backdrop of dwindling time and rising concern.</p>
                                <p className="mb-2">The game is played using a set of 52 prompts – each corresponds to a week during the quiet year. Each prompt triggers certain events – bringing bad news, good omens, project delays and sudden changes in luck. At the end of the quiet year, the Frost Shepherds will come, ending the game.</p>
                                <p className="mb-2">The Quiet Year occupies an interesting space – part roleplaying game, part cartographic poetry.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`feature-item flex items-center justify-center mt-5 mx-10`}>
                        <div className="w-1/2">
                            <h2 className="text-center font-bold mb-2">What This Is</h2>
                            <p className={`text-justify`}>
                                This is a map-drawing game. You collectively explore the struggles of a community, trying to rebuild after the collapse of civilization. It’s a game about community, difficult choices, and landscapes. When you play, you make decisions about the community, decisions that get recorded on a map that is constantly evolving. Parts of the map are literal cartography, while other parts are symbolic. Players work together to create and steer this community, but they also play devil’s advocate and introduce problems and tensions into the game.
                            </p>
                        </div>

                        <img
                            src={shelter}
                            alt="The Quiet Year gameplay example"
                            className={`h-72 w-101 object-contain p-4 rounded-full`}
                        />
                    </div>
                    
                    <div className={`feature-item flex items-center justify-center mt-5 mx-10`}>
                        <img
                            src={survey}
                            alt="The Quiet Year map example"
                            className={`h-72 w-101 object-contain p-4 rounded-full`}
                        />
                    
                        <div className="w-1/2">
                            <h2 className="text-center font-bold mb-2">Supplies</h2>
                            <p>
                                The Quiet Year requires 2-4 players and 2-4 hours. In addition, it requires:
                            </p>
                            <ul className={`text-justify list-disc list-inside mt-4`}>
                                <li>A group leader with access to this companion app, which will lead you through each game week.</li>
                                <li>A blank piece of paper, or a digital drawing space.</li>
                                <li>A copy of the rules, which you can download from the header!</li>
                            </ul>
                        </div>

                        {/* <img
                            src={survey}
                            alt="The Quiet Year map example"
                            className={`h-72 w-101 object-contain p-4 rounded-full`}
                        /> */}
                    </div>

                    <div className={`feature-item flex items-center justify-center mt-5 mx-10`}>
                        <div className="w-1/2 text-justify">
                            <h2 className="text-center font-bold mb-2">The Week</h2>
                            <p>
                                The basic unit of play in <em>The Quiet Year</em> is the week. Each week is a turn taken by one player, with play proceeding clockwise around the table. Weeks should take an average of 2-3 minutes to complete. During each week, the following things happen:
                            </p>
                            <ul className={`text-justify list-disc list-inside mt-4`}>
                                <li>The active player draws a card, reads the relevant text aloud, and resolves it. They follow all bold text.</li>
                                <li>Project dice are reduced by 1, and any finished projects are updated.</li>
                                <li>The active player chooses and takes an action (<em>Discover Something New</em>, <em>Hold a Discussion</em>, or <em>Start a Project</em>).</li>
                            </ul>
                        </div>
                        <img
                            src={rulesImage}
                            alt="The Quiet Year decision-making example"
                            className={`h-72 w-101 object-contain p-4 rounded-full`}
                        />
                        
                    </div>
                    <div className={`feature-item flex items-center justify-center mt-5 mx-10`}>

                        <img
                            src={more}
                            alt="The Quiet Year decision-making example"
                            className={`h-72 w-101 object-contain p-4 rounded-full`}
                        />
                        <div className="w-1/2 text-justify">
                            <h2 className="text-center font-bold mb-2">The Prompts</h2>
                            <p className="mb-2">
                                As there are 52 prompts, there are 52 weeks. We won’t necessarily get to play all of them - the <em>Frost Shepherds</em> could arrive any time during Winter.
                            </p>
                            <p className="mb-2">Most prompts have two options to choose from, separated by an ‘or…’ divider. Pick the option that you find the most interesting and fitting, and read the text aloud. The card might ask you a question, bring bad news, or create new opportunities. Many cards have specific rules attached to them, which are written in bold text. If you drew the card, it’s up to you to make the decisions that the card requires.</p>
                            <p>If a prompt asks you a question, think about whether your answer could be represented on the map somehow. If it fits, update the map to reflect this new information. For example, if the card asks you about the sleeping quarters for the community, you might end up drawing a row of tents near the edge of the forest.</p>
                        </div>

                    </div>

                    <div className={`cta flex items-center justify-center mt-5 mx-10`}>
                    {!user ? (
                        <button
                            onClick={handleLoginClick}
                            className={`login-button btn btn-lg flex justify-center mt-4
                            ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
                            py-2 px-4 rounded hover:cursor-pointer`}
                        >
                            Get Started!
                        </button>
                    ) : (
                        <button
                            onClick={handleNewGameClick}
                            className={`new-game-button btn btn-lg flex justify-center mt-4
                            ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
                            py-2 px-4 rounded hover:cursor-pointer`}
                        >
                            New Game
                        </button>
                    )}
                    </div>
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