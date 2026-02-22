import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBox, FaNewspaper, FaAd, FaShoppingCart, FaPalette, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaChartLine, FaBars } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getProducts, createProduct, updateProduct, deleteProduct, getArticles, createArticle, updateArticle, deleteArticle, getAds, createAd, updateAd, deleteAd, getOrders, updateOrder, deleteOrder, getTheme, updateTheme, getStats } from '../services/api';
import { getImageUrl } from '../config';
import ArticleEditor from '../components/ArticleEditor';
import '../styles/Admin.css';

const articleCats = [
  { value: 'pregnancy', label: 'حملي', icon: '🤰' }, { value: 'childcare', label: 'طفلي', icon: '👶' },
  { value: 'home', label: 'بيتي', icon: '🏠' }, { value: 'recipes', label: 'كوزينتي', icon: '🍳' },
  { value: 'education', label: 'مدرستي', icon: '📚' }, { value: 'trips', label: 'تحويستي', icon: '✈️' },
  { value: 'health', label: 'صحتي', icon: '💪' }, { value: 'religion', label: 'ديني', icon: '🕌' },
  { value: 'names', label: 'الأسماء', icon: '👶' }
];

const fontOptions = [
  { value: 'Cairo, sans-serif', label: 'Cairo (افتراضي)' },
  { value: 'Tajawal, sans-serif', label: 'Tajawal' },
  { value: 'Almarai, sans-serif', label: 'Almarai' },
  { value: 'Changa, sans-serif', label: 'Changa' },
  { value: 'El Messiri, sans-serif', label: 'El Messiri' },
  { value: 'Amiri, serif', label: 'Amiri' },
  { value: 'Noto Kufi Arabic, sans-serif', label: 'Noto Kufi Arabic' },
  { value: 'Readex Pro, sans-serif', label: 'Readex Pro' },
  { value: 'IBM Plex Sans Arabic, sans-serif', label: 'IBM Plex Sans Arabic' },
  { value: 'Rubik, sans-serif', label: 'Rubik' },
];

