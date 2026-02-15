import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaBars, FaTimes, FaSearch, FaUser, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { API_BASE_URL } from '../config';
import '../styles/Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [userMenu, setUserMenu] = useState(false);
  const { getCartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();
  const nav = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      if (window.innerWidth <= 768) {
        setHidden(y > lastY && y > 100);
      } else {
        setHidden(false);
      }
      setLastY(y);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY]);

  const doSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { nav(`/search?q=${search}`); setSearch(''); }
  };

  const doLogout = () => { logout(); setUserMenu(false); nav('/'); };

  const links = [
    { name: 'الرئيسية', path: '/' },
    { name: 'المنتجات', path: '/products' },
    { name: 'المقالات', path: '/articles' },
  ];

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''} ${hidden ? 'hidden' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          {theme.logoImage ? (
            <img src={`${API_BASE_URL}${theme.logoImage}`} alt={theme.logoText} />
          ) : (
            <h1>{theme.logoText}</h1>
          )}
        </Link>

        <nav className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          {links.map((l, i) => (
            <motion.div key={l.path} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link to={l.path} className="nav-link" onClick={() => setMenuOpen(false)}>{l.name}</Link>
            </motion.div>
          ))}
        </nav>

        <div className="header-actions">
          <form onSubmit={doSearch} className="search-form">
            <input type="text" placeholder="ابحث..." value={search} onChange={e => setSearch(e.target.value)} />
            <button type="submit"><FaSearch /></button>
          </form>

          <Link to="/cart" className="cart-icon">
            <FaShoppingCart />
            {getCartCount() > 0 && (
              <motion.span className="cart-badge" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}>
                {getCartCount()}
              </motion.span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="user-menu">
              <button className="user-btn" onClick={() => setUserMenu(!userMenu)}>
                <FaUser /><span>{user?.fullName?.split(' ')[0]}</span>
              </button>
              {userMenu && (
                <motion.div className="user-dropdown" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="user-email">{user?.phoneNumber}</p>
                  {user?.isAdmin && <Link to="/admin" onClick={() => setUserMenu(false)}>لوحة التحكم</Link>}
                  <button onClick={doLogout}><FaSignOutAlt /> تسجيل الخروج</button>
                </motion.div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn"><FaSignInAlt /><span>دخول</span></Link>
          )}

          <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
