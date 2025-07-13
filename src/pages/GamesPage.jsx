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
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-red-400">Error: {error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar 
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        genres={genres}
        selectedGenre={selectedGenre}
        onGenreChange={(value) => {
          setSelectedGenre(value);
          setSearchQuery('');
        }}
        className="bg-white/10 backdrop-blur-lg border-b border-white/10"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          {selectedGenre ? `${selectedGenre} Games` : 'Featured Games'}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <div 
              key={game.game_ID} 
              className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-purple-400/50 shadow-lg hover:shadow-purple-500/10 transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() => navigate(`/details/${game.game_ID}`)}
            >
              <div className="w-full h-48 bg-white/5 group-hover:scale-105 transition-transform duration-300">
                {game.image_url ? (
                  <img
                    src={game.image_url}
                    alt={game.title}
                    className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="flex items-center justify-center h-48">
                          <GamepadIcon class="h-12 w-12 text-white/50" />
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-48">
                    <GamepadIcon className="h-12 w-12 text-white/50" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                  {game.title}
                </h2>
                <p className="text-sm text-white/70 mb-4 line-clamp-2">
                  {game.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-purple-300">
                    ${game.price}
                  </span>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
                      {game.genre}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-400/10 text-purple-300 border border-purple-400/20">
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