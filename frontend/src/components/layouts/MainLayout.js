import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  CreditCard, 
  AlertTriangle, 
  BarChart2, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  User, 
  Bell, 
  ChevronDown 
} from 'lucide-react';

const MainLayout = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navItems = [
    { path: '/', name: 'Dashboard', icon: <Home size={20} /> },
    { path: '/transactions', name: 'Transactions', icon: <CreditCard size={20} /> },
    { path: '/alerts', name: 'Alerts', icon: <AlertTriangle size={20} /> },
    { path: '/reports', name: 'Reports', icon: <BarChart2 size={20} /> },
    { path: '/settings', name: 'Settings', icon: <Settings size={20} /> },
  ];
  
  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center text-white font-bold">
              FS
            </div>
            <h1 className="ml-2 text-lg font-semibold text-primary-600">FraudShield</h1>
          </div>
          <button 
            className="p-1 rounded-md lg:hidden hover:bg-neutral-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="px-4 py-6">
          <ul className="space-y-1">
            {navItems.map(item => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="pt-6 mt-6 border-t border-neutral-200">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 rounded-md hover:bg-neutral-100 transition-colors"
            >
              <LogOut size={20} />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-neutral-200">
          <div className="flex items-center">
            <button
              className="p-1 mr-4 rounded-md lg:hidden hover:bg-neutral-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h2 className="text-xl font-semibold text-neutral-800">
              {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications dropdown */}
            <div className="relative">
              <button
                className="p-2 text-neutral-600 rounded-full hover:bg-neutral-100 focus:outline-none"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-alert-500 rounded-full"></span>
              </button>
              
              {notificationsOpen && (
                <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-2 px-4 border-b border-neutral-200">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="py-2 px-4 hover:bg-neutral-50 border-b border-neutral-100">
                      <p className="text-sm font-medium">New high-risk transaction detected</p>
                      <p className="text-xs text-neutral-500">5 minutes ago</p>
                    </div>
                    <div className="py-2 px-4 hover:bg-neutral-50 border-b border-neutral-100">
                      <p className="text-sm font-medium">Alert pattern detected in transactions</p>
                      <p className="text-xs text-neutral-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="py-2 px-4 text-center border-t border-neutral-200">
                    <Link to="/alerts" className="text-xs text-primary-600 hover:text-primary-800">
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* User dropdown */}
            <div className="relative">
              <button
                className="flex items-center text-sm rounded-full focus:outline-none"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="w-8 h-8 bg-primary-100 text-primary-800 rounded-full flex items-center justify-center">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <ChevronDown size={16} className="ml-1 text-neutral-500" />
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-neutral-700">
                      <p className="font-medium">{currentUser?.name || 'User'}</p>
                      <p className="text-xs text-neutral-500">{currentUser?.email || 'user@example.com'}</p>
                    </div>
                    <hr className="my-1" />
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-neutral-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;