const Admin = () => {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [ads, setAds] = useState([]);
  const [orders, setOrders] = useState([]);
  const [theme, setTheme] = useState({});
  const [modal, setModal] = useState(false);
  const [mode, setMode] = useState('create');
  const [current, setCurrent] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [contentImgs, setContentImgs] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { loadData(); }, [tab]);

  const loadData = async () => {
    try {
      if (tab === 'dashboard') setStats((await getStats()).data);
      else if (tab === 'products') setProducts((await getProducts()).data);
      else if (tab === 'articles') setArticles((await getArticles()).data);
      else if (tab === 'ads') setAds((await getAds()).data);
      else if (tab === 'orders') setOrders((await getOrders()).data);
      else if (tab === 'theme') setTheme((await getTheme()).data);
    } catch { toast.error('خطأ في تحميل البيانات'); }
  };

  const openCreate = () => { setMode('create'); setCurrent(null); setBlocks([]); setContentImgs([]); setModal(true); };
  const openEdit = (item) => {
    setMode('edit'); setCurrent(item); setBlocks(item.contentBlocks || []);
    setContentImgs(item.contentImages?.map(i => getImageUrl(i)) || []);
    setModal(true);
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('هل أنت متأكد من الحذف؟')) return;
    try {
      if (type === 'product') await deleteProduct(id);
      else if (type === 'article') await deleteArticle(id);
      else if (type === 'ad') await deleteAd(id);
      else if (type === 'order') await deleteOrder(id);
      toast.success('تم الحذف بنجاح');
      loadData();
    } catch { toast.error('خطأ في الحذف'); }
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    if (type === 'article' && blocks.length > 0) fd.append('contentBlocks', JSON.stringify(blocks));
    try {
      if (mode === 'create') {
        if (type === 'product') await createProduct(fd);
        else if (type === 'article') await createArticle(fd);
        else if (type === 'ad') await createAd(fd);
        toast.success('تم الإضافة بنجاح');
      } else {
        if (type === 'product') await updateProduct(current._id, fd);
        else if (type === 'article') await updateArticle(current._id, fd);
        else if (type === 'ad') await updateAd(current._id, fd);
        toast.success('تم التحديث بنجاح');
      }
      setModal(false); loadData();
    } catch { toast.error('حدث خطأ'); }
  };

  const changeOrderStatus = async (id, status) => {
    try { await updateOrder(id, { status }); toast.success('تم التحديث'); loadData(); }
    catch { toast.error('خطأ'); }
  };

  const handleTheme = async (e) => {
    e.preventDefault();
    try { const r = await updateTheme(new FormData(e.target)); setTheme(r.data); toast.success('تم تحديث المظهر'); window.location.reload(); }
    catch { toast.error('خطأ'); }
  };

  const onContentImgsUpload = (e) => {
    if (e.target.files?.length) setContentImgs(p => [...p, ...Array.from(e.target.files).map(f => URL.createObjectURL(f))]);
  };

  const onBlocksChange = useCallback((b) => setBlocks(b), []);

  const tabType = tab === 'products' ? 'product' : tab === 'articles' ? 'article' : 'ad';

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setSidebarOpen(false);
  };

  return (
    <div className="admin-dashboard">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <FaBars />
        </button>
        <h2>لوحة التحكم</h2>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header"><h2>لوحة التحكم</h2></div>
        <nav className="sidebar-nav">
          {[['dashboard', <FaChartLine />, 'الإحصائيات'], ['products', <FaBox />, 'المنتجات'], ['articles', <FaNewspaper />, 'المقالات'], ['ads', <FaAd />, 'الإعلانات'], ['orders', <FaShoppingCart />, 'الطلبات'], ['theme', <FaPalette />, 'المظهر']].map(([k, icon, label]) => (
            <button key={k} className={tab === k ? 'active' : ''} onClick={() => handleTabChange(k)}>{icon} <span>{label}</span></button>
          ))}
        </nav>
      </aside>

      <main className="admin-main">
        <AnimatePresence mode="wait">
          {tab === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="dashboard-stats">
              <h1>الإحصائيات</h1>
              <div className="stats-grid">
                {[[<FaBox />, stats.products, 'المنتجات'], [<FaNewspaper />, stats.articles, 'المقالات'], [<FaShoppingCart />, stats.orders, 'الطلبات'], [<FaChartLine />, `${stats.revenue || 0} دج`, 'الإيرادات']].map(([icon, val, label], i) => (
                  <div key={i} className="stat-card"><div className="stat-icon">{icon}</div><h3>{val || 0}</h3><p>{label}</p></div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'products' && (
            <motion.div key="prods" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="section-header">
                <h1>إدارة المنتجات</h1>
                <button className="add-btn" onClick={openCreate}><FaPlus /> <span>إضافة منتج</span></button>
              </div>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr><th>الصورة</th><th>الاسم</th><th>السعر</th><th>الفئة</th><th>المخزون</th><th>الإجراءات</th></tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td data-label="الصورة"><img src={getImageUrl(p.image)} alt={p.name} className="table-image" /></td>
                        <td data-label="الاسم">{p.name}</td>
                        <td data-label="السعر">{p.price} دج</td>
                        <td data-label="الفئة">{p.category}</td>
                        <td data-label="المخزون">{p.stock}</td>
                        <td data-label="الإجراءات">
                          <div className="action-buttons">
                            <button className="edit-btn" onClick={() => openEdit(p)}><FaEdit /></button>
                            <button className="delete-btn" onClick={() => handleDelete(p._id, 'product')}><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {tab === 'articles' && (
            <motion.div key="arts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="section-header">
                <h1>إدارة المقالات</h1>
                <button className="add-btn" onClick={openCreate}><FaPlus /> <span>إضافة مقال</span></button>
              </div>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr><th>الصورة</th><th>العنوان</th><th>الفئة</th><th>المشاهدات</th><th>التاريخ</th><th>الإجراءات</th></tr>
                  </thead>
                  <tbody>
                    {articles.map(a => (
                      <tr key={a._id}>
                        <td data-label="الصورة"><img src={getImageUrl(a.image)} alt={a.title} className="table-image" /></td>
                        <td data-label="العنوان">{a.title}</td>
                        <td data-label="الفئة">{a.category}</td>
                        <td data-label="المشاهدات">{a.views}</td>
                        <td data-label="التاريخ">{new Date(a.createdAt).toLocaleDateString('ar-DZ')}</td>
                        <td data-label="الإجراءات">
                          <div className="action-buttons">
                            <button className="edit-btn" onClick={() => openEdit(a)}><FaEdit /></button>
                            <button className="delete-btn" onClick={() => handleDelete(a._id, 'article')}><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {tab === 'ads' && (
            <motion.div key="ads" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="section-header">
                <h1>إدارة الإعلانات</h1>
                <button className="add-btn" onClick={openCreate}><FaPlus /> <span>إضافة إعلان</span></button>
              </div>
              <div className="ads-grid">
                {ads.map(ad => (
                  <div key={ad._id} className="ad-card">
                    <img src={getImageUrl(ad.image)} alt={ad.title} />
                    <div className="ad-info">
                      <h3>{ad.title}</h3>
                      <span className={`status ${ad.active ? 'active' : 'inactive'}`}>{ad.active ? 'نشط' : 'غير نشط'}</span>
                      <div className="ad-actions">
                        <button onClick={() => openEdit(ad)}><FaEdit /> تعديل</button>
                        <button onClick={() => handleDelete(ad._id, 'ad')}><FaTrash /> حذف</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1>إدارة الطلبات</h1>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr><th>رقم الطلب</th><th>العميل</th><th>الهاتف</th><th>العنوان</th><th>المبلغ</th><th>الحالة</th><th>التاريخ</th><th>إجراءات</th></tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id}>
                        <td data-label="رقم الطلب">{o.orderNumber}</td>
                        <td data-label="العميل">{o.customerName}</td>
                        <td data-label="الهاتف">{o.customerPhone}</td>
                        <td data-label="العنوان">
                          {o.shippingAddress && (
                            <div style={{ fontSize: '0.9em' }}>
                              {o.shippingAddress.street}<br />
                              {o.shippingAddress.city}, {o.shippingAddress.state}
                            </div>
                          )}
                        </td>
                        <td data-label="المبلغ">{o.totalAmount} دج</td>
                        <td data-label="الحالة">
                          <select value={o.status} onChange={e => changeOrderStatus(o._id, e.target.value)} className="status-select">
                            <option value="pending">قيد الانتظار</option>
                            <option value="processing">قيد المعالجة</option>
                            <option value="shipped">تم الشحن</option>
                            <option value="delivered">تم التوصيل</option>
                            <option value="cancelled">ملغي</option>
                          </select>
                        </td>
                        <td data-label="التاريخ">{new Date(o.createdAt).toLocaleDateString('ar-DZ')}</td>
                        <td data-label="إجراءات">
                          <button className="delete-btn" onClick={() => handleDelete(o._id, 'order')}><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {tab === 'theme' && (
            <motion.div key="theme" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="theme-section">
              <h1>إعدادات المظهر</h1>
              <form onSubmit={handleTheme} className="theme-form">
                <div className="form-row">
                  <div className="form-group"><label>اللون الأساسي</label><input type="color" name="primaryColor" defaultValue={theme.primaryColor} /></div>
                  <div className="form-group"><label>اللون الثانوي</label><input type="color" name="secondaryColor" defaultValue={theme.secondaryColor} /></div>
                  <div className="form-group"><label>اللون المميز</label><input type="color" name="accentColor" defaultValue={theme.accentColor} /></div>
                </div>
                <div className="form-group">
                  <label>الخط</label>
                  <select name="fontFamily" defaultValue={theme.fontFamily || 'Cairo, sans-serif'} className="category-select">
                    {fontOptions.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                  <p style={{ fontSize: '0.85rem', color: '#718096', marginTop: '8px' }}>اختر الخط المناسب لموقعك</p>
                </div>
                <div className="form-group"><label>نص الشعار</label><input type="text" name="logoText" defaultValue={theme.logoText} /></div>
                <div className="form-row">
                  <div className="form-group"><label>صورة الشعار</label><input type="file" name="logoImage" accept="image/*" /></div>
                  <div className="form-group"><label>الأيقونة</label><input type="file" name="favicon" accept="image/*" /></div>
                </div>
                {theme.logoImage && (
                  <div className="form-group">
                    <label>الشعار الحالي</label>
                    <img src={getImageUrl(theme.logoImage)} alt="logo" className="preview-image" style={{ maxWidth: '150px' }} />
                  </div>
                )}
                <button type="submit" className="save-btn">حفظ التغييرات</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modal - Full page on mobile */}
      <AnimatePresence>
        {modal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}>
              <div className="modal-header">
                <h2>{mode === 'create' ? 'إضافة' : 'تعديل'} {tab === 'products' ? 'منتج' : tab === 'articles' ? 'مقال' : 'إعلان'}</h2>
                <button type="button" className="modal-close-btn" onClick={() => setModal(false)}><FaTimes /></button>
              </div>

              <div className="modal-body">
                <form onSubmit={e => handleSubmit(e, tabType)} id="admin-form">
                  {/* Title / Name */}
                  <div className="form-group">
                    <label>{tab === 'articles' ? 'العنوان' : tab === 'ads' ? 'عنوان الإعلان' : 'اسم المنتج'}</label>
                    <input type="text" name={tab === 'articles' ? 'title' : 'name'} defaultValue={current ? (tab === 'articles' ? current.title : current.name) : ''} required placeholder={tab === 'articles' ? 'أدخل عنوان المقال...' : tab === 'ads' ? 'أدخل عنوان الإعلان...' : 'أدخل اسم المنتج...'} />
                  </div>

                  {/* Arabic Title / Name */}
                  {tab !== 'ads' && (
                    <div className="form-group">
                      <label>{tab === 'articles' ? 'العنوان بالعربية' : 'الاسم بالعربية'}</label>
                      <input type="text" name={tab === 'articles' ? 'titleAr' : 'nameAr'} defaultValue={current ? (tab === 'articles' ? current.titleAr : current.nameAr) : ''} placeholder="اختياري - العنوان بالعربية" />
                    </div>
                  )}

                  {/* Description / Content */}
                  {tab !== 'ads' && (
                    <div className="form-group">
                      <label>{tab === 'articles' ? 'المحتوى' : 'الوصف'}</label>
                      <textarea name={tab === 'articles' ? 'content' : 'description'} rows="4" defaultValue={current ? (tab === 'articles' ? current.content : current.description) : ''} required placeholder={tab === 'articles' ? 'اكتب محتوى المقال...' : 'اكتب وصف المنتج...'} />
                    </div>
                  )}

                  {/* Category */}
                  {tab !== 'ads' && (
                    tab === 'articles' ? (
                      <div className="form-group">
                        <label>الفئة</label>
                        <select name="category" defaultValue={current?.category || ''} required className="category-select">
                          <option value="">اختر الفئة...</option>
                          {articleCats.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
                        </select>
                      </div>
                    ) : (
                      <div className="form-group">
                        <label>الفئة</label>
                        <input type="text" name="category" defaultValue={current?.category || ''} required placeholder="مثال: العناية بالبشرة" />
                      </div>
                    )
                  )}

                  {/* Product specific fields */}
                  {tab === 'products' && (
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label>السعر (دج)</label>
                          <input type="number" name="price" defaultValue={current?.price || ''} required placeholder="0" />
                        </div>
                        <div className="form-group">
                          <label>المخزون</label>
                          <input type="number" name="stock" defaultValue={current?.stock || 0} placeholder="0" />
                        </div>
                      </div>
                      <div className="form-group checkbox-group">
                        <label><input type="checkbox" name="featured" defaultChecked={current?.featured} /> منتج مميز (يظهر في الصفحة الرئيسية)</label>
                      </div>
                    </>
                  )}

                  {/* Article featured checkbox */}
                  {tab === 'articles' && (
                    <div className="form-group checkbox-group">
                      <label><input type="checkbox" name="featured" defaultChecked={current?.featured} /> مقال مميز (يظهر في الصفحة الرئيسية)</label>
                    </div>
                  )}

                  {/* Ads specific fields */}
                  {tab === 'ads' && (
                    <>
                      <div className="form-group">
                        <label>الرابط</label>
                        <input type="text" name="link" defaultValue={current?.link || ''} placeholder="https://example.com" />
                      </div>
                      <div className="form-group">
                        <label>الموقع</label>
                        <select name="position" defaultValue={current?.position || 'banner'} className="category-select">
                          <option value="hero">سلايدر رئيسي (Hero)</option>
                          <option value="sidebar">شريط جانبي (Sidebar)</option>
                          <option value="banner">بانر (Banner)</option>
                          <option value="sponsor">راعي (Sponsor)</option>
                        </select>
                      </div>
                      <div className="form-group checkbox-group">
                        <label><input type="checkbox" name="active" defaultChecked={current?.active ?? true} /> نشط</label>
                      </div>
                    </>
                  )}

                  {/* Main Image */}
                  <div className="form-group">
                    <label>{tab === 'articles' ? 'صورة المقال الرئيسية' : 'الصورة'}</label>
                    <input type="file" name="image" accept="image/*" />
                    {current?.image && (
                      <div className="current-image-preview">
                        <span>الصورة الحالية:</span>
                        <img src={getImageUrl(current.image)} alt="preview" className="preview-image" />
                      </div>
                    )}
                  </div>

                  {/* Article content images and editor */}
                  {tab === 'articles' && (
                    <>
                      <div className="form-group">
                        <label>صور المحتوى (يمكنك إضافة عدة صور)</label>
                        <input type="file" name="contentImages" accept="image/*" multiple onChange={onContentImgsUpload} />
                        {contentImgs.length > 0 && (
                          <div className="content-images-preview">
                            {contentImgs.map((img, i) => (
                              <img key={i} src={img} alt={`content-${i}`} className="preview-thumb" />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>محرر المحتوى المتقدم</label>
                        <ArticleEditor initialBlocks={blocks} onBlocksChange={onBlocksChange} contentImages={contentImgs} />
                      </div>
                    </>
                  )}
                </form>
              </div>

              <div className="modal-footer">
                <button type="submit" form="admin-form" className="submit-btn"><FaCheck /> {mode === 'create' ? 'إضافة' : 'تحديث'}</button>
                <button type="button" className="cancel-btn" onClick={() => setModal(false)}><FaTimes /> إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
