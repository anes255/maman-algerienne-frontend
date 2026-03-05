import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaFile, FaEye } from 'react-icons/fa';
import { getLinks } from '../services/api';
import { getImageUrl, API_BASE_URL } from '../config';
import { toast } from 'react-toastify';
import '../styles/Links.css';

var formatSize = function(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

var Links = function() {
  var _s1 = useState([]);
  var links = _s1[0], setLinks = _s1[1];
  var _s2 = useState(true);
  var loading = _s2[0], setLoading = _s2[1];

  useEffect(function() {
    setLoading(true);
    getLinks({ active: true }).then(function(r) {
      setLinks(r.data);
    }).catch(function() {
      toast.error('خطأ في تحميل الروابط');
    }).finally(function() {
      setLoading(false);
    });
  }, []);

  var handleDownload = function(link) {
    window.open(API_BASE_URL + '/api/links/' + link._id + '/download', '_blank');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="links-page">
      <motion.div className="page-header" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
        <h1>التحميلات</h1>
        <p>حملي الملفات والموارد المفيدة</p>
      </motion.div>

      <div className="links-container">
        {links.length === 0 ? (
          <div className="no-links">
            <FaFile className="no-links-icon" />
            <p>لا توجد ملفات متاحة للتحميل حالياً</p>
          </div>
        ) : (
          <div className="links-grid">
            {links.map(function(link, i) {
              return (
                <motion.div
                  key={link._id}
                  className="link-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="link-image">
                    <img src={getImageUrl(link.image)} alt={link.title} />
                  </div>
                  <div className="link-info">
                    <h3>{link.titleAr || link.title}</h3>
                    <p className="link-description">{link.descriptionAr || link.description}</p>
                    <div className="link-meta">
                      <span className="file-size"><FaFile /> {formatSize(link.fileSize)}</span>
                      <span className="download-count"><FaEye /> {link.downloads || 0} تحميل</span>
                    </div>
                    <button className="download-btn" onClick={function() { handleDownload(link); }}>
                      <FaDownload /> تحميل الملف
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Links;
