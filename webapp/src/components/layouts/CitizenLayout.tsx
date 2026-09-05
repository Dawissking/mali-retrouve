import { NavLink, Outlet, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../../components/ui/Logo";
import { useState } from "react";

const navItems = [
  { to: "/declarations", label: "Mes déclarations", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { to: "/declarations/new", label: "Nouvelle déclaration", icon: "M12 4v16m8-8H4" },
  { to: "/matches", label: "Correspondances", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-4.272C3.256 14.566 3 13.295 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { to: "/notifications", label: "Notifications", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
  { to: "/profile", label: "Profil", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
];

export default function CitizenLayout({ children }: { children?: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-50/30 to-mali-beige/50 transition-colors duration-500">
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-6">
              <NavLink to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 text-brand-500 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Logo />
                </div>
                <span className="text-xl font-bold text-gray-900 transition-colors">Mali Retrouvé</span>
              </NavLink>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                      isActive ? "bg-brand-50 text-brand-700 shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )
                  }
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 hidden lg:block">
                {user?.citizenProfile ? `${user.citizenProfile.firstName} ${user.citizenProfile.lastName}` : user?.phoneE164}
              </span>
              <button onClick={logout} className="hidden sm:inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-300">
                Déconnexion
              </button>
              <button
                className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "block px-3 py-2 rounded-xl text-base font-medium",
                       isActive ? "bg-brand-50 text-brand-700" : "text-gray-600 hover:bg-gray-50"
                    )
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              <button onClick={logout} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl">
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </div>
  );
}

