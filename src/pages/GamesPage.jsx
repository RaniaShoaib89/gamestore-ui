import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GamepadIcon } from 'lucide-react';
import Navbar from '../components/Navbar';

function GamesPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: null,
    username: null,
    role: null
  });
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');

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
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    
    if (!storedUserId) {
      navigate('/login');
      return;
    }

    setUser({
      id: storedUserId,
      username: storedUsername,
      role: storedRole
    });
  }, [navigate]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3001/api/games/genres/all');
        if (!response.ok) throw new Error('Failed to fetch genres');
        const data = await response.json();
        // Ensure we're getting the genre names from the response
        const genreNames = data.map(genre => genre.name || genre);
        setGenres(genreNames);
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        let url = 'http://127.0.0.1:3001/api/games';
        
        if (searchQuery) {
          url = `http://127.0.0.1:3001/api/games/search/${encodeURIComponent(searchQuery)}`;
        } else if (selectedGenre) {
          url = `http://127.0.0.1:3001/api/games/filter/genre/${encodeURIComponent(selectedGenre)}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setGames(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchGames, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedGenre]);

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
      <Navbar 
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        genres={genres}
        selectedGenre={selectedGenre}
        onGenreChange={(value) => {
          setSelectedGenre(value);
          setSearchQuery('');
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {selectedGenre ? `${selectedGenre} Games` : 'Featured Games'}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <div 
              key={game.game_ID} 
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer"
              onClick={() => navigate(`/details/${game.game_ID}`)}
            >
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