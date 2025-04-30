// for gameplay, not the landing page
import { useState } from 'react';
import { useAuthContext } from '../authContext';
import LogOut from '../pages/modals/LogOut';

const NewGameHeader = () => {
  const { user } = useAuthContext();
  const [showLogOut, setShowLogOut] = useState(true);

  const handleLogoutClick = () => {
    setShowLogOut(true);
  }


  return (
    <header
      className="game-header width-full bg-[#97be5a] text-[#f4eeee] py-4 px-6 flex justify-between items-center"
      role="banner"
    >
      <img
        src={require("../assets/TheQuietYear.webp")}
        alt="Game Icon"
        className="icon-image"
      />
      <nav className="flex space-x-4">
        <a href="/about" className="hover:underline">Home</a>
        <a href="rules.pdf" target="_blank" rel="noopener noreferrer" download>Download Rules</a>
      </nav>
      <div className="header-content flex space-x-4"
        {...user && user.isLoggedIn ?
          <div className="user-info flex space-x-4">
            <span className="username">{user.username}</span>
            <button onClick={handleLogoutClick} className="logout-button">Log Out</button>
          </div> : null
        }>
        {showLogOut && <LogOut onClose={() => setShowLogOut(false)} />}

      </div>
      <img
        src={require("../assets/title.png")}
        alt="Game Title"
        className="title-image"
      />

    </header>
  );
};

export default NewGameHeader;