import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { PackageIcon, Users, Box, ArrowLeft } from 'lucide-react';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let response;
      
      switch (activeTab) {
        case 'orders':
          response = await fetch('http://localhost:3001/api/admin/orders', {
            credentials: 'include'
          });
          const ordersData = await response.json();
          setOrders(ordersData.orders);
          break;
          
        case 'inventory':
          response = await fetch('http://localhost:3001/api/admin/inventory', {
            credentials: 'include'
          });
          const inventoryData = await response.json();
          setInventory(inventoryData.inventory);
          break;
          
        case 'users':
          response = await fetch('http://localhost:3001/api/admin/users', {
            credentials: 'include'
          });
          const usersData = await response.json();
          setUsers(usersData.users);
          break;
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      if (err.message === 'Unauthorized') {
        navigate('/login');
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      // Refresh orders data
      fetchData();
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.message);
    }
  };

  const handleInventoryUpdate = async (gameId, newQuantity) => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/inventory/${gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ stockQuantity: newQuantity })
      });

      if (!response.ok) throw new Error('Failed to update inventory');
      
      // Refresh inventory data
      fetchData();
    } catch (err) {
      console.error('Error updating inventory:', err);
      setError(err.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/4"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
          {error}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={() => navigate('/games')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Store
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('orders')}
              className={`${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <PackageIcon className="h-5 w-5 mr-2" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`${
                activeTab === 'inventory'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Box className="h-5 w-5 mr-2" />
              Inventory
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Users className="h-5 w-5 mr-2" />
              Users
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-gray-800 shadow-sm rounded-lg border border-gray-700">
          {activeTab === 'orders' && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-white mb-4">Recent Orders</h2>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.order_ID} className="border-b border-gray-700 last:border-0 pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-white">
                          Order #{order.order_ID} - {order.user_Name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {new Date(order.orderDate).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">
                          ${Number(order.totalAmount).toFixed(2)}
                        </p>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.order_ID, e.target.value)}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-white mb-4">Inventory Management</h2>
              <div className="space-y-4">
                {inventory.map((item) => (
                  <div key={item.game_ID} className="border-b border-gray-700 last:border-0 pb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-white">{item.title}</h3>
                        <p className="text-sm text-gray-400">
                          {item.genre} • {item.platform}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          min="0"
                          value={item.stockQuantity}
                          onChange={(e) => handleInventoryUpdate(item.game_ID, parseInt(e.target.value))}
                          className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <span className="text-sm text-gray-400">in stock</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-white mb-4">User Management</h2>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.user_ID} className="border-b border-gray-700 last:border-0 pb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-white">{user.user_Name}</h3>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 