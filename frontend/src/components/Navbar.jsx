import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { shortenAddress } from "../utils/formatters";

const NAV_LINKS = [
  { path: "/", label: "Home" },
  { path: "/file", label: "File Complaint" },
  { path: "/my-complaints", label: "My Complaints" },
  { path: "/dashboard", label: "Dashboard" },
  { path: "/transparency", label: "Transparency" },
];

export default function Navbar({ account, isCorrectNetwork, onConnect, onSwitchNetwork, isConnecting }) {
  const location = useLocation();
  const [isLightMode, setIsLightMode] = React.useState(
    () => document.documentElement.classList.contains("light-mode")
  );

  React.useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }
  }, [isLightMode]);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">⛓️</span>
          <span className="brand-text">GrievanceChain</span>
        </Link>

        <div className="navbar-links">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-wallet">
          <button 
            onClick={() => setIsLightMode(!isLightMode)}
            className="btn btn-secondary btn-sm"
            style={{ padding: "8px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px" }}
            title="Toggle Theme"
          >
            {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          {account ? (
            <>
              {!isCorrectNetwork && (
                <button className="btn btn-danger btn-sm" onClick={onSwitchNetwork}>
                  Wrong Network
                </button>
              )}
              <div className="wallet-badge">
                <span className="wallet-dot" />
                {shortenAddress(account)}
              </div>
            </>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={onConnect}
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(6, 11, 24, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
          padding: 0 0;
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          gap: 24px;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.2rem;
          color: var(--text-white) !important;
          text-decoration: none;
        }
        .brand-icon { font-size: 1.5rem; }
        .brand-text {
          background: linear-gradient(135deg, var(--accent-saffron), var(--accent-yellow));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .navbar-links {
          display: flex;
          gap: 4px;
        }
        .nav-link {
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary) !important;
          transition: all 0.2s;
        }
        .nav-link:hover {
          color: var(--text-white) !important;
          background: rgba(255, 255, 255, 0.05);
        }
        .nav-link.active {
          color: var(--accent-saffron) !important;
          background: rgba(255, 107, 53, 0.1);
        }
        .navbar-wallet {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .wallet-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          font-family: var(--font-heading);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .wallet-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent-green);
          box-shadow: 0 0 8px var(--accent-green-glow);
        }

        @media (max-width: 768px) {
          .navbar-links { display: none; }
        }
      `}</style>
    </nav>
  );
}
