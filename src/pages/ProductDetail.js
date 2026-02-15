import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaArrowRight, FaCheck, FaTimes } from 'react-icons/fa';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../config';
import { toast } from 'react-toastify';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selImg, setSelImg] = useState(null);

  useEffect(() => {
    setLoading(true);
    getProduct(id).then(r => { setProduct(r.data); setSelImg(r.data.image); })
    .catch(() => toast.error('خطأ في تحميل المنتج'))
    .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>جاري التحميل...</p></div>;
  if (!product) return <div className="not-found"><h2>المنتج غير موجود</h2><button onClick={() => nav('/products')} className="back-btn">العودة إلى المنتجات</button></div>;

  return (
    <div className="product-detail-page">
      <div className="container">
        <motion.button className="back-button" onClick={() => nav('/products')} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ x: 5 }}>
          <FaArrowRight /> العودة إلى المنتجات
        </motion.button>
        <div className="product-detail">
          <motion.div className="product-images" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <div className="main-image">
              <img src={getImageUrl(selImg)} alt={product.name} />
              {product.featured && <span className="featured-badge">مميز</span>}
            </div>
            {product.images?.length > 0 && (
              <div className="thumbnail-images">
                <div className={`thumbnail ${selImg === product.image ? 'active' : ''}`} onClick={() => setSelImg(product.image)}><img src={getImageUrl(product.image)} alt={product.name} /></div>
                {product.images.map((img, i) => <div key={i} className={`thumbnail ${selImg === img ? 'active' : ''}`} onClick={() => setSelImg(img)}><img src={getImageUrl(img)} alt={`${product.name} ${i + 1}`} /></div>)}
              </div>
            )}
          </motion.div>
          <motion.div className="product-info-section" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="product-header"><h1>{product.nameAr || product.name}</h1><span className="product-category">{product.category}</span></div>
            <div className="product-price-section">
              <span className="price">{product.price} دج</span>
              <div className="stock-status">
                {product.stock > 0 ? <><FaCheck className="icon success" /><span className="in-stock">متوفر ({product.stock})</span></> : <><FaTimes className="icon error" /><span className="out-of-stock">غير متوفر</span></>}
              </div>
            </div>
            <div className="product-description"><h3>وصف المنتج</h3><p>{product.descriptionAr || product.description}</p></div>
            <motion.button className="add-to-cart-button" onClick={() => { addToCart(product); toast.success('تمت الإضافة!'); }} disabled={product.stock === 0} whileHover={{ scale: product.stock > 0 ? 1.05 : 1 }}>
              <FaShoppingCart /><span>{product.stock > 0 ? 'أضف إلى السلة' : 'غير متوفر'}</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
