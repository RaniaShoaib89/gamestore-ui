import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShoppingCart, Search, GamepadIcon } from 'lucide-react';

function GamesPage() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3001/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        navigate('/login');
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3001/api/games');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setGames(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-500">Error: {error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <GamepadIcon className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">GameStore</span>
            </div>
            
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search games..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Featured Games</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <div key={game.game_ID} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {/* Add game image here if available */}
                <div className="flex items-center justify-center bg-gray-100">
                  <GamepadIcon className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{game.title}</h2>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{game.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">${game.price}</span>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {game.genre}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {game.platform}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default GamesPage;