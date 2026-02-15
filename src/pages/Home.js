import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { getProducts, getArticles, getAds } from '../services/api';
import { getImageUrl } from '../config';
import ProductCard from '../components/ProductCard';
import ArticleCard from '../components/ArticleCard';
import '../styles/Home.css';

const categories = [
  { name: 'حملي', en: 'pregnancy', icon: '🤰', color: '#FFB6C1', desc: 'نصائح وإرشادات لفترة الحمل والولادة' },
  { name: 'طفلي', en: 'childcare', icon: '👶', color: '#87CEEB', desc: 'كل ما يخص رعاية الأطفال وتربيتهم' },
  { name: 'بيتي', en: 'home', icon: '🏠', color: '#98FB98', desc: 'نصائح لتدبير المنزل وتنظيمه' },
  { name: 'كوزينتي', en: 'recipes', icon: '🍳', color: '#FFD700', desc: 'وصفات لذيذة ونصائح المطبخ' },
  { name: 'مدرستي', en: 'education', icon: '📚', color: '#DDA0DD', desc: 'التعليم ومتابعة الدراسة' },
  { name: 'تحويستي', en: 'trips', icon: '✈️', color: '#F0E68C', desc: 'نزهات عائلية وعطلات ممتعة مع الأطفال' },
  { name: 'صحتي', en: 'health', icon: '💪', color: '#FFB6C1', desc: 'الصحة والعافية للأم والطفل' },
  { name: 'ديني', en: 'religion', icon: '🕌', color: '#B0E0E6', desc: 'التوجيه الديني والروحاني' },
  { name: 'الأسماء', en: 'names', icon: '👶', color: '#FFE4B5', desc: 'اختيار أسماء جميلة للمواليد ومعانيها' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [heroAds, setHeroAds] = useState([]);
  const [sponsorAds, setSponsorAds] = useState([]);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    Promise.all([
      getProducts({ featured: true }),
      getArticles({ featured: true }),
      getAds({ position: 'hero', active: true }),
      getAds({ position: 'sponsor', active: true })
    ]).then(([p, a, h, s]) => {
      setProducts(p.data.slice(0, 8));
      setArticles(a.data.slice(0, 6));
      setHeroAds(h.data);
      setSponsorAds(s.data);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (heroAds.length > 0) {
      const t = setInterval(() => setSlide(p => (p + 1) % heroAds.length), 5000);
      return () => clearInterval(t);
    }
  }, [heroAds]);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-slider">
          {heroAds.length > 0 ? heroAds.map((ad, i) => (
            <motion.div key={ad._id} className={`hero-slide ${i === slide ? 'active' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: i === slide ? 1 : 0 }} style={{ backgroundImage: `url(${getImageUrl(ad.image)})` }}>
              <div className="hero-overlay">
                <motion.div className="hero-content" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                  <h1>{ad.title}</h1>
                  {ad.link && <Link to={ad.link} className="hero-btn">اكتشف المزيد <FaArrowLeft /></Link>}
                </motion.div>
              </div>
            </motion.div>
          )) : (
            <motion.div className="hero-slide active" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="hero-overlay">
                <motion.div className="hero-content" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                  <h1>مجتمعكن الآمن للحصول على النصائح والمنتجات</h1>
                  <p>اكتشفي محتوى مخصص لكل مرحلة من مراحل الأمومة</p>
                  <div className="hero-buttons">
                    <Link to="/products" className="hero-btn primary">تسوق الآن <FaArrowLeft /></Link>
                    <Link to="/articles" className="hero-btn secondary">اقرأ المقالات</Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
        {heroAds.length > 1 && (
          <div className="slider-dots">
            {heroAds.map((_, i) => <button key={i} className={`dot ${i === slide ? 'active' : ''}`} onClick={() => setSlide(i)} />)}
          </div>
        )}
      </section>

      <section className="categories-section">
        <div className="container">
          <motion.h2 className="section-title" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>تصفحي أقسامنا</motion.h2>
          <div className="categories-grid">
            {categories.map((c, i) => (
              <motion.div key={i} className="category-card" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.05, y: -10 }} style={{ '--category-color': c.color }}>
                <Link to={`/articles?category=${c.en}`}>
                  <div className="category-icon">{c.icon}</div>
                  <h3>{c.name}</h3>
                  <p className="category-description">{c.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="featured-products-section">
        <div className="container">
          <div className="section-header">
            <motion.h2 className="section-title" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>منتجات مميزة</motion.h2>
            <Link to="/products" className="view-all-link">عرض الكل <FaArrowLeft /></Link>
          </div>
          <div className="products-grid">{products.map(p => <ProductCard key={p._id} product={p} />)}</div>
        </div>
      </section>

      <section className="featured-articles-section">
        <div className="container">
          <div className="section-header">
            <motion.h2 className="section-title" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>أحدث المقالات</motion.h2>
            <Link to="/articles" className="view-all-link">عرض الكل <FaArrowLeft /></Link>
          </div>
          <div className="articles-grid">{articles.map(a => <ArticleCard key={a._id} article={a} />)}</div>
        </div>
      </section>

      {sponsorAds.length > 0 && (
        <motion.section className="sponsor-section" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <motion.h2 className="section-title sponsor-title" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>شركاؤنا</motion.h2>
          <div className="sponsor-grid">
            {sponsorAds.map((ad, i) => (
              <motion.a key={ad._id} href={ad.link || '#'} target={ad.link ? '_blank' : '_self'} rel="noopener noreferrer" className="sponsor-card" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <img src={getImageUrl(ad.image)} alt={ad.title} />
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
