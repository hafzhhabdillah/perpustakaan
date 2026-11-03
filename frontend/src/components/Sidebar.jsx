import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  BookCopy,
  Layers,
  Users,
  Globe,
  Sparkles,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', to: 'home', icon: LayoutDashboard },
  { name: 'Discover Books', to: 'catalog', icon: BookCopy },
  { name: 'My Collection', to: 'my-collection', icon: Layers },
  { name: 'Favorites', to: 'favorites', icon: Heart },
  { name: 'Categories', to: 'categories', icon: Layers },
  { name: 'AI Book Assistant', to: 'ai-advisor', icon: Sparkles },
  { name: 'Settings', to: 'settings', icon: Settings },
];

const adminItems = [
  { name: 'Manage Books', to: 'admin-books', icon: BookCopy },
  { name: 'Manage Categories', to: 'admin-categories', icon: Layers },
  { name: 'Manage Users', to: 'admin-users', icon: Users },
  { name: 'Reports', to: 'admin-reports', icon: Globe },
];

export default function Sidebar() {
  const { isAdmin, logout } = useAuth();
  const { toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-primary-900 text-white transition-width duration-300 flex flex-col h-screen fixed inset-y-0 left-0 z-20 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && <span className="text-xl font-heading font-semibold">Libraria</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-primary-800 transition-default"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 hover:bg-primary-800 transition-default ${
                isActive ? 'bg-primary-800 font-medium' : ''
              }`
            }
          >
            <item.icon className="mr-3" size={18} />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
        {isAdmin && (
          <>
            <hr className="border-neutral-700 my-2 mx-4" />
            {adminItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 hover:bg-primary-800 transition-default ${
                    isActive ? 'bg-primary-800 font-medium' : ''
                  }`
                }
              >
                <item.icon className="mr-3" size={18} />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-primary-800">
        <button
          onClick={toggleTheme}
          className="flex items-center w-full p-2 rounded hover:bg-primary-800 transition-default"
        >
          <span className="mr-2">🌓</span>
          {!collapsed && <span>Toggle Theme</span>}
        </button>
        <button
          onClick={logout}
          className="flex items-center w-full p-2 mt-2 rounded hover:bg-primary-800 transition-default"
        >
          <LogOut size={16} className="mr-2" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

