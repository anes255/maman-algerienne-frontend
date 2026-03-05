import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { getProducts, getArticles, getAds } from '../services/api';
import ProductCard from '../components/ProductCard';
import ArticleCard from '../components/ArticleCard';
import '../styles/Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [heroAds, setHeroAds] = useState([]);
  const [sponsorAds, setSponsorAds] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

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
      const [productsRes, articlesRes, heroAdsRes, sponsorAdsRes] = await Promise.all([
        getProducts({ featured: true }),
        getArticles({ featured: true }),
        getAds({ position: 'hero', active: true }),
        getAds({ position: 'sponsor', active: true })
      ]);
      setFeaturedProducts(productsRes.data.slice(0, 8));
      setFeaturedArticles(articlesRes.data.slice(0, 6));
      setHeroAds(heroAdsRes.data);
      setSponsorAds(sponsorAdsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const categories = [
    { name: 'حملي', nameEn: 'Pregnancy', icon: '🤰', color: '#FFB6C1', description: 'نصائح وإرشادات لفترة الحمل والولادة' },
    { name: 'طفلي', nameEn: 'Childcare', icon: '👶', color: '#87CEEB', description: 'كل ما يخص رعاية الأطفال وتربيتهم' },
    { name: 'بيتي', nameEn: 'Home', icon: '🏠', color: '#98FB98', description: 'نصائح لتدبير المنزل وتنظيمه' },
    { name: 'كوزينتي', nameEn: 'Recipes', icon: '🍳', color: '#FFD700', description: 'وصفات لذيذة ونصائح المطبخ' },
    { name: 'مدرستي', nameEn: 'Education', icon: '📚', color: '#DDA0DD', description: 'التعليم ومتابعة الدراسة' },
    { name: 'تحويستي', nameEn: 'Trips', icon: '✈️', color: '#F0E68C', description: 'نزهات عائلية وعطلات ممتعة مع الأطفال' },
    { name: 'صحتي', nameEn: 'Health', icon: '💪', color: '#FFB6C1', description: 'الصحة والعافية للأم والطفل' },
    { name: 'ديني', nameEn: 'Religion', icon: '🕌', color: '#B0E0E6', description: 'التوجيه الديني والروحاني' },
    { name: 'الأسماء', nameEn: 'Names', icon: '👶', color: '#FFE4B5', description: 'اختيار أسماء جميلة للمواليد ومعانيها' },
  ];

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
                  backgroundImage: `url(${API_BASE_URL}${ad.image})`
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
            <motion.div
              className="hero-slide active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="hero-overlay">
                <motion.div
                  className="hero-content"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1>مجتمعكن الآمن للحصول على النصائح والمنتجات</h1>
                  <p>اكتشفي محتوى مخصص لكل مرحلة من مراحل الأمومة</p>
                  <div className="hero-buttons">
                    <Link to="/products" className="hero-btn primary">
                      تسوق الآن
                      <FaArrowLeft />
                    </Link>
                    <Link to="/articles" className="hero-btn secondary">
                      اقرأ المقالات
                    </Link>
                    <Link to="/links" className="hero-btn secondary">
                      التحميلات
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
        {heroAds.length > 1 && (
          <div className="slider-dots">
            {heroAds.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            تصفحي أقسامنا
          </motion.h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                className="category-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                style={{ '--category-color': category.color }}
              >
                <Link to={`/articles?category=${category.nameEn.toLowerCase()}`}>
                  <div className="category-icon">{category.icon}</div>
                  <h3>{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products-section">
        <div className="container">
          <div className="section-header">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              منتجات مميزة
            </motion.h2>
            <Link to="/products" className="view-all-link">
              عرض الكل
              <FaArrowLeft />
            </Link>
          </div>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="featured-articles-section">
        <div className="container">
          <div className="section-header">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              أحدث المقالات
            </motion.h2>
            <Link to="/articles" className="view-all-link">
              عرض الكل
              <FaArrowLeft />
            </Link>
          </div>
          <div className="articles-grid">
            {featuredArticles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Sponsor Ads Section */}
      {sponsorAds.length > 0 && (
        <motion.section
          className="sponsor-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="section-title sponsor-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            شركاؤنا
          </motion.h2>
          <div className="sponsor-grid">
            {sponsorAds.map((ad, index) => (
              <motion.a
                key={ad._id}
                href={ad.link || '#'}
                target={ad.link ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="sponsor-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={`${API_BASE_URL}${ad.image}`}
                  alt={ad.title}
                />
                <div className="sponsor-overlay">
                  <h3>{ad.title}</h3>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default Home;
