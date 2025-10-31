import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCalendar, FaEye, FaUser } from 'react-icons/fa';
import { getArticle } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/ArticleDetail.css';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const response = await getArticle(id);
      setArticle(response.data);
    } catch (error) {
      console.error('Error loading article:', error);
      toast.error('خطأ في تحميل المقال');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ar-DZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (image) => {
    return image.startsWith('http') ? image : `http://localhost:5000${image}`;
  };

  const getCategoryLabel = (category) => {
    const categories = {
      pregnancy: 'حملي',
      childcare: 'طفلي',
      home: 'بيتي',
      recipes: 'كوزينتي',
      education: 'مدرستي',
      trips: 'تحويستي',
      health: 'صحتي',
      religion: 'ديني',
      names: 'الأسماء'
    };
    return categories[category] || category;
  };

  const extractVideoId = (url) => {
    if (!url) return null;
    
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return { platform: 'youtube', id: youtubeMatch[1] };
    }

    // Vimeo
    const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return { platform: 'vimeo', id: vimeoMatch[1] };
    }

    return null;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="not-found">
        <h2>المقال غير موجود</h2>
        <button onClick={() => navigate('/articles')} className="back-btn">
          العودة إلى المقالات
        </button>
      </div>
    );
  }

  return (
    <div className="article-detail-page">
      <div className="container">
        <motion.button
          className="back-button"
          onClick={() => navigate('/articles')}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: 5 }}
        >
          <FaArrowRight /> العودة إلى المقالات
        </motion.button>

        <motion.article
          className="article-detail"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="article-header">
            <div className="article-meta-top">
              <span className="article-category">{getCategoryLabel(article.category)}</span>
              {article.featured && (
                <span className="featured-badge">مميز</span>
              )}
            </div>
            <h1>{article.titleAr || article.title}</h1>
            <div className="article-meta">
              <div className="meta-item">
                <FaCalendar />
                <span>{formatDate(article.createdAt)}</span>
              </div>
              <div className="meta-item">
                <FaEye />
                <span>{article.views || 0} مشاهدة</span>
              </div>
              {article.author && (
                <div className="meta-item">
                  <FaUser />
                  <span>{article.author}</span>
                </div>
              )}
            </div>
          </div>

          <div className="article-content">
            {article.contentBlocks && article.contentBlocks.length > 0 ? (
              // New flexible content blocks system
              <div className="flexible-content">
                {article.contentBlocks
                  .sort((a, b) => a.order - b.order)
                  .map((block, idx) => (
                    <motion.div
                      key={block.id || idx}
                      className={`content-block block-${block.type}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                      {block.type === 'heading' && (
                        block.settings.size === 'h1' ? (
                          <h1 style={{ textAlign: block.settings.align || 'right' }}>
                            {block.content}
                          </h1>
                        ) : block.settings.size === 'h2' ? (
                          <h2 style={{ textAlign: block.settings.align || 'right' }}>
                            {block.content}
                          </h2>
                        ) : block.settings.size === 'h3' ? (
                          <h3 style={{ textAlign: block.settings.align || 'right' }}>
                            {block.content}
                          </h3>
                        ) : (
                          <h4 style={{ textAlign: block.settings.align || 'right' }}>
                            {block.content}
                          </h4>
                        )
                      )}

                      {block.type === 'paragraph' && (
                        <p style={{ textAlign: block.settings.align || 'right' }}>
                          {block.content}
                        </p>
                      )}

                      {block.type === 'image' && block.imageUrl && (
                        <div
                          className={`block-image size-${block.settings.size} align-${block.settings.align}`}
                        >
                          <img src={getImageUrl(block.imageUrl)} alt={block.caption || 'محتوى'} />
                          {block.caption && <p className="image-caption">{block.caption}</p>}
                        </div>
                      )}

                      {block.type === 'video' && block.videoUrl && extractVideoId(block.videoUrl) && (
                        <div
                          className={`block-video size-${block.settings.size} align-${block.settings.align}`}
                        >
                          {(() => {
                            const videoInfo = extractVideoId(block.videoUrl);
                            if (videoInfo.platform === 'youtube') {
                              return (
                                <div className="video-wrapper">
                                  <iframe
                                    src={`https://www.youtube.com/embed/${videoInfo.id}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title="فيديو"
                                  />
                                </div>
                              );
                            } else if (videoInfo.platform === 'vimeo') {
                              return (
                                <div className="video-wrapper">
                                  <iframe
                                    src={`https://player.vimeo.com/video/${videoInfo.id}`}
                                    frameBorder="0"
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowFullScreen
                                    title="فيديو"
                                  />
                                </div>
                              );
                            }
                          })()}
                        </div>
                      )}
                    </motion.div>
                  ))}
              </div>
            ) : (
              // Fallback to old content format
              <div className="content-text">
                {(article.contentAr || article.content).split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}

            {article.contentImages && article.contentImages.length > 0 && (!article.contentBlocks || article.contentBlocks.length === 0) && (
              <div className="content-images">
                <h3>صور إضافية</h3>
                <div className="images-grid">
                  {article.contentImages.map((img, index) => (
                    <motion.div
                      key={index}
                      className="content-image"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <img src={getImageUrl(img)} alt={`صورة ${index + 1}`} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="article-footer">
            <motion.button
              className="back-to-articles-btn"
              onClick={() => navigate('/articles')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowRight /> العودة إلى جميع المقالات
            </motion.button>
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default ArticleDetail;
