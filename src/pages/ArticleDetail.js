import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCalendar, FaEye, FaUser } from 'react-icons/fa';
import { getArticle } from '../services/api';
import { getImageUrl } from '../config';
import { toast } from 'react-toastify';
import '../styles/ArticleDetail.css';

const catLabels = { pregnancy: 'حملي', childcare: 'طفلي', home: 'بيتي', recipes: 'كوزينتي', education: 'مدرستي', trips: 'تحويستي', health: 'صحتي', religion: 'ديني', names: 'الأسماء' };
const fmtDate = (d) => new Date(d).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' });

const extractVideo = (url) => {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
  if (yt) return { platform: 'youtube', id: yt[1] };
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { platform: 'vimeo', id: vm[1] };
  return null;
};

// Render text with line breaks preserved
const TextWithBreaks = ({ text, style }) => {
  if (!text) return null;
  return (
    <div style={{ ...style, whiteSpace: 'pre-line' }}>
      {text}
    </div>
  );
};

const ArticleDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getArticle(id).then(r => setArticle(r.data)).catch(() => toast.error('خطأ في تحميل المقال')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>جاري التحميل...</p></div>;
  if (!article) return <div className="not-found"><h2>المقال غير موجود</h2><button onClick={() => nav('/articles')} className="back-btn">العودة</button></div>;

  const content = article.contentAr || article.content || '';

  return (
    <div className="article-detail-page">
      <div className="container">
        <motion.button className="back-button" onClick={() => nav('/articles')} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}><FaArrowRight /> العودة إلى المقالات</motion.button>
        <motion.article className="article-detail" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
          <div className="article-header">
            <div className="article-meta-top">
              <span className="article-category">{catLabels[article.category] || article.category}</span>
              {article.featured && <span className="featured-badge">مميز</span>}
            </div>
            <h1>{article.titleAr || article.title}</h1>
            <div className="article-meta">
              <div className="meta-item"><FaCalendar /><span>{fmtDate(article.createdAt)}</span></div>
              <div className="meta-item"><FaEye /><span>{article.views || 0} مشاهدة</span></div>
              {article.author && <div className="meta-item"><FaUser /><span>{article.author}</span></div>}
            </div>
          </div>

          {article.image && (
            <div className="article-hero-image">
              <img src={getImageUrl(article.image)} alt={article.title} />
            </div>
          )}

          <div className="article-content">
            {article.contentBlocks?.length > 0 ? (
              <div className="flexible-content">
                {[...article.contentBlocks].sort((a, b) => a.order - b.order).map((block, idx) => (
                  <motion.div key={block.id || idx} className={`content-block block-${block.type}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    {block.type === 'heading' && React.createElement(
                      block.settings?.headingSize || block.settings?.size || 'h2',
                      { style: { textAlign: block.settings?.alignment || block.settings?.align || 'right' } },
                      block.content
                    )}
                    {block.type === 'paragraph' && (
                      <TextWithBreaks
                        text={block.content}
                        style={{ textAlign: block.settings?.alignment || block.settings?.align || 'right' }}
                      />
                    )}
                    {block.type === 'image' && block.imageUrl && (
                      <div className={`block-image size-${block.settings?.imageSize || block.settings?.size || 'medium'}`}>
                        <img src={getImageUrl(block.imageUrl)} alt="content" />
                      </div>
                    )}
                    {block.type === 'video' && block.videoUrl && extractVideo(block.videoUrl) && (
                      <div className={`block-video size-${block.settings?.videoSize || block.settings?.size || 'large'}`}>
                        <div className="video-wrapper">
                          <iframe
                            src={extractVideo(block.videoUrl).platform === 'youtube'
                              ? `https://www.youtube.com/embed/${extractVideo(block.videoUrl).id}`
                              : `https://player.vimeo.com/video/${extractVideo(block.videoUrl).id}`}
                            frameBorder="0" allowFullScreen title="video"
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="content-text" style={{ whiteSpace: 'pre-line' }}>
                {content}
              </div>
            )}
            {article.contentImages?.length > 0 && (!article.contentBlocks || article.contentBlocks.length === 0) && (
              <div className="content-images">
                <h3>صور إضافية</h3>
                <div className="images-grid">
                  {article.contentImages.map((img, i) => (
                    <div key={i} className="content-image"><img src={getImageUrl(img)} alt={`صورة ${i + 1}`} /></div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="article-footer">
            <motion.button className="back-to-articles-btn" onClick={() => nav('/articles')} whileHover={{ scale: 1.05 }}><FaArrowRight /> العودة إلى جميع المقالات</motion.button>
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default ArticleDetail;
