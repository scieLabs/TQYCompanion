//copyrights and all
import { useSeason } from '../contexts/seasonContext.jsx';


const Footer = () => {

  const { currentSeason, seasonThemes } = useSeason(); // Access season context
  const theme = seasonThemes[currentSeason] || {};

    return <footer className={`width-full ${theme.footerBg} ${theme.footerText} py-4 px-6 flex justify-between items-center mt-auto`}>
      <div className="text-sm">The Quiet Year Companion, 2025</div>
      <div className="flex space-x-4">
        <a href="https://buriedwithoutceremony.com/the-quiet-year" className={`${theme.footerTextHover}`}>❯❯ © Buried Without Ceremony ❮❮</a>
      </div>
      <div className="flex space-x-4 text-sm">
        <p>A project by:</p>
        <ul className="text-xs">
          <li><a href="https://www.youtube.com/watch?v=B0idb_caIIo&ab_channel=Vetondd" className={`${theme.footerTextHover}`}>Ema Bícová</a></li>
          <li><a href="https://random.dog/" className={`${theme.footerTextHover}`}>Fernanda Wynter</a></li>
          <li><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" className={`${theme.footerTextHover}`}>Ulf Schnoor</a></li>
        </ul>

      </div>
    </footer>
  };
  
export default Footer;