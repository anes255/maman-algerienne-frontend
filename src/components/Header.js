import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaBars, FaTimes, FaSearch, FaUser, FaSignOutAlt, FaSignInAlt, FaChevronDown } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { getCartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const categories = [
    { name: 'حملي', key: 'pregnancy', icon: '🤰' },
    { name: 'طفلي', key: 'childcare', icon: '👶' },
    { name: 'بيتي', key: 'home', icon: '🏠' },
    { name: 'كوزينتي', key: 'recipes', icon: '🍳' },
    { name: 'مدرستي', key: 'education', icon: '📚' },
    { name: 'تحويستي', key: 'trips', icon: '✈️' },
    { name: 'صحتي', key: 'health', icon: '💪' },
    { name: 'ديني', key: 'religion', icon: '🕌' },
    { name: 'الأسماء', key: 'names', icon: '👶' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isMobile = window.innerWidth <= 768;
      
      setIsScrolled(currentScrollY > 50);
      
      if (isMobile) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsHidden(true);
        } else {
          setIsHidden(false);
        }
      } else {
        setIsHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const menuItems = [
    { name: 'الرئيسية', nameEn: 'Home', path: '/' },
    { name: 'المنتجات', nameEn: 'Products', path: '/products' },
    { name: 'المقالات', nameEn: 'Articles', path: '/articles' },
    { name: 'التحميلات', nameEn: 'Downloads', path: '/links' },
  ];

  return (
    <header
      className={`header ${isScrolled ? 'scrolled' : ''} ${isHidden ? 'hidden' : ''}`}
    >
      <div className="header-container">
        <Link to="/" className="logo">
          {theme.logoImage ? (
            <img src={`${API_BASE_URL}${theme.logoImage}`} alt={theme.logoText} />
          ) : (
            <h1>{theme.logoText}</h1>
          )}
        </Link>

        <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                className="nav-link"
                onClick={() => { setIsMobileMenuOpen(false); setIsCategoriesOpen(false); }}
              >
                <span className="ar">{item.name}</span>
                <span className="en">{item.nameEn}</span>
              </Link>
            </motion.div>
          ))}

          {/* Categories dropdown in mobile menu */}
          <div className="mobile-categories-section">
            <button
              className="mobile-categories-toggle"
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            >
              <span>📂 الأقسام</span>
              <FaChevronDown className={`chevron ${isCategoriesOpen ? 'open' : ''}`} />
            </button>
            <AnimatePresence>
              {isCategoriesOpen && (
                <motion.div
                  className="mobile-categories-list"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat.key}
                      to={`/articles?category=${cat.key}`}
                      className="mobile-category-link"
                      onClick={() => { setIsMobileMenuOpen(false); setIsCategoriesOpen(false); }}
                    >
                      <span className="mobile-cat-icon">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="header-actions">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="ابحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <FaSearch />
            </button>
          </form>

          <Link to="/cart" className="cart-icon">
            <FaShoppingCart />
            {getCartCount() > 0 && (
              <motion.span
                className="cart-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                {getCartCount()}
              </motion.span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="user-menu">
              <button 
                className="user-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <FaUser />
                <span>{user?.fullName?.split(' ')[0]}</span>
              </button>
              {showUserMenu && (
                <motion.div
                  className="user-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="user-email">{user?.phoneNumber}</p>
                  {user?.isAdmin && (
                    <Link to="/admin" onClick={() => setShowUserMenu(false)}>
                      لوحة التحكم
                    </Link>
                  )}
                  <button onClick={handleLogout}>
                    <FaSignOutAlt /> تسجيل الخروج
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              <FaSignInAlt />
              <span>دخول</span>
            </Link>
          )}

          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
