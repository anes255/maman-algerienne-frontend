import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCalendar, FaEye, FaUser, FaShareAlt } from 'react-icons/fa';
import { getArticle } from '../services/api';
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

  useEffect(function() {
    setLoading(true);
    getArticle(id).then(function(r) { setArticle(r.data); }).catch(function() { toast.error('خطأ في تحميل المقال'); }).finally(function() { setLoading(false); });
  }, [id]);

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
    var url = window.location.href;
    var title = article ? (article.titleAr || article.title) : '';
    if (navigator.share) {
      navigator.share({ title: title, url: url }).catch(function() {});
    } else {
      navigator.clipboard.writeText(url).then(function() {
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
      var align = settings.alignment || settings.align || 'right';
      var size = settings.size || settings.imageSize || settings.videoSize || 'large';

      if (block.type === 'heading') {
        var tag = settings.headingSize || settings.size || 'h2';
        if (['h1','h2','h3','h4'].indexOf(tag) === -1) tag = 'h2';
        return React.createElement(motion.div, { key: key, className: 'content-block block-heading', initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } },
          React.createElement(tag, { style: { textAlign: align } }, block.content)
        );
      }

      if (block.type === 'paragraph') {
        return React.createElement(motion.div, { key: key, className: 'content-block block-paragraph', initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } },
          React.createElement('div', { style: { textAlign: align, whiteSpace: 'pre-line' } }, block.content)
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
            article.author && React.createElement('div', { className: 'meta-item' }, React.createElement(FaUser, null), React.createElement('span', null, article.author)),
            React.createElement('button', { className: 'share-btn', onClick: handleShare, title: 'مشاركة المقال' }, React.createElement(FaShareAlt, null), ' مشاركة')
          )
        ),
        article.image && React.createElement('div', { className: 'article-hero-image' },
          React.createElement('img', { src: getImageUrl(article.image), alt: articleTitle })
        ),
        React.createElement('div', { className: 'article-content' },
          article.contentBlocks && article.contentBlocks.length > 0
            ? React.createElement('div', { className: 'flexible-content' }, renderBlocks())
            : React.createElement('div', { className: 'content-text', style: { whiteSpace: 'pre-line' } }, content),
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
