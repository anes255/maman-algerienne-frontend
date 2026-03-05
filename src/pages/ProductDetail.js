import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaArrowRight, FaCheck, FaTimes, FaShareAlt } from 'react-icons/fa';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await getProduct(id);
      setProduct(response.data);
      setSelectedImage(response.data.image);
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('خطأ في تحميل المنتج');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast.success('تمت إضافة المنتج إلى السلة!');
  };

  const getImageUrl = (image) => {
    return image.startsWith('http') ? image : `${API_BASE_URL}${image}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found">
        <h2>المنتج غير موجود</h2>
        <button onClick={() => navigate('/products')} className="back-btn">
          العودة إلى المنتجات
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Helmet>
        <title>{(product.nameAr || product.name) + ' | Maman Algérienne'}</title>
        <meta name="description" content={(product.descriptionAr || product.description || '').substring(0, 160)} />
        <meta property="og:title" content={product.nameAr || product.name} />
        <meta property="og:description" content={(product.descriptionAr || product.description || '').substring(0, 160)} />
        <meta property="og:image" content={getImageUrl(product.image)} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.nameAr || product.name} />
        <meta name="twitter:image" content={getImageUrl(product.image)} />
      </Helmet>
      <div className="container">
        <motion.button
          className="back-button"
          onClick={() => navigate('/products')}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: 5 }}
        >
          <FaArrowRight /> العودة إلى المنتجات
        </motion.button>

        <div className="product-detail">
          <motion.div
            className="product-images"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="main-image">
              <img src={getImageUrl(selectedImage)} alt={product.name} />
              {product.featured && (
                <span className="featured-badge">مميز</span>
              )}
            </div>

            {product.images && product.images.length > 0 && (
              <div className="thumbnail-images">
                <div
                  className={`thumbnail ${selectedImage === product.image ? 'active' : ''}`}
                  onClick={() => setSelectedImage(product.image)}
                >
                  <img src={getImageUrl(product.image)} alt={product.name} />
                </div>
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={getImageUrl(img)} alt={`${product.name} ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            className="product-info-section"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="product-header">
              <h1>{product.nameAr || product.name}</h1>
              <span className="product-category">{product.category}</span>
            </div>

            <div className="product-price-section">
              <span className="price">{product.price} دج</span>
              <div className="stock-status">
                {product.stock > 0 ? (
                  <>
                    <FaCheck className="icon success" />
                    <span className="in-stock">متوفر في المخزون ({product.stock})</span>
                  </>
                ) : (
                  <>
                    <FaTimes className="icon error" />
                    <span className="out-of-stock">غير متوفر</span>
                  </>
                )}
              </div>
            </div>

            <div className="product-description">
              <h3>وصف المنتج</h3>
              <p>{product.descriptionAr || product.description}</p>
            </div>

            <div className="product-actions">
              <motion.button
                className="add-to-cart-button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                whileHover={{ scale: product.stock > 0 ? 1.05 : 1 }}
                whileTap={{ scale: product.stock > 0 ? 0.95 : 1 }}
              >
                <FaShoppingCart />
                <span>{product.stock > 0 ? 'أضف إلى السلة' : 'غير متوفر'}</span>
              </motion.button>
              <button className="share-btn" onClick={function() {
                var url = window.location.href;
                var title = product.nameAr || product.name;
                if (navigator.share) {
                  navigator.share({ title: title, url: url }).catch(function() {});
                } else {
                  navigator.clipboard.writeText(url).then(function() { toast.success('تم نسخ الرابط'); }).catch(function() {});
                }
              }} title="مشاركة المنتج">
                <FaShareAlt /> مشاركة
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
