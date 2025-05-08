import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GamepadIcon, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';

function CartPage() {
  const [cart, setCart] = useState({ items: [], total: 0, timestamp: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/api/cart`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'  // Important for sending cookies
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error(errorData.message || 'Failed to fetch cart');
        }
        
        const data = await response.json();
        setCart(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          {cart.timestamp && (
            <p className="text-sm text-gray-500">
              Last updated: {new Date(cart.timestamp).toLocaleString()}
            </p>
          )}
        </div>
        
        {cart.items.length === 0 ? (
          <div className="text-center py-12">
            <GamepadIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No items in cart</h3>
            <p className="mt-1 text-sm text-gray-500">Start shopping to add items to your cart.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/games')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse Games
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg">
            {cart.items.map((item) => (
              <div key={item.game_id} className="p-6 border-b border-gray-200 last:border-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.title}
                        className="h-16 w-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <GamepadIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity} × ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-gray-900">
                      ${Number(item.total_price).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="p-6 bg-gray-50 rounded-b-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900">Total</span>
                <span className="text-2xl font-bold text-indigo-600">${cart.total}</span>
              </div>
              <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
