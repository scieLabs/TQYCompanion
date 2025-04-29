import { createContext, useContext, useState } from 'react';

const SeasonContext = createContext();

export const SeasonProvider = ({ children }) => {
  const [currentSeason, setCurrentSeason] = useState('Spring'); // Default season

  const seasonThemes = {
    Spring: {
  
      // green: #97be5a
      // pink: #ffb7b7
      // white: #f4eeee
      // yellow: #ffdbaa
  
  
      // Home Header, Game Header, also modal header
      headerBg: 'bg-[#97be5a]', //also use for modal header
      headerText: 'text-[#f4eeee]',
      headerTextHover: 'hover:text-[#ffdbaa]', //for links hover
      headerBtnBg: 'bg-[#ffdbaa]',
      headerBtnBgHover: 'hover:bg-[#ffb7b7]', //for button hover
      headerBtnText: 'text-[#f4eeee]', //TODO: change to a visible colour against the yellow later. to the same colour as body text
  
      // LandingPage, NewGame, and GameProgress pages (including ActionModal), and modals
      bodyBg: 'bg-[#f4eeee]', // main body; also use for modals
      bodyText: 'text-green-900', // TODO: find later
  
      bodyInputBg: 'bg-[#ffdbaa] focus:outline-[#ffdbaa] focus:ring-0 focus:border-[#ffdbaa]', //Text field input for actions. Use for modals input as well
      bodyInputText: 'text-green-900', // TODO: change along with the other body text
  
      nextWeekBtnBg: 'bg-[#97be5a]', //Next week button. also use for saving modals
      nextWeekBtnBgHover: 'hover:bg-[#ffb7b7]', //Next week button hover
      nextWeekBtnText: 'text-[#f4eeee]',
  
      pWeeksBtnBg: 'bg-[#ffb7b7]', //the + and - buttons for setting project duration
      pWeeksBtnBgHover: 'hover:bg-[#97be5a]', //hover for above
      pWeeksBtnText: 'text-[#f4eeee]',
  
      // GameStats sidebar
      statsBg: 'bg-[#ffb7b7]',
      statsText: 'text-[#f4eeee]',
      statsBtnBg: 'bg-[#ffdbaa]',
      statsBtnBgHover: 'hover:bg-[#97be5a]',
      statsBtnText: 'text-[#f4eeee]', // TODO: change to body text colour later
  
      //footer
      footerBg: 'bg-[#97be5a]',
      footerText: 'text-[#f4eeee]',
      footerTextHover: 'hover:text-[#ffdbaa]'
    },
    Summer: {
      // green: #97be5a
      // orange: #ffa27f
      // white: #fbf0e8
      // red: #d44747
  
  
      // Home Header, Game Header, also modal header
      headerBg: 'bg-[#97be5a]', //also use for modal header
      headerText: 'text-[#fbf0e8]',
      headerTextHover: 'hover:text-[#d44747]', //for links hover
      headerBtnBg: 'bg-[#d44747]',
      headerBtnBgHover: 'hover:bg-[#ffa27f]', //for button hover
      headerBtnText: 'text-[#fbf0e8]',
  
      // LandingPage, NewGame, and GameProgress pages (including ActionModal), and modals
      bodyBg: 'bg-[#fbf0e8]', // main body; also use for modals
      bodyText: 'text-green-900', // TODO: find later
  
      bodyInputBg: 'bg-[#ffa27f] focus:outline-[#ffa27f] focus:ring-0 focus:border-[#ffa27f]', //Text field input for actions. Use for modals input as well
      bodyInputText: 'text-[#fbf0e8]',
  
      nextWeekBtnBg: 'bg-[#97be5a]', //Next week button. also use for saving modals
      nextWeekBtnBgHover: 'hover:bg-[#d44747]', //Next week button hover
      nextWeekBtnText: 'text-[#fbf0e8]',
  
      pWeeksBtnBg: 'bg-[#d44747]', //the + and - buttons for setting project duration
      pWeeksBtnBgHover: 'hover:bg-[#97be5a]', //hover for above
      pWeeksBtnText: 'text-[#fbf0e8]',
  
      // GameStats sidebar
      statsBg: 'bg-[#ffa27f]',
      statsText: 'text-[#fbf0e8]',
      statsBtnBg: 'bg-[#d44747]',
      statsBtnBgHover: 'hover:bg-[#97be5a]',
      statsBtnText: 'text-[#fbf0e8]',
  
      //footer
      footerBg: 'bg-[#d44747]',
      footerText: 'text-[#fbf0e8]',
      footerTextHover: 'hover:text-[#ffa27f]'
    },
    Autumn: {
      // brown: #7c444f
      // orange: #f39e60
      // yellow: #f9ebd9
      // red: #d44747
  
  
      // Home Header, Game Header, also modal header
      headerBg: 'bg-[#d44747]', //also use for modal header
      headerText: 'text-[#f9ebd9]',
      headerTextHover: 'hover:text-[#7c444f]', //for links hover
      headerBtnBg: 'bg-[#7c444f]',
      headerBtnBgHover: 'hover:bg-[#f39e60]', //for button hover
      headerBtnText: 'text-[#f9ebd9]',
  
      // LandingPage, NewGame, and GameProgress pages (including ActionModal), and modals
      bodyBg: 'bg-[#f9ebd9]', // main body; also use for modals
      bodyText: 'text-green-900', // TODO: find later
  
      bodyInputBg: 'bg-[#f39e60] focus:outline-[#f39e60] focus:ring-0 focus:border-[#f39e60]', //Text field input for actions. Use for modals input as well
      bodyInputText: 'text-[#f9ebd9]',
  
      nextWeekBtnBg: 'bg-[#d44747]', //Next week button. also use for saving modals
      nextWeekBtnBgHover: 'hover:bg-[#7c444f]', //Next week button hover
      nextWeekBtnText: 'text-[#f9ebd9]',
  
      pWeeksBtnBg: 'bg-[#7c444f]', //the + and - buttons for setting project duration
      pWeeksBtnBgHover: 'hover:bg-[#d44747]', //hover for above
      pWeeksBtnText: 'text-[#f9ebd9]',
  
      // GameStats sidebar
      statsBg: 'bg-[#f39e60]',
      statsText: 'text-[#f9ebd9]',
      statsBtnBg: 'bg-[#7c444f]',
      statsBtnBgHover: 'hover:bg-[#d44747]',
      statsBtnText: 'text-[#f9ebd9]',
  
      //footer
      footerBg: 'bg-[#7c444f]',
      footerText: 'text-[#f9ebd9]',
      footerTextHover: 'hover:text-[#f39e60]'
    },
    Winter: {
      // brown: #7c444f
      // light blue: #b4d4ff
      // white: #eef5ff
      // dark blue: #6091d4
  
  
      // Home Header, Game Header, also modal header
      headerBg: 'bg-[#7c444f]', //also use for modal header
      headerText: 'text-[#eef5ff]',
      headerTextHover: 'hover:text-[#b4d4ff]', //for links hover
      headerBtnBg: 'bg-[#6091d4]',
      headerBtnBgHover: 'hover:bg-[#b4d4ff]', //for button hover
      headerBtnText: 'text-[#eef5ff]',
  
      // LandingPage, NewGame, and GameProgress pages (including ActionModal), and modals
      bodyBg: 'bg-[#eef5ff]', // main body; also use for modals
      bodyText: 'text-green-900', // TODO: find later
  
      bodyInputBg: 'bg-[#b4d4ff] focus:outline-[#b4d4ff] focus:ring-0 focus:border-[#b4d4ff]', //Text field input for actions. Use for modals input as well
      bodyInputText: 'text-[#eef5ff]', //TODO: may be too light
  
      nextWeekBtnBg: 'bg-[#7c444f]', //Next week button. also use for saving modals
      nextWeekBtnBgHover: 'hover:bg-[#6091d4]', //Next week button hover
      nextWeekBtnText: 'text-[#eef5ff]',
  
      pWeeksBtnBg: 'bg-[#6091d4]', //the + and - buttons for setting project duration
      pWeeksBtnBgHover: 'hover:bg-[#7c444f]', //hover for above
      pWeeksBtnText: 'text-[#eef5ff]',
  
      // GameStats sidebar
      statsBg: 'bg-[#b4d4ff]',
      statsText: 'text-[#eef5ff]',
      statsBtnBg: 'bg-[#6091d4]',
      statsBtnBgHover: 'hover:bg-[#7c444f]',
      statsBtnText: 'text-[#eef5ff]',
  
      //footer
      footerBg: 'bg-[#6091d4]',
      footerText: 'text-[#eef5ff]',
      footerTextHover: 'hover:text-[#b4d4ff]'
    },
  };


  return (
    <SeasonContext.Provider value={{ currentSeason, setCurrentSeason, seasonThemes }}>
      {children}
    </SeasonContext.Provider>
  );
};

export const useSeason = () => useContext(SeasonContext);