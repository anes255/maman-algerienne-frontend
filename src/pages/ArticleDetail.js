import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCalendar, FaEye, FaUser, FaShareAlt, FaComments, FaPaperPlane, FaTrash, FaLink, FaFacebookF, FaTwitter, FaWhatsapp, FaTelegram, FaCopy } from 'react-icons/fa';
import { getArticle, getArticles, getComments, addComment, deleteComment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../styles/ArticleDetail.css';

var ArticleDetail = function() {
  var params = useParams();
  var id = params.id;
  var navigate = useNavigate();
  var _s1 = useState(null);
  var article = _s1[0], setArticle = _s1[1];
  var _s2 = useState(true);
  var loading = _s2[0], setLoading = _s2[1];
  var _s3 = useState([]);
  var comments = _s3[0], setComments = _s3[1];
  var _s4 = useState('');
  var commentText = _s4[0], setCommentText = _s4[1];
  var _s5 = useState(false);
  var submitting = _s5[0], setSubmitting = _s5[1];
  var _s6 = useState([]);
  var relatedArticles = _s6[0], setRelatedArticles = _s6[1];
  var auth = useAuth();
  var user = auth.user;
  var isAuthenticated = auth.isAuthenticated;
  var isAdmin = auth.isAdmin;

  var loadComments = function() {
    getComments(id).then(function(r) { setComments(Array.isArray(r.data) ? r.data : []); }).catch(function() {});
  };

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

  useEffect(function() {
    setLoading(true);
    getArticle(id).then(function(r) {
      setArticle(r.data);
      // Fetch related articles
      if (r.data.relatedArticles && r.data.relatedArticles.length > 0) {
        Promise.all(r.data.relatedArticles.map(function(rid) {
          return getArticle(rid).then(function(res) { return res.data; }).catch(function() { return null; });
        })).then(function(results) {
          setRelatedArticles(results.filter(function(a) { return a !== null; }));
        });
      } else {
        setRelatedArticles([]);
      }
    }).catch(function() { toast.error('خطأ في تحميل المقال'); }).finally(function() { setLoading(false); });
    loadComments();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  var formatDate = function(d) {
    return new Date(d).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  var getImageUrl = function(image) {
    if (!image) return '';
    if (image.startsWith('http') || image.startsWith('blob:')) return image;
    return API_BASE_URL + image;
  };

  var getCategoryLabel = function(cat) {
    var labels = { pregnancy: 'حملي', childcare: 'طفلي', home: 'بيتي', recipes: 'كوزينتي', education: 'مدرستي', trips: 'تحويستي', health: 'صحتي', religion: 'ديني', names: 'الأسماء' };
    return labels[cat] || cat;
  };

  var extractVideoId = function(url) {
    if (!url) return null;
    var yt = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
    if (yt) return { platform: 'youtube', id: yt[1] };
    var vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vm) return { platform: 'vimeo', id: vm[1] };
    return null;
  };

  var handleShare = function() {
    var shareUrl = API_BASE_URL + '/share/article/' + id;
    var title = article ? (article.titleAr || article.title) : '';
    if (navigator.share) {
      navigator.share({ title: title, url: shareUrl }).catch(function() {});
    } else {
      navigator.clipboard.writeText(shareUrl).then(function() {
        toast.success('تم نسخ الرابط');
      }).catch(function() {
        toast.error('فشل نسخ الرابط');
      });
    }
  };

  if (loading) {
    return React.createElement('div', { className: 'loading-container' },
      React.createElement('div', { className: 'spinner' }),
      React.createElement('p', null, 'جاري التحميل...')
    );
  }

  if (!article) {
    return React.createElement('div', { className: 'not-found' },
      React.createElement('h2', null, 'المقال غير موجود'),
      React.createElement('button', { onClick: function() { navigate('/articles'); }, className: 'back-btn' }, 'العودة')
    );
  }

  var content = article.contentAr || article.content || '';
  var articleTitle = article.titleAr || article.title;
  var articleImage = article.image ? getImageUrl(article.image) : '';
  var articleDesc = content.substring(0, 160);
  var pageUrl = window.location.href;

  var renderBlocks = function() {
    if (!article.contentBlocks || article.contentBlocks.length === 0) return null;
    var sorted = [].concat(article.contentBlocks).sort(function(a, b) { return (a.order || 0) - (b.order || 0); });
    return sorted.map(function(block, idx) {
      var key = block.id || idx;
      var settings = block.settings || {};
      var align = settings.align || 'right';
      var size = settings.size || settings.imageSize || settings.videoSize || 'large';

      if (block.type === 'heading') {
        var tag = settings.size || settings.headingSize || 'h2';
        if (['h1','h2','h3','h4'].indexOf(tag) === -1) tag = 'h2';
        return React.createElement(motion.div, { key: key, className: 'content-block block-heading', initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } },
          React.createElement(tag, { style: { textAlign: align, direction: 'rtl' } }, block.content)
        );
      }

      if (block.type === 'paragraph') {
        return React.createElement(motion.div, { key: key, className: 'content-block block-paragraph', initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } },
          React.createElement('div', { style: { textAlign: align, whiteSpace: 'pre-line', direction: 'rtl' } }, block.content)
        );
      }

      if (block.type === 'image' && block.imageUrl) {
        return React.createElement(motion.div, { key: key, className: 'content-block block-image size-' + size + ' align-' + align, initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } },
          React.createElement('img', { src: getImageUrl(block.imageUrl), alt: 'content' })
        );
      }

      if (block.type === 'video' && block.videoUrl) {
        var videoInfo = extractVideoId(block.videoUrl);
        var embedUrl = null;
        if (videoInfo && videoInfo.platform === 'youtube') {
          embedUrl = 'https://www.youtube.com/embed/' + videoInfo.id;
        } else if (videoInfo && videoInfo.platform === 'vimeo') {
          embedUrl = 'https://player.vimeo.com/video/' + videoInfo.id;
        }
        if (!embedUrl) {
          // Try using the URL directly as embed
          if (block.videoUrl.indexOf('youtube.com/embed') !== -1 || block.videoUrl.indexOf('player.vimeo.com') !== -1) {
            embedUrl = block.videoUrl;
          }
        }
        if (embedUrl) {
          return React.createElement(motion.div, { key: key, className: 'content-block block-video size-' + size + ' align-' + align, initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } },
            React.createElement('div', { className: 'video-wrapper' },
              React.createElement('iframe', { src: embedUrl, frameBorder: '0', allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture', allowFullScreen: true, title: 'video' })
            )
          );
        }
        return null;
      }

      if (block.type === 'article-link' && block.linkArticleId && block.linkText) {
        return React.createElement(motion.div, { key: key, className: 'content-block block-article-link align-' + align, initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } },
          React.createElement('button', {
            className: 'article-link-btn',
            onClick: function() { navigate('/articles/' + block.linkArticleId); }
          }, React.createElement(FaLink, null), ' ', block.linkText)
        );
      }

      return null;
    });
  };

  return React.createElement('div', { className: 'article-detail-page' },
    React.createElement(Helmet, null,
      React.createElement('title', null, articleTitle + ' | Maman Algérienne'),
      React.createElement('meta', { name: 'description', content: articleDesc }),
      React.createElement('meta', { property: 'og:title', content: articleTitle }),
      React.createElement('meta', { property: 'og:description', content: articleDesc }),
      React.createElement('meta', { property: 'og:image', content: articleImage }),
      React.createElement('meta', { property: 'og:url', content: pageUrl }),
      React.createElement('meta', { property: 'og:type', content: 'article' }),
      React.createElement('meta', { name: 'twitter:card', content: 'summary_large_image' }),
      React.createElement('meta', { name: 'twitter:title', content: articleTitle }),
      React.createElement('meta', { name: 'twitter:description', content: articleDesc }),
      React.createElement('meta', { name: 'twitter:image', content: articleImage })
    ),
    React.createElement('div', { className: 'container' },
      React.createElement(motion.button, { className: 'back-button', onClick: function() { navigate('/articles'); }, initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 } },
        React.createElement(FaArrowRight, null), ' العودة إلى المقالات'
      ),
      React.createElement(motion.article, { className: 'article-detail', initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 } },
        React.createElement('div', { className: 'article-header' },
          React.createElement('div', { className: 'article-meta-top' },
            React.createElement('span', { className: 'article-category' }, getCategoryLabel(article.category)),
            article.featured && React.createElement('span', { className: 'featured-badge' }, 'مميز')
          ),
          React.createElement('h1', null, articleTitle),
          React.createElement('div', { className: 'article-meta' },
            React.createElement('div', { className: 'meta-item' }, React.createElement(FaCalendar, null), React.createElement('span', null, formatDate(article.createdAt))),
            React.createElement('div', { className: 'meta-item' }, React.createElement(FaEye, null), React.createElement('span', null, (article.views || 0) + ' مشاهدة')),
            article.author && React.createElement('div', { className: 'meta-item' }, React.createElement(FaUser, null), React.createElement('span', null, article.author))
          )
        ),
        article.image && React.createElement('div', { className: 'article-hero-image' },
          React.createElement('img', { src: getImageUrl(article.image), alt: articleTitle })
        ),
        React.createElement('div', { className: 'article-content' },
          article.contentBlocks && article.contentBlocks.length > 0
            ? React.createElement('div', { className: 'flexible-content' }, renderBlocks())
            : React.createElement('div', { className: 'content-text', style: { whiteSpace: 'pre-line', direction: 'rtl' } }, content),
          article.contentImages && article.contentImages.length > 0 && (!article.contentBlocks || article.contentBlocks.length === 0) &&
            React.createElement('div', { className: 'content-images' },
              React.createElement('h3', null, 'صور إضافية'),
              React.createElement('div', { className: 'images-grid' },
                article.contentImages.map(function(img, i) {
                  return React.createElement('div', { key: i, className: 'content-image' },
                    React.createElement('img', { src: getImageUrl(img), alt: 'صورة ' + (i + 1) })
                  );
                })
              )
            )
        ),
        // Social Share Section
        React.createElement('div', { className: 'social-share-section' },
          React.createElement('h3', { className: 'share-section-title' }, React.createElement(FaShareAlt, null), ' شاركي هذا المقال'),
          React.createElement('div', { className: 'share-buttons' },
            React.createElement('button', {
              className: 'share-icon-btn facebook',
              onClick: function() { window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(API_BASE_URL + '/share/article/' + id), '_blank'); },
              title: 'فيسبوك'
            }, React.createElement(FaFacebookF, null), React.createElement('span', null, 'فيسبوك')),
            React.createElement('button', {
              className: 'share-icon-btn twitter',
              onClick: function() { window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent(API_BASE_URL + '/share/article/' + id) + '&text=' + encodeURIComponent(articleTitle), '_blank'); },
              title: 'تويتر'
            }, React.createElement(FaTwitter, null), React.createElement('span', null, 'تويتر')),
            React.createElement('button', {
              className: 'share-icon-btn whatsapp',
              onClick: function() { window.open('https://wa.me/?text=' + encodeURIComponent(articleTitle + ' ' + API_BASE_URL + '/share/article/' + id), '_blank'); },
              title: 'واتساب'
            }, React.createElement(FaWhatsapp, null), React.createElement('span', null, 'واتساب')),
            React.createElement('button', {
              className: 'share-icon-btn telegram',
              onClick: function() { window.open('https://t.me/share/url?url=' + encodeURIComponent(API_BASE_URL + '/share/article/' + id) + '&text=' + encodeURIComponent(articleTitle), '_blank'); },
              title: 'تيليغرام'
            }, React.createElement(FaTelegram, null), React.createElement('span', null, 'تيليغرام')),
            React.createElement('button', {
              className: 'share-icon-btn copy-link',
              onClick: function() {
                navigator.clipboard.writeText(API_BASE_URL + '/share/article/' + id).then(function() { toast.success('تم نسخ الرابط'); }).catch(function() { toast.error('فشل نسخ الرابط'); });
              },
              title: 'نسخ الرابط'
            }, React.createElement(FaCopy, null), React.createElement('span', null, 'نسخ الرابط'))
          )
        ),
        // Related Articles Section
        relatedArticles.length > 0 && React.createElement('div', { className: 'related-articles-section' },
          React.createElement('h3', { className: 'related-title' }, '📖 مقالات ذات صلة'),
          React.createElement('div', { className: 'related-articles-grid' },
            relatedArticles.map(function(ra) {
              return React.createElement(motion.div, {
                key: ra._id,
                className: 'related-article-card',
                whileHover: { y: -5 },
                onClick: function() { navigate('/articles/' + ra._id); }
              },
                React.createElement('div', { className: 'related-article-image' },
                  React.createElement('img', { src: getImageUrl(ra.image), alt: ra.titleAr || ra.title })
                ),
                React.createElement('div', { className: 'related-article-info' },
                  React.createElement('h4', null, ra.titleAr || ra.title),
                  React.createElement('p', null, (ra.contentAr || ra.content || '').substring(0, 80) + '...'),
                  React.createElement('span', { className: 'related-read-more' }, 'اقرأ المزيد ←')
                )
              );
            })
          )
        ),
        // Comments Section
        React.createElement('div', { className: 'comments-section' },
          React.createElement('h3', { className: 'comments-title' }, React.createElement(FaComments, null), ' التعليقات (' + comments.length + ')'),
          isAuthenticated
            ? React.createElement('form', { className: 'comment-form', onSubmit: handleAddComment },
                React.createElement('div', { className: 'comment-input-wrapper' },
                  React.createElement('div', { className: 'comment-avatar' }, user && user.fullName ? user.fullName.charAt(0) : '؟'),
                  React.createElement('textarea', { value: commentText, onChange: function(e) { setCommentText(e.target.value); }, placeholder: 'اكتب تعليقك هنا...', rows: '3', required: true })
                ),
                React.createElement('button', { type: 'submit', className: 'comment-submit-btn', disabled: submitting || !commentText.trim() },
                  React.createElement(FaPaperPlane, null), submitting ? ' جاري الإرسال...' : ' أضف تعليق'
                )
              )
            : React.createElement('div', { className: 'comment-login-prompt' },
                React.createElement('p', null, 'قم ', React.createElement('span', { className: 'login-link', onClick: function() { navigate('/login'); } }, 'بتسجيل الدخول'), ' لإضافة تعليق')
              ),
          React.createElement('div', { className: 'comments-list' },
            comments.length === 0
              ? React.createElement('p', { className: 'no-comments' }, 'لا توجد تعليقات بعد. كن أول من يعلق!')
              : comments.map(function(c) {
                  return React.createElement(motion.div, { key: c._id, className: 'comment-card', initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } },
                    React.createElement('div', { className: 'comment-header' },
                      React.createElement('div', { className: 'comment-user-info' },
                        React.createElement('div', { className: 'comment-avatar-small' }, c.userName ? c.userName.charAt(0) : '؟'),
                        React.createElement('div', null,
                          React.createElement('span', { className: 'comment-author' }, c.userName),
                          React.createElement('span', { className: 'comment-date' }, new Date(c.createdAt).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }))
                        )
                      ),
                      (isAdmin || (user && c.user === user._id))
                        ? React.createElement('button', { className: 'comment-delete-btn', onClick: function() { handleDeleteComment(c._id); }, title: 'حذف التعليق' }, React.createElement(FaTrash, null))
                        : null
                    ),
                    React.createElement('p', { className: 'comment-content', style: { whiteSpace: 'pre-line' } }, c.content)
                  );
                })
          )
        ),
        React.createElement('div', { className: 'article-footer' },
          React.createElement(motion.button, { className: 'back-to-articles-btn', onClick: function() { navigate('/articles'); }, whileHover: { scale: 1.05 } },
            React.createElement(FaArrowRight, null), ' العودة إلى جميع المقالات'
          )
        )
      )
    )
  );
};

export default ArticleDetail;
