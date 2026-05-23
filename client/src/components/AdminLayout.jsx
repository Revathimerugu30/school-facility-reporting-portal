import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { BellIcon, ChartBarIcon, DocumentTextIcon, ShieldCheckIcon, UsersIcon, Cog8ToothIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { getSocket } from '../api/socket.js';
import api from '../api/api.js';
import NotificationPanel from '../components/NotificationPanel.jsx';

const links = [
  { to: '/admin', label: 'Dashboard', icon: ChartBarIcon },
  { to: '/admin/manage', label: 'Manage Issues', icon: DocumentTextIcon },
  { to: '/admin/analytics', label: 'Analytics', icon: ShieldCheckIcon },
  { to: '/admin/notifications', label: 'Notifications', icon: BellIcon },
  { to: '/admin/users', label: 'Users Management', icon: UsersIcon },
  { to: '/admin/settings', label: 'Settings', icon: Cog8ToothIcon },
];

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const socket = getSocket();

    const syncUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await api.get('/auth/me');
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    };

    syncUser();

    const userData = localStorage.getItem('user');
    if (userData) {
      const currentUser = JSON.parse(userData);
      if (currentUser?.id) {
        socket.emit('join', { userId: currentUser.id });
      }
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
        <aside className="bg-white border-r border-slate-200 p-6">
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-slate-900">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-slate-500">Control center for issue tracking and repairs.</p>
          </div>

          <nav className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
                      isActive ? 'bg-sky-100 text-sky-700' : 'text-slate-700 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          <button onClick={logout} className="mt-8 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            <ArrowLeftOnRectangleIcon className="mr-2 inline h-5 w-5" />
            Logout
          </button>
        </aside>

        <main className="p-6">
          <div className="flex items-center justify-end gap-4 mb-4">
            <NotificationPanel />
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
