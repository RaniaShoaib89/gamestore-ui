import { GamepadIcon } from 'lucide-react';

function GameCard({ game }) {
  // ...existing code...
  
  const renderGameImage = () => {
    if (game.image_url) {
      return (
        <img 
          src={game.image_url}
          alt={game.title}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = ''; // Set a default fallback image if needed
            e.target.className = 'hidden';
            e.target.nextSibling?.classList.remove('hidden');
          }}
        />
      );
    }
    return (
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
        <GamepadIcon className="h-12 w-12 text-gray-400" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {renderGameImage()}
      {/* ...rest of your GameCard content... */}
    </div>
  );
}

export default GameCard;