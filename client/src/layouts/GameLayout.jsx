//to lock the disparate components into place for /pages/GameProgress hopefully
import { useEffect } from 'react';
import Footer from './Footer';

const getSeasonTheme = (season) => {
  switch (season) {
    case 'spring':
      return 'bg-green-100 text-green-900';
    case 'summer':
      return 'bg-yellow-100 text-yellow-900';
    case 'autumn':
      return 'bg-orange-100 text-orange-900';
    case 'winter':
      return 'bg-blue-100 text-blue-900';
    default:
      return '';
  }
};

export default function Layout({ children, currentSeason }) {
  const seasonClass = getSeasonTheme(currentSeason);

  // Apply season theme to <body> directly
  useEffect(() => {
    document.body.className = seasonClass;
  }, [currentSeason]);

  return (
    <div className={`min-h-screen flex flex-col ${seasonClass}`}>
      <main className="flex-grow">{children}</main>
      <Footer currentSeason={currentSeason} />
    </div>
  );
}