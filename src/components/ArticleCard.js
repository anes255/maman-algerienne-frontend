import { API_BASE_URL } from '../config';
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendar, FaEye, FaArrowLeft } from 'react-icons/fa';
import '../styles/ArticleCard.css';

const ArticleCard = ({ article }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ar-DZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      className="article-card"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/articles/${article._id}`}>
        <div className="article-image">
          <img
            src={article.image.startsWith('http') ? article.image : `${API_BASE_URL}${article.image}`}
            alt={article.title}
          />
          {article.featured && (
            <motion.span
              className="featured-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              مميز
            </motion.span>
          )}
          <div className="article-overlay">
            <span className="article-category">{article.category}</span>
          </div>
        </div>

        <div className="article-content">
          <h3 className="article-title">{article.titleAr || article.title}</h3>
          <p className="article-excerpt">
            {(article.contentAr || article.content).substring(0, 120)}...
          </p>

          <div className="article-meta">
            <div className="meta-item">
              <FaCalendar />
              <span>{formatDate(article.createdAt)}</span>
            </div>
            <div className="meta-item">
              <FaEye />
              <span>{article.views || 0} مشاهدة</span>
            </div>
          </div>

          <motion.div
            className="read-more"
            whileHover={{ x: -5 }}
          >
            <span>اقرأ المزيد</span>
            <FaArrowLeft />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ArticleCard;
