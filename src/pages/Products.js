import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaTh, FaList } from 'react-icons/fa';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [cats, setCats] = useState([]);
  const [selCat, setSelCat] = useState('all');
  const [sort, setSort] = useState('newest');
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState(10000);

  useEffect(() => {
    setLoading(true);
    Promise.all([getProducts(), getCategories()]).then(([p, c]) => {
      setProducts(p.data);
      setCats(c.data.products || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let f = [...products];
    if (selCat !== 'all') f = f.filter(p => p.category === selCat);
    f = f.filter(p => p.price <= maxPrice);
    switch (sort) {
      case 'price-low': f.sort((a, b) => a.price - b.price); break;
      case 'price-high': f.sort((a, b) => b.price - a.price); break;
      case 'name': f.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: f.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setFiltered(f);
  }, [products, selCat, sort, maxPrice]);

  return (
    <div className="products-page">
      <motion.div className="page-header" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
        <h1>منتجاتنا</h1><p>اكتشفي مجموعة واسعة من المنتجات المختارة بعناية</p>
      </motion.div>
      <div className="products-container">
        <motion.aside className="filters-sidebar" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <div className="filter-section">
            <h3><FaFilter /> الفئات</h3>
            <div className="filter-options">
              <label className={selCat === 'all' ? 'active' : ''}><input type="radio" name="cat" value="all" checked={selCat === 'all'} onChange={e => setSelCat(e.target.value)} /><span>الكل</span></label>
              {cats.map(c => <label key={c} className={selCat === c ? 'active' : ''}><input type="radio" name="cat" value={c} checked={selCat === c} onChange={e => setSelCat(e.target.value)} /><span>{c}</span></label>)}
            </div>
          </div>
          <div className="filter-section">
            <h3>نطاق السعر</h3>
            <div className="price-range">
              <input type="range" min="0" max="10000" value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} />
              <div className="price-values"><span>0 دج</span><span>{maxPrice} دج</span></div>
            </div>
          </div>
        </motion.aside>
        <div className="products-content">
          <div className="products-toolbar">
            <div className="toolbar-left"><span className="results-count">{filtered.length} منتج</span></div>
            <div className="toolbar-right">
              <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
                <option value="newest">الأحدث</option><option value="price-low">السعر: الأقل</option><option value="price-high">السعر: الأعلى</option><option value="name">الاسم</option>
              </select>
              <div className="view-toggle">
                <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}><FaTh /></button>
                <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}><FaList /></button>
              </div>
            </div>
          </div>
          {loading ? <div className="loading">جاري التحميل...</div> : filtered.length === 0 ? <div className="no-products"><p>لا توجد منتجات متاحة</p></div> : (
            <div className={`products-grid ${view}`}>{filtered.map(p => <ProductCard key={p._id} product={p} />)}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
