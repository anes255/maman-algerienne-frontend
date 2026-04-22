import { API_BASE_URL } from '../config';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getProducts, getArticles, getAds } from '../services/api';
import ProductCard from '../components/ProductCard';
import ArticleCard from '../components/ArticleCard';
import '../styles/Home.css';

/* ── Reusable horizontal carousel ── */
const HorizontalCarousel = ({ children, autoScrollInterval = 30000 }) => {
  const trackRef = useRef(null);
  const timerRef = useRef(null);

  const getScrollAmount = () => {
    if (!trackRef.current) return 440;
    var firstChild = trackRef.current.querySelector('.carousel-item');
    if (!firstChild) return 440;
    return (firstChild.offsetWidth + 20) * 2; // 2 cards at a time
  };

  const scroll = useCallback((dir) => {
    if (!trackRef.current) return;
    var amount = getScrollAmount();
    trackRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  }, []);

  const autoScroll = useCallback(() => {
    if (!trackRef.current) return;
    var el = trackRef.current;
    var maxScroll = el.scrollWidth - el.clientWidth;
    // If at end, scroll back to start
    if (el.scrollLeft >= maxScroll - 10) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      scroll('right');
    }
  }, [scroll]);

  useEffect(() => {
    timerRef.current = setInterval(autoScroll, autoScrollInterval);
    return () => clearInterval(timerRef.current);
  }, [autoScroll, autoScrollInterval]);

  // Pause on hover
  const pause = () => clearInterval(timerRef.current);
  const resume = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(autoScroll, autoScrollInterval);
  };

  return (
    <div className="carousel-wrapper" onMouseEnter={pause} onMouseLeave={resume}>
      <button className="carousel-arrow carousel-arrow-right" onClick={() => scroll('right')}><FaChevronRight /></button>
      <button className="carousel-arrow carousel-arrow-left" onClick={() => scroll('left')}><FaChevronLeft /></button>
      <div className="carousel-track" ref={trackRef}>
        {React.Children.map(children, (child, i) => (
          <div className="carousel-item" key={i}>{child}</div>
        ))}
      </div>
    </div>
  );
};

