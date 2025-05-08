import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, GamepadIcon } from 'lucide-react';
import Navbar from '../components/Navbar';

function DesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); // Add this line

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/games/details/${id}`);
        if (!response.ok) throw new Error('Failed to fetch game details');
        const data = await response.json();
        setGame(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Check for userId when component mounts
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      setError('Please log in to view game details');
      navigate('/login');
      return;
    }
    setUserId(storedUserId);

    fetchGameDetails();
  }, [id, navigate]);

  const addToCart = async () => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      setError('Please log in to add items to cart');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:3001/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          game_ID: id,
          user_id: storedUserId,
          quantity: 1
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add to cart');
      }
      
      const data = await response.json();
      alert(data.message || 'Added to cart successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

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
      <Navbar />
      <div className="p-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Games
        </button>

        {game && (
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <div className="flex items-center justify-center bg-gray-100">
                <GamepadIcon className="h-20 w-20 text-gray-400" />
              </div>
            </div>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{game.title}</h1>
              <p className="text-gray-600 text-lg mb-6">{game.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="block text-sm text-gray-500">Genre</span>
                  <span className="text-lg font-semibold">{game.genre}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="block text-sm text-gray-500">Platform</span>
                  <span className="text-lg font-semibold">{game.platform}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-blue-600">${game.price}</span>
                <button 
                  onClick={addToCart}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DesPage;
