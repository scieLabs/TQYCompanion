//copyrights and all

const Footer = () => {
    return <footer className="width-full bg-[#97be5a] text-[#f4eeee] py-4 px-6 flex justify-between items-center">
      <div className="text-sm">The Quiet Year Companion, 2025</div>
      <div className="flex space-x-4">
        <a href="https://buriedwithoutceremony.com/the-quiet-year" className="hover:text-white">❯❯ © Buried Without Ceremony ❮❮</a>
      </div>
      <div className="flex space-x-4 text-sm">
        <p>A project by:</p>
        <ul className="text-xs">
          <li><a href="https://www.youtube.com/watch?v=B0idb_caIIo&ab_channel=Vetondd" className="hover:text-white">Ema Bícová</a></li>
          <li><a href="https://random.dog/" className="hover:text-white">Fernanda Wynter</a></li>
          <li><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" className="hover:text-white">Ulf Schnoor</a></li>
        </ul>

      </div>
    </footer>
  };
  
export default Footer;