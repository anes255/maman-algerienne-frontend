import { API_BASE_URL } from '../config';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome, FaBox, FaNewspaper, FaAd, FaShoppingCart,
  FaPalette, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaChartLine, FaDownload
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  getProducts, createProduct, updateProduct, deleteProduct,
  getArticles, createArticle, updateArticle, deleteArticle,
  getAds, createAd, updateAd, deleteAd,
  getOrders, updateOrder, deleteOrder,
  getTheme, updateTheme,
  getStats,
  getLinks, createLink, updateLink, deleteLink
} from '../services/api';
import ArticleEditor from '../components/ArticleEditor';
import '../styles/Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [ads, setAds] = useState([]);
  const [orders, setOrders] = useState([]);
  const [theme, setTheme] = useState({});
  const [links, setLinks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentItem, setCurrentItem] = useState(null);
  const [contentBlocks, setContentBlocks] = useState([]);
  const [uploadedContentImages, setUploadedContentImages] = useState([]);

  // Article categories
  const articleCategories = [
    { value: 'pregnancy', label: 'حملي - نصائح وإرشادات لفترة الحمل والولادة', icon: '🤰' },
    { value: 'childcare', label: 'طفلي - كل ما يخص رعاية الأطفال وتربيتهم', icon: '👶' },
    { value: 'home', label: 'بيتي - نصائح لتدبير المنزل وتنظيمه', icon: '🏠' },
    { value: 'recipes', label: 'كوزينتي - وصفات لذيذة ونصائح المطبخ', icon: '🍳' },
    { value: 'education', label: 'مدرستي - التعليم ومتابعة الدراسة', icon: '📚' },
    { value: 'trips', label: 'تحويستي - نزهات عائلية وعطلات ممتعة', icon: '✈️' },
    { value: 'health', label: 'صحتي - الصحة والعافية للأم والطفل', icon: '💪' },
    { value: 'religion', label: 'ديني - التوجيه الديني والروحاني', icon: '🕌' },
    { value: 'names', label: 'الأسماء - اختيار أسماء جميلة للمواليد ومعانيها', icon: '👶' }
  ];

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      switch (activeTab) {
        case 'dashboard':
          const statsRes = await getStats();
          setStats(statsRes.data);
          break;
        case 'products':
          const productsRes = await getProducts();
          setProducts(productsRes.data);
          break;
        case 'articles':
          const articlesRes = await getArticles();
          setArticles(articlesRes.data);
          break;
        case 'ads':
          const adsRes = await getAds();
          setAds(adsRes.data);
          break;
        case 'orders':
          const ordersRes = await getOrders();
          setOrders(ordersRes.data);
          break;
        case 'theme':
          const themeRes = await getTheme();
          setTheme(themeRes.data);
          break;
        case 'links':
          const linksRes = await getLinks();
          setLinks(linksRes.data);
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('خطأ في تحميل البيانات');
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setCurrentItem(null);
    setContentBlocks([]);
    setUploadedContentImages([]);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setModalMode('edit');
    setCurrentItem(item);
    setContentBlocks(item.contentBlocks || []);
    
    // Convert server image paths to full URLs for display
    const images = item.contentImages ? item.contentImages.map(img => {
      // If it's already a full URL (blob or http), use it; otherwise prepend server URL
      return img.startsWith('blob:') || img.startsWith('http') ? img : `${API_BASE_URL}${img}`;
    }) : [];
    setUploadedContentImages(images);
    
    setShowModal(true);
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('هل أنت متأكد من الحذف؟')) return;

    try {
      switch (type) {
        case 'product':
          await deleteProduct(id);
          break;
        case 'article':
          await deleteArticle(id);
          break;
        case 'ad':
          await deleteAd(id);
          break;
        case 'order':
          await deleteOrder(id);
          break;
      }
      toast.success('تم الحذف بنجاح');
      loadData();
    } catch (error) {
      toast.error('خطأ في الحذف');
    }
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Add content blocks for articles
    if (type === 'article' && contentBlocks.length > 0) {
      // Replace blob URLs with index markers so server can map them to Cloudinary URLs
      const blobUrls = uploadedContentImages.filter(u => u.startsWith('blob:'));
      const processedBlocks = contentBlocks.map(block => {
        if (block.type === 'image' && block.imageUrl && block.imageUrl.startsWith('blob:')) {
          const blobIdx = blobUrls.indexOf(block.imageUrl);
          return { ...block, _blobIdx: blobIdx };
        }
        return block;
      });
      formData.append('contentBlocks', JSON.stringify(processedBlocks));
    }

    try {
      if (modalMode === 'create') {
        switch (type) {
          case 'product':
            await createProduct(formData);
            break;
          case 'article':
            await createArticle(formData);
            break;
          case 'ad':
            await createAd(formData);
            break;
          case 'link':
            await createLink(formData);
            break;
        }
        toast.success('تم الإضافة بنجاح');
      } else {
        switch (type) {
          case 'product':
            await updateProduct(currentItem._id, formData);
            break;
          case 'article':
            await updateArticle(currentItem._id, formData);
            break;
          case 'ad':
            await updateAd(currentItem._id, formData);
            break;
          case 'link':
            await updateLink(currentItem._id, formData);
            break;
        }
        toast.success('تم التحديث بنجاح');
      }
      setShowModal(false);
      setContentBlocks([]);
      setUploadedContentImages([]);
      loadData();
    } catch (error) {
      toast.error('حدث خطأ');
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      toast.success('تم تحديث حالة الطلب');
      loadData();
    } catch (error) {
      toast.error('خطأ في التحديث');
    }
  };

  const handleThemeUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const response = await updateTheme(formData);
      setTheme(response.data);
      toast.success('تم تحديث المظهر بنجاح');
      window.location.reload(); // Reload to apply theme
    } catch (error) {
      toast.error('خطأ في تحديث المظهر');
    }
  };

  const handleContentImagesUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Create temporary URLs for preview
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedContentImages(prev => [...prev, ...imageUrls]);
    }
  };

  const handleBlocksChange = useCallback((newBlocks) => {
    setContentBlocks(newBlocks);
  }, []);

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>لوحة التحكم</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaChartLine /> الإحصائيات
          </button>
          <button
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            <FaBox /> المنتجات
          </button>
          <button
            className={activeTab === 'articles' ? 'active' : ''}
            onClick={() => setActiveTab('articles')}
          >
            <FaNewspaper /> المقالات
          </button>
          <button
            className={activeTab === 'ads' ? 'active' : ''}
            onClick={() => setActiveTab('ads')}
          >
            <FaAd /> الإعلانات
          </button>
          <button
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            <FaShoppingCart /> الطلبات
          </button>
          <button
            className={activeTab === 'theme' ? 'active' : ''}
            onClick={() => setActiveTab('theme')}
          >
            <FaPalette /> المظهر
          </button>
          <button
            className={activeTab === 'links' ? 'active' : ''}
            onClick={() => setActiveTab('links')}
          >
            <FaDownload /> التحميلات
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="dashboard-stats"
            >
              <h1>الإحصائيات</h1>
              <div className="stats-grid">
                <div className="stat-card">
                  <FaBox className="stat-icon" />
                  <h3>{stats.products || 0}</h3>
                  <p>المنتجات</p>
                </div>
                <div className="stat-card">
                  <FaNewspaper className="stat-icon" />
                  <h3>{stats.articles || 0}</h3>
                  <p>المقالات</p>
                </div>
                <div className="stat-card">
                  <FaShoppingCart className="stat-icon" />
                  <h3>{stats.orders || 0}</h3>
                  <p>الطلبات</p>
                </div>
                <div className="stat-card">
                  <FaChartLine className="stat-icon" />
                  <h3>{stats.revenue || 0} دج</h3>
                  <p>الإيرادات</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="section-header">
                <h1>إدارة المنتجات</h1>
                <button className="add-btn" onClick={handleCreate}>
                  <FaPlus /> إضافة منتج
                </button>
              </div>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>الصورة</th>
                      <th>الاسم</th>
                      <th>السعر</th>
                      <th>الفئة</th>
                      <th>المخزون</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <img
                            src={product.image.startsWith('http') ? product.image : `${API_BASE_URL}${product.image}`}
                            alt={product.name}
                            className="table-image"
                          />
                        </td>
                        <td>{product.name}</td>
                        <td>{product.price} دج</td>
                        <td>{product.category}</td>
                        <td>{product.stock}</td>
                        <td>
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(product)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(product._id, 'product')}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'articles' && (
            <motion.div
              key="articles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="section-header">
                <h1>إدارة المقالات</h1>
                <button className="add-btn" onClick={handleCreate}>
                  <FaPlus /> إضافة مقال
                </button>
              </div>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>الصورة</th>
                      <th>العنوان</th>
                      <th>الفئة</th>
                      <th>المشاهدات</th>
                      <th>التاريخ</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article) => (
                      <tr key={article._id}>
                        <td>
                          <img
                            src={article.image.startsWith('http') ? article.image : `${API_BASE_URL}${article.image}`}
                            alt={article.title}
                            className="table-image"
                          />
                        </td>
                        <td>{article.title}</td>
                        <td>{article.category}</td>
                        <td>{article.views}</td>
                        <td>{new Date(article.createdAt).toLocaleDateString('ar-DZ')}</td>
                        <td>
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(article)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(article._id, 'article')}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'ads' && (
            <motion.div
              key="ads"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="section-header">
                <h1>إدارة الإعلانات</h1>
                <button className="add-btn" onClick={handleCreate}>
                  <FaPlus /> إضافة إعلان
                </button>
              </div>
              <div className="ads-grid">
                {ads.map((ad) => (
                  <div key={ad._id} className="ad-card">
                    <img
                      src={ad.image.startsWith('http') ? ad.image : `${API_BASE_URL}${ad.image}`}
                      alt={ad.title}
                    />
                    <div className="ad-info">
                      <h3>{ad.title}</h3>
                      <span className={`status ${ad.active ? 'active' : 'inactive'}`}>
                        {ad.active ? 'نشط' : 'غير نشط'}
                      </span>
                      <div className="ad-actions">
                        <button onClick={() => handleEdit(ad)}>
                          <FaEdit /> تعديل
                        </button>
                        <button onClick={() => handleDelete(ad._id, 'ad')}>
                          <FaTrash /> حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1>إدارة الطلبات</h1>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>رقم الطلب</th>
                      <th>اسم العميل</th>
                      <th>رقم الهاتف</th>
                      <th>العنوان</th>
                      <th>المبلغ</th>
                      <th>الحالة</th>
                      <th>التاريخ</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order.orderNumber}</td>
                        <td>{order.customerName}</td>
                        <td>{order.customerPhone}</td>
                        <td>
                          {order.shippingAddress && (
                            <div style={{ fontSize: '0.9em', lineHeight: '1.4' }}>
                              {order.shippingAddress.street && <div>{order.shippingAddress.street}</div>}
                              {order.shippingAddress.city && <div>{order.shippingAddress.city}</div>}
                              {order.shippingAddress.state && <div>{order.shippingAddress.state}</div>}
                            </div>
                          )}
                        </td>
                        <td>{order.totalAmount} دج</td>
                        <td>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleOrderStatusChange(order._id, e.target.value)
                            }
                            className="status-select"
                          >
                            <option value="pending">قيد الانتظار</option>
                            <option value="processing">قيد المعالجة</option>
                            <option value="shipped">تم الشحن</option>
                            <option value="delivered">تم التوصيل</option>
                            <option value="cancelled">ملغي</option>
                          </select>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString('ar-DZ')}</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(order._id, 'order')}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'theme' && (
            <motion.div
              key="theme"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="theme-section"
            >
              <h1>إعدادات المظهر</h1>
              <form onSubmit={handleThemeUpdate} className="theme-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>اللون الأساسي</label>
                    <input
                      type="color"
                      name="primaryColor"
                      defaultValue={theme.primaryColor}
                    />
                  </div>
                  <div className="form-group">
                    <label>اللون الثانوي</label>
                    <input
                      type="color"
                      name="secondaryColor"
                      defaultValue={theme.secondaryColor}
                    />
                  </div>
                  <div className="form-group">
                    <label>اللون المميز</label>
                    <input
                      type="color"
                      name="accentColor"
                      defaultValue={theme.accentColor}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>نص الشعار</label>
                  <input
                    type="text"
                    name="logoText"
                    defaultValue={theme.logoText}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>صورة الشعار</label>
                    <input type="file" name="logoImage" accept="image/*" />
                  </div>
                  <div className="form-group">
                    <label>الأيقونة المفضلة</label>
                    <input type="file" name="favicon" accept="image/*" />
                  </div>
                </div>

                <button type="submit" className="save-btn">
                  حفظ التغييرات
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'links' && (
            <motion.div
              key="links"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="section-header">
                <h1>إدارة التحميلات</h1>
                <button className="add-btn" onClick={() => { setModalMode('create'); setCurrentItem(null); setShowModal(true); }}>
                  <FaPlus /> إضافة ملف
                </button>
              </div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>الصورة</th>
                      <th>العنوان</th>
                      <th>الملف</th>
                      <th>التحميلات</th>
                      <th>الحالة</th>
                      <th>إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {links.map(link => (
                      <tr key={link._id}>
                        <td>
                          {link.image && (
                            <img src={`${API_BASE_URL}${link.image}`} alt={link.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                          )}
                        </td>
                        <td>
                          <strong>{link.titleAr || link.title}</strong>
                          <br />
                          <small style={{ color: '#666' }}>{(link.descriptionAr || link.description || '').substring(0, 50)}</small>
                        </td>
                        <td>{link.fileName || '-'}</td>
                        <td>{link.downloads || 0}</td>
                        <td>
                          <span className={`status-badge ${link.active ? 'active' : 'inactive'}`}>
                            {link.active ? 'مفعل' : 'معطل'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="edit-btn" onClick={() => { setModalMode('edit'); setCurrentItem(link); setShowModal(true); }}>
                              <FaEdit />
                            </button>
                            <button className="delete-btn" onClick={async () => { if (window.confirm('حذف هذا الملف؟')) { await deleteLink(link._id); loadData(); toast.success('تم الحذف'); } }}>
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {links.length === 0 && <p style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>لا توجد تحميلات بعد</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>
                {modalMode === 'create' ? 'إضافة' : 'تعديل'}{' '}
                {activeTab === 'products'
                  ? 'منتج'
                  : activeTab === 'articles'
                  ? 'مقال'
                  : activeTab === 'links'
                  ? 'ملف'
                  : 'إعلان'}
              </h2>

              <form
                onSubmit={(e) =>
                  handleSubmit(
                    e,
                    activeTab === 'products'
                      ? 'product'
                      : activeTab === 'articles'
                      ? 'article'
                      : activeTab === 'links'
                      ? 'link'
                      : 'ad'
                  )
                }
              >
                {/* Common fields - NOT for links */}
                {activeTab !== 'links' && (
                <>
                <div className="form-group">
                  <label>الاسم/العنوان</label>
                  <input
                    type="text"
                    name={activeTab === 'articles' ? 'title' : 'name'}
                    defaultValue={
                      currentItem
                        ? activeTab === 'articles'
                          ? currentItem.title
                          : currentItem.name
                        : ''
                    }
                    required
                  />
                </div>

                {activeTab !== 'ads' && (
                  <>
                    <div className="form-group">
                      <label>الاسم/العنوان بالعربية</label>
                      <input
                        type="text"
                        name={activeTab === 'articles' ? 'titleAr' : 'nameAr'}
                        defaultValue={
                          currentItem
                            ? activeTab === 'articles'
                              ? currentItem.titleAr
                              : currentItem.nameAr
                            : ''
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>الوصف/المحتوى</label>
                      <textarea
                        name={activeTab === 'articles' ? 'content' : 'description'}
                        rows="4"
                        defaultValue={
                          currentItem
                            ? activeTab === 'articles'
                              ? currentItem.content
                              : currentItem.description
                            : ''
                        }
                        required
                      />
                    </div>

                    {activeTab === 'articles' ? (
                      <div className="form-group">
                        <label>الفئة</label>
                        <select
                          name="category"
                          defaultValue={currentItem?.category || ''}
                          required
                          className="category-select"
                        >
                          <option value="">اختر الفئة...</option>
                          {articleCategories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.icon} {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="form-group">
                        <label>الفئة</label>
                        <input
                          type="text"
                          name="category"
                          defaultValue={currentItem?.category || ''}
                          required
                        />
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'products' && (
                  <>
                    <div className="form-group">
                      <label>السعر</label>
                      <input
                        type="number"
                        name="price"
                        defaultValue={currentItem?.price || ''}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>المخزون</label>
                      <input
                        type="number"
                        name="stock"
                        defaultValue={currentItem?.stock || 0}
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          name="featured"
                          defaultChecked={currentItem?.featured}
                        />
                        منتج مميز
                      </label>
                    </div>
                  </>
                )}

                {activeTab === 'articles' && (
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        name="featured"
                        defaultChecked={currentItem?.featured}
                      />
                      مقال مميز
                    </label>
                  </div>
                )}

                {activeTab === 'ads' && (
                  <>
                    <div className="form-group">
                      <label>الرابط</label>
                      <input
                        type="text"
                        name="link"
                        defaultValue={currentItem?.link || ''}
                      />
                    </div>
                    <div className="form-group">
                      <label>الموقع</label>
                      <select
                        name="position"
                        defaultValue={currentItem?.position || 'banner'}
                      >
                        <option value="hero">Hero</option>
                        <option value="sidebar">Sidebar</option>
                        <option value="banner">Banner</option>
                        <option value="sponsor">Sponsor</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          name="active"
                          defaultChecked={currentItem?.active ?? true}
                        />
                        نشط
                      </label>
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>
                    {activeTab === 'articles' ? 'صورة المقال الرئيسية (Thumbnail)' : 'الصورة'}
                  </label>
                  <input type="file" name="image" accept="image/*" />
                  {currentItem?.image && (
                    <img
                      src={`${API_BASE_URL}${currentItem.image}`}
                      alt="Current"
                      className="preview-image"
                    />
                  )}
                  {activeTab === 'articles' && (
                    <small className="form-hint">
                      هذه الصورة ستظهر في قائمة المقالات كصورة مصغرة
                    </small>
                  )}
                </div>

                {activeTab === 'articles' && (
                  <div className="form-group">
                    <label>صور المحتوى (Content Images)</label>
                    <input 
                      type="file" 
                      name="contentImages" 
                      accept="image/*" 
                      multiple 
                      onChange={handleContentImagesUpload}
                    />
                    {currentItem?.contentImages && currentItem.contentImages.length > 0 && (
                      <div className="preview-images-grid">
                        {currentItem.contentImages.map((img, idx) => (
                          <img
                            key={idx}
                            src={`${API_BASE_URL}${img}`}
                            alt={`Content ${idx + 1}`}
                            className="preview-image-small"
                          />
                        ))}
                      </div>
                    )}
                    <small className="form-hint">
                      يمكنك رفع عدة صور لاستخدامها داخل المقال
                    </small>
                  </div>
                )}

                {activeTab === 'articles' && (
                  <ArticleEditor
                    initialBlocks={contentBlocks}
                    onBlocksChange={handleBlocksChange}
                    contentImages={uploadedContentImages}
                    articles={articles}
                  />
                )}
                </>
                )}

                {activeTab === 'links' && (
                  <>
                    <div className="form-group">
                      <label>العنوان</label>
                      <input type="text" name="title" defaultValue={currentItem ? currentItem.title : ''} required placeholder="عنوان الملف..." />
                    </div>
                    <div className="form-group">
                      <label>العنوان بالعربية</label>
                      <input type="text" name="titleAr" defaultValue={currentItem ? currentItem.titleAr : ''} placeholder="عنوان الملف بالعربية..." />
                    </div>
                    <div className="form-group">
                      <label>الوصف</label>
                      <textarea name="description" defaultValue={currentItem ? currentItem.description : ''} required rows="3" placeholder="وصف الملف..." />
                    </div>
                    <div className="form-group">
                      <label>الوصف بالعربية</label>
                      <textarea name="descriptionAr" defaultValue={currentItem ? currentItem.descriptionAr : ''} rows="3" placeholder="وصف الملف بالعربية..." />
                    </div>
                    <div className="form-group">
                      <label>صورة الغلاف</label>
                      <input type="file" name="image" accept="image/*" />
                      {currentItem && currentItem.image && (
                        <img src={`${API_BASE_URL}${currentItem.image}`} alt="Current" className="preview-image" />
                      )}
                    </div>
                    <div className="form-group">
                      <label>الملف للتحميل (PDF, ZIP, DOC, إلخ)</label>
                      <input type="file" name="file" required={modalMode === 'create'} />
                      {currentItem && currentItem.fileName && (
                        <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>الملف الحالي: {currentItem.fileName}</small>
                      )}
                    </div>
                    <div className="form-group">
                      <label>الحالة</label>
                      <select name="active" defaultValue={currentItem ? String(currentItem.active) : 'true'}>
                        <option value="true">مفعل</option>
                        <option value="false">معطل</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="modal-actions">
                  <button type="submit" className="submit-btn">
                    <FaCheck /> {modalMode === 'create' ? 'إضافة' : 'تحديث'}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    <FaTimes /> إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
