import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GamepadIcon, Trash2, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

function CartPage() {
  const [cart, setCart] = useState({ items: [], total: 0, timestamp: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        console.log('Fetching cart...');
        const response = await fetch(`http://localhost:3001/api/cart`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Cart fetch error:', errorData);
          if (response.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error(errorData.message || 'Failed to fetch cart');
        }
        
        const data = await response.json();
        console.log('Cart data:', data);
        setCart(data);
      } catch (err) {
        console.error('Cart fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      const response = await fetch('http://localhost:3001/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Checkout failed');
      }

      const data = await response.json();
      alert('Order placed successfully!');
      navigate(`/orders/${data.orderId}`);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message);
    } finally {
      setCheckoutLoading(false);
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

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
          {cart.timestamp && (
            <p className="text-sm text-gray-400">
              Last updated: {new Date(cart.timestamp).toLocaleString()}
            </p>
          )}
        </div>
        
        {!cart.items || cart.items.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <GamepadIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-300">No items in cart</h3>
            <p className="mt-1 text-sm text-gray-400">Start shopping to add items to your cart.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/games')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Browse Games
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            {cart.items.map((item) => (
              <div key={item.game_ID} className="p-6 border-b border-gray-700 last:border-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {item.image_url ? (
                      <img 
                        src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:3001/${item.image_url}`}
                        alt={item.title}
                        className="h-16 w-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '';
                          e.target.parentElement.innerHTML = `
                            <div class="h-16 w-16 bg-gray-700 rounded-lg flex items-center justify-center">
                              <svg class="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                              </svg>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-700 rounded-lg flex items-center justify-center">
                        <GamepadIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-white">{item.title}</h3>
                      <p className="text-sm text-gray-400">
                        Quantity: {item.quantity} × ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-white">
                      ${Number(item.total_price).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="p-6 bg-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-white">Total</span>
                <span className="text-2xl font-bold text-blue-400">${cart.total}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className={`mt-4 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors ${
                  checkoutLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
