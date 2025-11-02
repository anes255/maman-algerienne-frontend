import { API_BASE_URL } from '../config';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaHeading, FaParagraph, 
  FaImage, FaAlignLeft, FaAlignCenter, FaAlignRight, FaVideo, FaBold,
  FaItalic, FaUnderline, FaListUl, FaListOl, FaQuoteRight
} from 'react-icons/fa';
import '../styles/ArticleEditor.css';

const ArticleEditor = ({ initialBlocks = [], onBlocksChange, contentImages = [] }) => {
  const [blocks, setBlocks] = useState([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const isInitialized = useRef(false);
  const saveTimeoutRef = useRef(null);

  // Initialize once from props
  useEffect(() => {
    if (!isInitialized.current) {
      const initBlocks = initialBlocks.map((block, idx) => ({
        ...block,
        id: block.id || `block-${Date.now()}-${idx}`
      }));
      setBlocks(initBlocks);
      isInitialized.current = true;
    }
  }, []);

  // Auto-save with debounce
  useEffect(() => {
    if (!isInitialized.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (onBlocksChange) {
        onBlocksChange(blocks);
      }
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [blocks]);

  // Add new block
  const addBlock = (type) => {
    const newBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: '',
      imageUrl: '',
      videoUrl: '',
      caption: '',
      settings: {
        size: type === 'heading' ? 'h2' : type === 'image' ? 'medium' : type === 'video' ? 'large' : 'normal',
        align: 'right',
        style: {}
      }
    };
    
    setBlocks(prev => [...prev, newBlock]);
    setShowAddMenu(false);
  };

  // Update block content
  const updateBlock = (id, field, value) => {
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, [field]: value } : block
    ));
  };

  // Update block settings
  const updateSettings = (id, field, value) => {
    setBlocks(prev => prev.map(block => 
      block.id === id 
        ? { ...block, settings: { ...block.settings, [field]: value } }
        : block
    ));
  };

  // Delete block
  const deleteBlock = (id) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
  };

  // Move block up
  const moveUp = (index) => {
    if (index === 0) return;
    setBlocks(prev => {
      const newBlocks = [...prev];
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      return newBlocks;
    });
  };

  // Move block down
  const moveDown = (index) => {
    if (index === blocks.length - 1) return;
    setBlocks(prev => {
      const newBlocks = [...prev];
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
      return newBlocks;
    });
  };

  // Extract video ID
  const getVideoEmbed = (url) => {
    if (!url) return null;
    
    // YouTube
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const ytMatch = url.match(ytRegex);
    if (ytMatch) {
      return { type: 'youtube', id: ytMatch[1] };
    }

    // Vimeo
    const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return { type: 'vimeo', id: vimeoMatch[1] };
    }

    return null;
  };

  // Render block based on type
  const renderBlock = (block, index) => {
    const commonControls = (
      <div className="block-toolbar">
        <div className="block-info">
          <span className="block-type-badge">
            {block.type === 'heading' && '📝 عنوان'}
            {block.type === 'paragraph' && '📄 فقرة'}
            {block.type === 'image' && '🖼️ صورة'}
            {block.type === 'video' && '🎥 فيديو'}
          </span>
        </div>
        
        <div className="block-actions">
          <button 
            type="button"
            onClick={() => moveUp(index)}
            disabled={index === 0}
            className="btn-icon"
            title="تحريك لأعلى"
          >
            <FaArrowUp />
          </button>
          <button 
            type="button"
            onClick={() => moveDown(index)}
            disabled={index === blocks.length - 1}
            className="btn-icon"
            title="تحريك لأسفل"
          >
            <FaArrowDown />
          </button>
          <button 
            type="button"
            onClick={() => deleteBlock(block.id)}
            className="btn-icon btn-danger"
            title="حذف"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    );

    switch (block.type) {
      case 'heading':
        return (
          <div className="editor-block heading-block">
            {commonControls}
            <div className="block-settings">
              <label>الحجم:</label>
              <select
                value={block.settings.size}
                onChange={(e) => updateSettings(block.id, 'size', e.target.value)}
              >
                <option value="h1">عنوان رئيسي (H1)</option>
                <option value="h2">عنوان كبير (H2)</option>
                <option value="h3">عنوان متوسط (H3)</option>
                <option value="h4">عنوان صغير (H4)</option>
              </select>

              <label>المحاذاة:</label>
              <div className="align-btns">
                {['right', 'center', 'left'].map(align => (
                  <button
                    key={align}
                    type="button"
                    className={block.settings.align === align ? 'active' : ''}
                    onClick={() => updateSettings(block.id, 'align', align)}
                  >
                    {align === 'right' && <FaAlignRight />}
                    {align === 'center' && <FaAlignCenter />}
                    {align === 'left' && <FaAlignLeft />}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              className={`heading-input ${block.settings.size}`}
              style={{ textAlign: block.settings.align }}
              placeholder="اكتب العنوان هنا..."
              value={block.content}
              onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
            />
          </div>
        );

      case 'paragraph':
        return (
          <div className="editor-block paragraph-block">
            {commonControls}
            <div className="block-settings">
              <label>المحاذاة:</label>
              <div className="align-btns">
                {['right', 'center', 'left'].map(align => (
                  <button
                    key={align}
                    type="button"
                    className={block.settings.align === align ? 'active' : ''}
                    onClick={() => updateSettings(block.id, 'align', align)}
                  >
                    {align === 'right' && <FaAlignRight />}
                    {align === 'center' && <FaAlignCenter />}
                    {align === 'left' && <FaAlignLeft />}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              className="paragraph-input"
              style={{ textAlign: block.settings.align }}
              placeholder="اكتب النص هنا..."
              value={block.content}
              onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
              rows="6"
            />
          </div>
        );

      case 'image':
        return (
          <div className="editor-block image-block">
            {commonControls}
            <div className="block-settings">
              <label>الحجم:</label>
              <select
                value={block.settings.size}
                onChange={(e) => updateSettings(block.id, 'size', e.target.value)}
              >
                <option value="small">صغير (400px)</option>
                <option value="medium">متوسط (600px)</option>
                <option value="large">كبير (800px)</option>
                <option value="full">عرض كامل</option>
              </select>

              <label>المحاذاة:</label>
              <div className="align-btns">
                {['right', 'center', 'left'].map(align => (
                  <button
                    key={align}
                    type="button"
                    className={block.settings.align === align ? 'active' : ''}
                    onClick={() => updateSettings(block.id, 'align', align)}
                  >
                    {align === 'right' && <FaAlignRight />}
                    {align === 'center' && <FaAlignCenter />}
                    {align === 'left' && <FaAlignLeft />}
                  </button>
                ))}
              </div>
            </div>

            <div className="image-selection">
              <p className="hint">اختر صورة من الصور المرفوعة:</p>
              {contentImages.length > 0 ? (
                <div className="image-grid">
                  {contentImages.map((img, idx) => (
                    <div
                      key={idx}
                      className={`image-card ${block.imageUrl === img ? 'selected' : ''}`}
                      onClick={() => updateBlock(block.id, 'imageUrl', img)}
                    >
                      <img 
                        src={img.startsWith('blob:') || img.startsWith('http') ? img : `${API_BASE_URL}${img}`}
                        alt={`صورة ${idx + 1}`}
                      />
                      {block.imageUrl === img && <div className="selected-badge">✓</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>لم يتم رفع أي صور بعد</p>
                  <small>ارفع صور المحتوى من الحقل أعلى الصفحة</small>
                </div>
              )}

              {block.imageUrl && (
                <>
                  <div className={`image-preview size-${block.settings.size} align-${block.settings.align}`}>
                    <img 
                      src={block.imageUrl.startsWith('blob:') || block.imageUrl.startsWith('http') 
                        ? block.imageUrl 
                        : `${API_BASE_URL}${block.imageUrl}`
                      }
                      alt="معاينة"
                    />
                  </div>
                  <input
                    type="text"
                    className="caption-input"
                    placeholder="أضف وصفاً للصورة (اختياري)"
                    value={block.caption || ''}
                    onChange={(e) => updateBlock(block.id, 'caption', e.target.value)}
                  />
                </>
              )}
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="editor-block video-block">
            {commonControls}
            <div className="block-settings">
              <label>الحجم:</label>
              <select
                value={block.settings.size}
                onChange={(e) => updateSettings(block.id, 'size', e.target.value)}
              >
                <option value="medium">متوسط (600px)</option>
                <option value="large">كبير (800px)</option>
                <option value="full">عرض كامل</option>
              </select>

              <label>المحاذاة:</label>
              <div className="align-btns">
                {['right', 'center', 'left'].map(align => (
                  <button
                    key={align}
                    type="button"
                    className={block.settings.align === align ? 'active' : ''}
                    onClick={() => updateSettings(block.id, 'align', align)}
                  >
                    {align === 'right' && <FaAlignRight />}
                    {align === 'center' && <FaAlignCenter />}
                    {align === 'left' && <FaAlignLeft />}
                  </button>
                ))}
              </div>
            </div>

            <div className="video-input">
              <label>رابط الفيديو:</label>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=... أو https://vimeo.com/..."
                value={block.videoUrl || ''}
                onChange={(e) => updateBlock(block.id, 'videoUrl', e.target.value)}
              />
              <small>يدعم YouTube و Vimeo</small>
            </div>

            {block.videoUrl && (() => {
              const embed = getVideoEmbed(block.videoUrl);
              if (embed) {
                return (
                  <div className={`video-preview size-${block.settings.size} align-${block.settings.align}`}>
                    <iframe
                      src={embed.type === 'youtube' 
                        ? `https://www.youtube.com/embed/${embed.id}`
                        : `https://player.vimeo.com/video/${embed.id}`
                      }
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="معاينة الفيديو"
                    />
                  </div>
                );
              } else if (block.videoUrl.trim()) {
                return <p className="error-msg">⚠️ رابط غير صالح. استخدم رابط YouTube أو Vimeo</p>;
              }
            })()}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="new-article-editor">
      <div className="editor-header">
        <h3>✨ محرر المحتوى المرن</h3>
        <p>قم بإنشاء مقالات احترافية بسهولة</p>
      </div>

      <div className="blocks-list">
        <AnimatePresence>
          {blocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2 }}
            >
              {renderBlock(block, index)}
            </motion.div>
          ))}
        </AnimatePresence>

        {blocks.length === 0 && (
          <div className="empty-editor">
            <p>👋 ابدأ بإضافة عنصر إلى المقال</p>
          </div>
        )}
      </div>

      <div className="add-section">
        <button
          type="button"
          className="add-btn"
          onClick={() => setShowAddMenu(!showAddMenu)}
        >
          <FaPlus /> إضافة عنصر
        </button>

        {showAddMenu && (
          <motion.div
            className="add-menu"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
          >
            <button type="button" onClick={() => addBlock('heading')} className="menu-item">
              <FaHeading className="icon" />
              <div>
                <strong>عنوان</strong>
                <small>أضف عنواناً للمقال</small>
              </div>
            </button>
            <button type="button" onClick={() => addBlock('paragraph')} className="menu-item">
              <FaParagraph className="icon" />
              <div>
                <strong>فقرة</strong>
                <small>أضف نصاً أو فقرة</small>
              </div>
            </button>
            <button type="button" onClick={() => addBlock('image')} className="menu-item">
              <FaImage className="icon" />
              <div>
                <strong>صورة</strong>
                <small>أدرج صورة في المقال</small>
              </div>
            </button>
            <button type="button" onClick={() => addBlock('video')} className="menu-item">
              <FaVideo className="icon" />
              <div>
                <strong>فيديو</strong>
                <small>أضف فيديو من YouTube أو Vimeo</small>
              </div>
            </button>
          </motion.div>
        )}
      </div>

      <div className="editor-stats">
        <small>
          📊 {blocks.length} عنصر في المقال
          {blocks.filter(b => b.type === 'paragraph').length > 0 && 
            ` • ${blocks.filter(b => b.type === 'paragraph').reduce((sum, b) => sum + (b.content?.split(' ').length || 0), 0)} كلمة`
          }
        </small>
      </div>
    </div>
  );
};

export default ArticleEditor;
