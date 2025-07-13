import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PackageIcon, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        setOrder(data.order);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

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

  if (!order) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-gray-400">Order not found</div>
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
          Back to Orders
        </button>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-white">Order #{order.order_ID}</h1>
                <p className="mt-1 text-sm text-gray-400">
                  Placed on {new Date(order.orderDate).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-400">
                  ${Number(order.totalAmount).toFixed(2)}
                </p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  order.status === 'Completed' 
                    ? 'bg-green-100 text-green-800' 
                    : order.status === 'Cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-medium text-white mb-4">Payment Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Payment Method</p>
                <p className="text-white">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Payment Status</p>
                <p className="text-white">{order.paymentStatus}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-medium text-white mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.game_ID} className="flex items-center justify-between py-4 border-b border-gray-700 last:border-0">
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
                        <PackageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-white">{item.title}</h3>
                      <p className="text-sm text-gray-400">
                        Quantity: {item.quantity} × ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-medium text-white">
                    ${Number(item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage; 