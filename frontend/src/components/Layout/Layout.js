import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Layout.css';

function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      {/* Floating Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-3d">
              <span className="logo-text">🔄 SlotSwapper</span>
            </div>
          </div>
          
          {user && (
            <nav className="nav-menu">
              <button onClick={() => navigate('/dashboard')} className="nav-btn">
                📅 Dashboard
              </button>
              <button onClick={() => navigate('/marketplace')} className="nav-btn">
                🛒 Marketplace
              </button>
              <button onClick={() => navigate('/requests')} className="nav-btn">
                📬 Requests
              </button>
            </nav>
          )}

          {user && (
            <div className="user-section">
              <div className="user-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{user.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content page-transition-wrapper">
        <div className="content-container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>SlotSwapper</h3>
            <p>Seamless time-slot scheduling</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="/dashboard">Dashboard</a>
            <a href="/marketplace">Marketplace</a>
            <a href="/requests">Requests</a>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>support@slotswapper.com</p>
            <p>© 2025 SlotSwapper</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
