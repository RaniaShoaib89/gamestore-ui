import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GamepadIcon, ArrowLeft, ShoppingCart } from 'lucide-react';
import Navbar from '../components/Navbar';

function DesPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/games/details/${id}`, {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch game details');
        const data = await response.json();
        console.log('Game details API response:', data);
        setGame(data.game ? data.game : data);
      } catch (err) {
        console.error('Error fetching game details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setAddToCartLoading(true);
      const response = await fetch('http://localhost:3001/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          game_ID: id,
          quantity: 1
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === 'Unauthorized') {
          setError('Please log in to add items to cart');
          navigate('/login');
          return;
        }
        if (errorData.message === 'This game is not available in inventory') {
          alert('This game is not available in inventory. Redirecting you to the games page...');
          setTimeout(() => {
            navigate('/games');
          }, 2000);
          return;
        }
        throw new Error(errorData.message || 'Failed to add to cart');
      }

      const data = await response.json();
      alert(data.message || 'Added to cart successfully!');
      navigate('/cart');
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError(err.message);
    } finally {
      setAddToCartLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-red-500">Error: {error}</div>
    </div>
  );

  if (!game) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-gray-400">Game not found</div>
    </div>
  );

  console.log('DesPage image_url:', game.image_url);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Games
        </button>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              {game.image_url ? (
                <img
                  src={game.image_url}
                  alt={game.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="flex items-center justify-center h-full">
                        <GamepadIcon class="h-16 w-16 text-white/50" />
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <GamepadIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white">{game.title}</h1>
                <p className="mt-2 text-xl font-medium text-blue-400">
                  ${Number(game.price).toFixed(2)}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-medium text-white">Description</h2>
                  <p className="mt-2 text-gray-300">{game.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Genre</h3>
                    <p className="mt-1 text-white">{game.genre}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Platform</h3>
                    <p className="mt-1 text-white">{game.platform}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Release Date</h3>
                    <p className="mt-1 text-white">{new Date(game.releaseDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Stock</h3>
                    <p className="mt-1 text-white">{game.stockQuantity} available</p>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={addToCartLoading || game.stockQuantity <= 0}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md text-white font-medium ${
                    game.stockQuantity <= 0
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 transition-colors'
                  } ${addToCartLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {addToCartLoading
                    ? 'Adding to Cart...'
                    : game.stockQuantity <= 0
                    ? 'Out of Stock'
                    : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesPage;
