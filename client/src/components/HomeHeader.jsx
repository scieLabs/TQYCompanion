import Login from "../pages/modals/Login";
import Logout from "../pages/modals/LogOut";
import Register from "../pages/modals/NewUser";
import rules from "../assets/rules.pdf"
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
        <header className="header">
            <a href="Fh'tagn!">About</a>
            <a href={rules} target="_blank" rel="noreferrer">Rules</a>
            <div className="header-content">
                {!user && (
                    <>
                        <button onClick={handleLoginClick} className="login-button">Login</button>
                        <button onClick={handleRegisterClick} className="register-button">Register</button>
                    </>
                )}
                {user && (<>
                    <Logout />
                    <a href="Fh'tagn!">New Game</a>
                </>)}
            </div>
            <img src="./assets/title.png" alt="Fh'tagn!" />

            {showLogin && <Login onClose={handleCloseModal} />}
            {showRegister && <Register onClose={handleCloseModal} />}
        </header>
    );
};

export default HomeHeader;