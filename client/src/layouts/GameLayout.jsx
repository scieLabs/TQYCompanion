import { useSeason } from '../contexts/seasonContext.jsx';

export default function GameLayout({ children }) {
  const { currentSeason, seasonThemes } = useSeason(); // Access season context
  const theme = seasonThemes[currentSeason] || {}; // Get the theme for the current season

  return (
    <div className={`min-h-screen ${theme.bodyBg} ${theme.text}`}>
      <header className={`p-4 ${theme.bodyBg} ${theme.text}`}>
        <h1 className="text-3xl font-bold">Game Layout - {currentSeason}</h1>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className={`p-4 ${theme.bodyBg} ${theme.text}`}>
        <p>Footer Content</p>
      </footer>
    </div>
  );
}