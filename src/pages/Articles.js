import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFilter } from 'react-icons/fa';
import { getArticles, getCategories } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import '../styles/Articles.css';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [articlesRes, categoriesRes] = await Promise.all([
        getArticles(),
        getCategories()
      ]);
      setArticles(articlesRes.data);
      setCategories(categoriesRes.data.articles || []);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = [...articles];
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }
    setFilteredArticles(filtered);
  };

  return (
    <div className="articles-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>مقالاتنا</h1>
        <p>اكتشفي نصائح وإرشادات مفيدة لكل مراحل الأمومة</p>
      </motion.div>

      <div className="articles-container">
        <motion.aside
          className="filters-sidebar"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="filter-section">
            <h3><FaFilter /> الفئات</h3>
            <div className="filter-options">
              <label className={selectedCategory === 'all' ? 'active' : ''}>
                <input
                  type="radio"
                  name="category"
                  value="all"
                  checked={selectedCategory === 'all'}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                />
                <span>الكل</span>
              </label>
              {categories.map((category) => (
                <label key={category} className={selectedCategory === category ? 'active' : ''}>
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>
        </motion.aside>

        <div className="articles-content">
          {loading ? (
            <div className="loading">جاري التحميل...</div>
          ) : filteredArticles.length === 0 ? (
            <div className="no-articles">
              <p>لا توجد مقالات متاحة</p>
            </div>
          ) : (
            <div className="articles-grid">
              {filteredArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Articles;
