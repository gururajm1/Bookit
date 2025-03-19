import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Film,
  MapPin,
  Ticket,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
  subItems?: {
    title: string;
    path: string;
  }[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/admin'
  },
  {
    title: 'Movies',
    icon: Film,
    path: '/admin/movies',
    subItems: [
      { title: 'All Movies', path: '/admin/movies' },
      { title: 'Add Movie', path: '/admin/movies/new' }
    ]
  },
  {
    title: 'Locations',
    icon: MapPin,
    path: '/admin/locations',
    subItems: [
      { title: 'All Locations', path: '/admin/locations' },
      { title: 'Add Location', path: '/admin/locations/new' }
    ]
  },
  {
    title: 'Bookings',
    icon: Ticket,
    path: '/admin/bookings'
  },
  {
    title: 'Users',
    icon: Users,
    path: '/admin/users'
  },
  {
    title: 'Settings',
    icon: Settings,
    path: '/admin/settings'
  }
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSubItems = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <div key={item.title}>
              <button
                onClick={() => {
                  if (item.subItems) {
                    toggleSubItems(item.title);
                  } else {
                    navigate(item.path);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </div>
                {item.subItems && (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedItems.includes(item.title) ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>

              {item.subItems && expandedItems.includes(item.title) && (
                <div className="ml-12 mt-2 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                        isActive(subItem.path)
                          ? 'bg-red-50 text-red-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-200 ease-in-out ${
          isSidebarOpen ? 'lg:ml-64' : ''
        }`}
      >
        {/* Top Bar */}
        <div className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src="https://via.placeholder.com/40"
                  alt="Admin"
                  className="w-10 h-10 rounded-full"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout; 