// Cache helpers - show cached data instantly, refresh in background
const CACHE_KEY = 'home_cache';
const getCache = () => { try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch(e) { return {}; } };
const setCache = (key, data) => { try { var c = getCache(); c[key] = data; localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch(e) {} };

const Home = () => {
  // Load from cache immediately so page renders with real data on return visits
  const cached = getCache();
  const [featuredProducts, setFeaturedProducts] = useState(cached.featuredProducts || []);
  const [featuredArticles, setFeaturedArticles] = useState(cached.featuredArticles || []);
  const [allArticles, setAllArticles] = useState(cached.allArticles || []);
  const [heroAds, setHeroAds] = useState(cached.heroAds || []);
  const [sponsorAds, setSponsorAds] = useState(cached.sponsorAds || []);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [productsLoaded, setProductsLoaded] = useState(cached.featuredProducts ? true : false);
  const [articlesLoaded, setArticlesLoaded] = useState(cached.featuredArticles ? true : false);

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (heroAds.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroAds.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [heroAds]);

  const loadData = async () => {
    try {
      // Fire all requests simultaneously - each updates its section independently
      getAds({ position: 'hero', active: true }).then(res => {
        var d = Array.isArray(res.data) ? res.data : [];
        setHeroAds(d); setCache('heroAds', d);
      }).catch(() => {});

      getProducts({ featured: true }).then(res => {
        var d = Array.isArray(res.data) ? res.data.slice(0, 12) : [];
        setFeaturedProducts(d); setProductsLoaded(true); setCache('featuredProducts', d);
      }).catch(() => setProductsLoaded(true));

      getArticles().then(res => {
        var d = Array.isArray(res.data) ? res.data : [];
        setAllArticles(d); setCache('allArticles', d);
        setFeaturedArticles(d.filter(a => a.featured).slice(0, 6));
        setArticlesLoaded(true);
        setCache('featuredArticles', d.filter(a => a.featured).slice(0, 6));
      }).catch(() => setArticlesLoaded(true));

      getAds({ position: 'sponsor', active: true }).then(res => {
        var d = Array.isArray(res.data) ? res.data : [];
        setSponsorAds(d); setCache('sponsorAds', d);
      }).catch(() => {});
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const categories = [
    { name: 'حملي', key: 'pregnancy', icon: '🤰', color: '#FFB6C1' },
    { name: 'طفلي', key: 'childcare', icon: '👶', color: '#87CEEB' },
    { name: 'بيتي', key: 'home', icon: '🏠', color: '#98FB98' },
    { name: 'كوزينتي', key: 'recipes', icon: '🍳', color: '#FFD700' },
    { name: 'مدرستي', key: 'education', icon: '📚', color: '#DDA0DD' },
    { name: 'تحويستي', key: 'trips', icon: '✈️', color: '#F0E68C' },
    { name: 'صحتي', key: 'health', icon: '💪', color: '#FFB6C1' },
    { name: 'ديني', key: 'religion', icon: '🕌', color: '#B0E0E6' },
    { name: 'الأسماء', key: 'names', icon: '👶', color: '#FFE4B5' },
  ];

  // Group articles by category
  const categoryArticles = {};
  categories.forEach(function(cat) {
    var arts = allArticles.filter(function(a) { return a.category === cat.key; });
    if (arts.length > 0) categoryArticles[cat.key] = arts;
  });

  return (
    <div className="home-page">
      {/* Hero Section with Slider */}
      <section className="hero-section">
        <div className="hero-slider">
          {heroAds.length > 0 ? (
            heroAds.map((ad, index) => (
              <motion.div
                key={ad._id}
                className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentSlide ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  backgroundImage: `url(${ad.image && ad.image.startsWith('http') ? ad.image : API_BASE_URL + ad.image})`
                }}
              >
                <div className="hero-overlay">
                  <motion.div
                    className="hero-content"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h1>{ad.title}</h1>
                    {ad.link && (
                      <Link to={ad.link} className="hero-btn">
                        اكتشف المزيد
                        <FaArrowLeft />
                      </Link>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div className="hero-slide active" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="hero-overlay">
                <motion.div className="hero-content" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                  <h1>مجتمعكن الآمن للحصول على النصائح والمنتجات</h1>
                  <p>اكتشفي محتوى مخصص لكل مرحلة من مراحل الأمومة</p>
                  <div className="hero-buttons">
                    <Link to="/products" className="hero-btn primary">تسوق الآن <FaArrowLeft /></Link>
                    <Link to="/articles" className="hero-btn secondary">اقرأ المقالات</Link>
                    <Link to="/links" className="hero-btn secondary">التحميلات</Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
        {heroAds.length > 1 && (
          <div className="slider-dots">
            {heroAds.map((_, index) => (
              <button key={index} className={`dot ${index === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(index)} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Products - Horizontal Carousel */}
      <section className="featured-products-section">
        <div className="container">
          <div className="section-header">
            <motion.h2 className="section-title" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              منتجات مميزة
            </motion.h2>
            <Link to="/products" className="view-all-link">عرض الكل <FaArrowLeft /></Link>
          </div>
          {!productsLoaded ? (
            <div className="skeleton-carousel">
              {[1,2,3,4].map(i => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-img"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <HorizontalCarousel autoScrollInterval={5000}>
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </HorizontalCarousel>
          ) : null}
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="featured-articles-section">
        <div className="container">
          <div className="section-header">
            <motion.h2 className="section-title" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              أحدث المقالات
            </motion.h2>
            <Link to="/articles" className="view-all-link">عرض الكل <FaArrowLeft /></Link>
          </div>
          {!articlesLoaded ? (
            <div className="articles-grid">
              {[1,2,3].map(i => (
                <div key={i} className="skeleton-card skeleton-article">
                  <div className="skeleton-img tall"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              ))}
            </div>
          ) : featuredArticles.length > 0 ? (
            <div className="articles-grid">
              {featuredArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Category Article Carousels */}
      {categories.map(function(cat) {
        var arts = categoryArticles[cat.key];
        if (!arts || arts.length === 0) return null;
        return (
          <section className="category-articles-section" key={cat.key} style={{ '--cat-color': cat.color }}>
            <div className="container">
              <div className="section-header">
                <motion.h2 className="section-title category-section-title" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <span className="cat-icon-badge" style={{ background: cat.color }}>{cat.icon}</span>
                  {cat.name}
                </motion.h2>
                <Link to={`/articles?category=${cat.key}`} className="view-all-link">عرض الكل <FaArrowLeft /></Link>
              </div>
              <HorizontalCarousel autoScrollInterval={5000}>
                {arts.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </HorizontalCarousel>
            </div>
          </section>
        );
      })}

      {/* Sponsor Ads Section */}
      {sponsorAds.length > 0 && (
        <motion.section className="sponsor-section" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <motion.h2 className="section-title sponsor-title" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            شركاؤنا
          </motion.h2>
          <div className="sponsor-grid">
            {sponsorAds.map((ad, index) => (
              <motion.a key={ad._id} href={ad.link || '#'} target={ad.link ? '_blank' : '_self'} rel="noopener noreferrer" className="sponsor-card" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.02 }}>
                <img src={`${API_BASE_URL}${ad.image}`} alt={ad.title} />
                <div className="sponsor-overlay"><h3>{ad.title}</h3></div>
              </motion.a>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default Home;
