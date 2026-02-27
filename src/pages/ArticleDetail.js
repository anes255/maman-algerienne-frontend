import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCalendar, FaEye, FaUser, FaTrash, FaPaperPlane, FaComments } from 'react-icons/fa';
import { getArticle, getComments, addComment, deleteComment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../config';
import { toast } from 'react-toastify';
import '../styles/ArticleDetail.css';

const catLabels = {
  pregnancy: 'حملي', childcare: 'طفلي', home: 'بيتي',
  recipes: 'كوزينتي', education: 'مدرستي', trips: 'تحويستي',
  health: 'صحتي', religion: 'ديني', names: 'الأسماء'
};

const fmtDate = function(d) {
  return new Date(d).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' });
};

const extractVideo = function(url) {
  if (!url) return null;
  var yt = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
  if (yt) return { platform: 'youtube', id: yt[1] };
  var vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { platform: 'vimeo', id: vm[1] };
  return null;
};

const ArticleDetail = function() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  var loadComments = function() {
    getComments(id).then(function(r) { setComments(r.data); }).catch(function() {});
  };

  useEffect(function() {
    setLoading(true);
    getArticle(id).then(function(r) { setArticle(r.data); }).catch(function() { toast.error('خطأ في تحميل المقال'); }).finally(function() { setLoading(false); });
    loadComments();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  var handleAddComment = async function(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      await addComment({ articleId: id, content: commentText.trim() });
      setCommentText('');
      loadComments();
      toast.success('تم إضافة التعليق');
    } catch (err) {
      toast.error('خطأ في إضافة التعليق');
    } finally {
      setSubmitting(false);
    }
  };

  var handleDeleteComment = async function(commentId) {
    if (!window.confirm('هل أنت متأكد من حذف هذا التعليق؟')) return;
    try {
      await deleteComment(commentId);
      loadComments();
      toast.success('تم حذف التعليق');
    } catch (err) {
      toast.error('خطأ في حذف التعليق');
    }
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
        <button onClick={function() { nav('/articles'); }} className="back-btn">العودة</button>
      </div>
    );
  }

  var content = article.contentAr || article.content || '';

  var renderBlocks = function() {
    var sorted = [].concat(article.contentBlocks).sort(function(a, b) { return a.order - b.order; });
    return sorted.map(function(block, idx) {
      var key = block.id || idx;
      var align = (block.settings && (block.settings.alignment || block.settings.align)) || 'right';

      return (
        <motion.div key={key} className={'content-block block-' + block.type} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {block.type === 'heading' && React.createElement(
            (block.settings && (block.settings.headingSize || block.settings.size)) || 'h2',
            { style: { textAlign: align } },
            block.content
          )}
          {block.type === 'paragraph' && (
            <div style={{ textAlign: align, whiteSpace: 'pre-line' }}>
              {block.content}
            </div>
          )}
          {block.type === 'image' && block.imageUrl && (
            <div className={'block-image size-' + ((block.settings && (block.settings.imageSize || block.settings.size)) || 'medium')}>
              <img src={getImageUrl(block.imageUrl)} alt="content" />
            </div>
          )}
          {block.type === 'video' && block.videoUrl && extractVideo(block.videoUrl) && (
            <div className={'block-video size-' + ((block.settings && (block.settings.videoSize || block.settings.size)) || 'large')}>
              <div className="video-wrapper">
                <iframe
                  src={extractVideo(block.videoUrl).platform === 'youtube'
                    ? 'https://www.youtube.com/embed/' + extractVideo(block.videoUrl).id
                    : 'https://player.vimeo.com/video/' + extractVideo(block.videoUrl).id}
                  frameBorder="0" allowFullScreen title="video"
                />
              </div>
            </div>
          )}
        </motion.div>
      );
    });
  };

  return (
    <div className="article-detail-page">
      <div className="container">
        <motion.button className="back-button" onClick={function() { nav('/articles'); }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <FaArrowRight /> العودة إلى المقالات
        </motion.button>

        <motion.article className="article-detail" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
          <div className="article-header">
            <div className="article-meta-top">
              <span className="article-category">{catLabels[article.category] || article.category}</span>
              {article.featured && <span className="featured-badge">مميز</span>}
            </div>
            <h1>{article.titleAr || article.title}</h1>
            <div className="article-meta">
              <div className="meta-item"><FaCalendar /><span>{fmtDate(article.createdAt)}</span></div>
              <div className="meta-item"><FaEye /><span>{(article.views || 0) + ' مشاهدة'}</span></div>
              {article.author && <div className="meta-item"><FaUser /><span>{article.author}</span></div>}
            </div>
          </div>

          {article.image && (
            <div className="article-hero-image">
              <img src={getImageUrl(article.image)} alt={article.title} />
            </div>
          )}

          <div className="article-content">
            {article.contentBlocks && article.contentBlocks.length > 0 ? (
              <div className="flexible-content">
                {renderBlocks()}
              </div>
            ) : (
              <div className="content-text" style={{ whiteSpace: 'pre-line' }}>
                {content}
              </div>
            )}
            {article.contentImages && article.contentImages.length > 0 && (!article.contentBlocks || article.contentBlocks.length === 0) && (
              <div className="content-images">
                <h3>صور إضافية</h3>
                <div className="images-grid">
                  {article.contentImages.map(function(img, i) {
                    return (
                      <div key={i} className="content-image">
                        <img src={getImageUrl(img)} alt={'صورة ' + (i + 1)} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="comments-section">
            <h3 className="comments-title"><FaComments /> {'التعليقات (' + comments.length + ')'}</h3>

            {isAuthenticated ? (
              <form className="comment-form" onSubmit={handleAddComment}>
                <div className="comment-input-wrapper">
                  <div className="comment-avatar">{(user && user.fullName) ? user.fullName.charAt(0) : '؟'}</div>
                  <textarea
                    value={commentText}
                    onChange={function(e) { setCommentText(e.target.value); }}
                    placeholder="اكتب تعليقك هنا..."
                    rows="3"
                    required
                  />
                </div>
                <button type="submit" className="comment-submit-btn" disabled={submitting || !commentText.trim()}>
                  <FaPaperPlane /> {submitting ? 'جاري الإرسال...' : 'أضف تعليق'}
                </button>
              </form>
            ) : (
              <div className="comment-login-prompt">
                <p>{'قم '}<span className="login-link" onClick={function() { nav('/login'); }}>بتسجيل الدخول</span>{' لإضافة تعليق'}</p>
              </div>
            )}

            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="no-comments">لا توجد تعليقات بعد. كن أول من يعلق!</p>
              ) : (
                comments.map(function(c) {
                  return (
                    <motion.div key={c._id} className="comment-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="comment-header">
                        <div className="comment-user-info">
                          <div className="comment-avatar-small">{c.userName ? c.userName.charAt(0) : '؟'}</div>
                          <div>
                            <span className="comment-author">{c.userName}</span>
                            <span className="comment-date">{new Date(c.createdAt).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                        {(isAdmin || (user && c.user === user._id)) && (
                          <button className="comment-delete-btn" onClick={function() { handleDeleteComment(c._id); }} title="حذف التعليق">
                            <FaTrash />
                          </button>
                        )}
                      </div>
                      <p className="comment-content" style={{ whiteSpace: 'pre-line' }}>{c.content}</p>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          <div className="article-footer">
            <motion.button className="back-to-articles-btn" onClick={function() { nav('/articles'); }} whileHover={{ scale: 1.05 }}>
              <FaArrowRight /> العودة إلى جميع المقالات
            </motion.button>
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default ArticleDetail;
