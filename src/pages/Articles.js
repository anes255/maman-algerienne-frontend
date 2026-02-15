import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFilter } from 'react-icons/fa';
import { getArticles, getCategories } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import '../styles/Articles.css';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [cats, setCats] = useState([]);
  const [selCat, setSelCat] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getArticles(), getCategories()]).then(([a, c]) => { setArticles(a.data); setCats(c.data.articles || []); })
    .catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFiltered(selCat === 'all' ? articles : articles.filter(a => a.category === selCat));
  }, [articles, selCat]);

  return (
    <div className="articles-page">
      <motion.div className="page-header" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
        <h1>مقالاتنا</h1><p>اكتشفي نصائح وإرشادات مفيدة لكل مراحل الأمومة</p>
      </motion.div>
      <div className="articles-container">
        <motion.aside className="filters-sidebar" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <div className="filter-section">
            <h3><FaFilter /> الفئات</h3>
            <div className="filter-options">
              <label className={selCat === 'all' ? 'active' : ''}><input type="radio" name="cat" value="all" checked={selCat === 'all'} onChange={e => setSelCat(e.target.value)} /><span>الكل</span></label>
              {cats.map(c => <label key={c} className={selCat === c ? 'active' : ''}><input type="radio" name="cat" value={c} checked={selCat === c} onChange={e => setSelCat(e.target.value)} /><span>{c}</span></label>)}
            </div>
          </div>
        </motion.aside>
        <div className="articles-content">
          {loading ? <div className="loading">جاري التحميل...</div> : filtered.length === 0 ? <div className="no-articles"><p>لا توجد مقالات متاحة</p></div> : (
            <div className="articles-grid">{filtered.map(a => <ArticleCard key={a._id} article={a} />)}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Articles;
