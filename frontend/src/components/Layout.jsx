import { Link, Outlet, useLocation } from 'react-router-dom';
import { Shield, FileWarning, Eye, LayoutDashboard, BarChart3 } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Shield },
    { name: 'File Complaint', path: '/file', icon: FileWarning },
    { name: 'Track', path: '/track', icon: Eye },
    { name: 'Officials', path: '/official', icon: LayoutDashboard },
    { name: 'Stats', path: '/stats', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-dark-900 text-slate-200">
      <nav className="sticky top-0 z-50 glass-card rounded-none border-b border-dark-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 border-r border-dark-700/50 pr-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Grievance<span className="text-primary-500">Chain</span></span>
            </Link>
            
            <div className="hidden md:block flex-1 ml-6">
              <div className="flex items-baseline space-x-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-primary-500/10 text-primary-400' : 'text-slate-400 hover:bg-dark-800 hover:text-slate-200'}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
