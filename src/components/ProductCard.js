import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../config';
import { toast } from 'react-toastify';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success('تمت إضافة المنتج إلى السلة!');
  };

  return (
    <motion.div className="product-card" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -10 }} transition={{ duration: 0.3 }}>
      <Link to={`/products/${product._id}`} className="product-card-link">
        <div className="product-image">
          <img src={getImageUrl(product.image)} alt={product.name} />
          {product.featured && <motion.span className="featured-badge" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>مميز</motion.span>}
          <div className="product-overlay"><motion.button className="overlay-btn" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><FaEye /></motion.button></div>
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.nameAr || product.name}</h3>
          <p className="product-category">{product.category}</p>
          <div className="product-footer">
            <span className="product-price">{product.price} دج</span>
            <motion.button className="add-to-cart-btn" onClick={handleAdd} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <FaShoppingCart /><span>أضف للسلة</span>
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
