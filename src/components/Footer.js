import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaYoutube, FaEnvelope } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const articleCategories = [
    { name: 'حملي', value: 'pregnancy' },
    { name: 'طفلي', value: 'childcare' },
    { name: 'بيتي', value: 'home' },
    { name: 'كوزينتي', value: 'recipes' },
    { name: 'مدرستي', value: 'education' },
    { name: 'تحويستي', value: 'trips' },
    { name: 'صحتي', value: 'health' },
    { name: 'ديني', value: 'religion' },
    { name: 'الأسماء', value: 'names' }
  ];

  return (
    <motion.footer
      className="footer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="footer-container">
        <motion.div className="footer-section" variants={itemVariants}>
          <h3>Maman Algérienne</h3>
          <p>مجتمعكن الآمن للحصول على النصائح والمنتجات المناسبة لكن ولعائلتكن</p>
          <div className="social-icons">
            <a href="https://www.facebook.com/MamanAlgerienne/" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com/mamanalgerienne/" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://www.youtube.com/c/mamanalgerienne" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
          </div>
        </motion.div>

        <motion.div className="footer-section" variants={itemVariants}>
          <h3>روابط سريعة</h3>
          <ul>
            <li><Link to="/">الرئيسية</Link></li>
            <li><Link to="/products">المنتجات</Link></li>
            <li><Link to="/articles">المقالات</Link></li>
          </ul>
        </motion.div>

        <motion.div className="footer-section" variants={itemVariants}>
          <h3>الأقسام</h3>
          <ul>
            {articleCategories.slice(0, 5).map((category) => (
              <li key={category.value}>
                <Link to={`/articles?category=${category.value}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div className="footer-section" variants={itemVariants}>
          <h3>تواصل معنا</h3>
          <ul className="contact-info">
            <li>
              <FaEnvelope />
              <a href="mailto:mamanalgeriennepartenariat@gmail.com">
                mamanalgeriennepartenariat@gmail.com
              </a>
            </li>
          </ul>
        </motion.div>
      </div>

      <motion.div className="footer-bottom" variants={itemVariants}>
        <p>&copy; 2024 Maman Algérienne. جميع الحقوق محفوظة.</p>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
