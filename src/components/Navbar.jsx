import { useNavigate } from 'react-router-dom';
import { LogOut, ShoppingCart, Search, GamepadIcon } from 'lucide-react';

function Navbar({ onSearch, searchQuery, genres, selectedGenre, onGenreChange }) {
  const navigate = useNavigate();

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

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <GamepadIcon className="h-8 w-8 text-blue-500" />
            <span className="ml-2 text-xl font-bold text-gray-900">GameStore</span>
          </div>
          
          {onSearch && (
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Search games..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            {onGenreChange && (
              <select
                value={selectedGenre}
                onChange={(e) => onGenreChange(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            )}
            <button 
              onClick={() => navigate('/cart')} 
              className="p-2 hover:bg-gray-100 rounded-full"
            >
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
  );
}

export default Navbar;
