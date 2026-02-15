import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaHeading, FaParagraph, FaImage, FaAlignLeft, FaAlignCenter, FaAlignRight, FaVideo } from 'react-icons/fa';
import { getImageUrl } from '../config';
import '../styles/ArticleEditor.css';

const ArticleEditor = ({ initialBlocks = [], onBlocksChange, contentImages = [] }) => {
  const [blocks, setBlocks] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const init = useRef(false);
  const timer = useRef(null);

  useEffect(() => {
    if (!init.current) {
      setBlocks(initialBlocks.map((b, i) => ({ ...b, id: b.id || `b-${Date.now()}-${i}` })));
      init.current = true;
    }
  }, []);

  useEffect(() => {
    if (!init.current) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onBlocksChange?.(blocks), 500);
    return () => clearTimeout(timer.current);
  }, [blocks]);

  const add = (type) => {
    setBlocks(p => [...p, {
      id: `b-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      type, content: '', imageUrl: '', videoUrl: '', caption: '',
      settings: { size: type === 'heading' ? 'h2' : type === 'video' ? 'large' : 'medium', align: 'right' }
    }]);
    setShowMenu(false);
  };

  const upd = (id, field, val) => setBlocks(p => p.map(b => b.id === id ? { ...b, [field]: val } : b));
  const updSet = (id, field, val) => setBlocks(p => p.map(b => b.id === id ? { ...b, settings: { ...b.settings, [field]: val } } : b));
  const del = (id) => setBlocks(p => p.filter(b => b.id !== id));
  const move = (i, dir) => {
    setBlocks(p => {
      const a = [...p];
      const j = i + dir;
      if (j < 0 || j >= a.length) return a;
      [a[i], a[j]] = [a[j], a[i]];
      return a;
    });
  };

  const getEmbed = (url) => {
    if (!url) return null;
    const yt = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
    if (yt) return { type: 'youtube', id: yt[1] };
    const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vm) return { type: 'vimeo', id: vm[1] };
    return null;
  };

  const AlignBtns = ({ block }) => (
    <div className="align-btns">
      {['right', 'center', 'left'].map(a => (
        <button key={a} type="button" className={block.settings.align === a ? 'active' : ''} onClick={() => updSet(block.id, 'align', a)}>
          {a === 'right' ? <FaAlignRight /> : a === 'center' ? <FaAlignCenter /> : <FaAlignLeft />}
        </button>
      ))}
    </div>
  );

  const Toolbar = ({ block, index }) => (
    <div className="block-toolbar">
      <span className="block-type-badge">
        {block.type === 'heading' && '📝 عنوان'}{block.type === 'paragraph' && '📄 فقرة'}
        {block.type === 'image' && '🖼️ صورة'}{block.type === 'video' && '🎥 فيديو'}
      </span>
      <div className="block-actions">
        <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="btn-icon"><FaArrowUp /></button>
        <button type="button" onClick={() => move(index, 1)} disabled={index === blocks.length - 1} className="btn-icon"><FaArrowDown /></button>
        <button type="button" onClick={() => del(block.id)} className="btn-icon btn-danger"><FaTrash /></button>
      </div>
    </div>
  );

  return (
    <div className="new-article-editor">
      <div className="editor-header"><h3>✨ محرر المحتوى المرن</h3><p>قم بإنشاء مقالات احترافية بسهولة</p></div>

      <div className="blocks-list">
        <AnimatePresence>
          {blocks.map((block, i) => (
            <motion.div key={block.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }}>
              <div className="editor-block">
                <Toolbar block={block} index={i} />
                {block.type === 'heading' && (
                  <>
                    <div className="block-settings">
                      <label>الحجم:</label>
                      <select value={block.settings.size} onChange={e => updSet(block.id, 'size', e.target.value)}>
                        <option value="h1">H1</option><option value="h2">H2</option><option value="h3">H3</option><option value="h4">H4</option>
                      </select>
                      <label>المحاذاة:</label><AlignBtns block={block} />
                    </div>
                    <input type="text" className={`heading-input ${block.settings.size}`} style={{ textAlign: block.settings.align }} placeholder="اكتب العنوان هنا..." value={block.content} onChange={e => upd(block.id, 'content', e.target.value)} />
                  </>
                )}
                {block.type === 'paragraph' && (
                  <>
                    <div className="block-settings"><label>المحاذاة:</label><AlignBtns block={block} /></div>
                    <textarea className="paragraph-input" style={{ textAlign: block.settings.align }} placeholder="اكتب النص هنا..." value={block.content} onChange={e => upd(block.id, 'content', e.target.value)} rows="6" />
                  </>
                )}
                {block.type === 'image' && (
                  <>
                    <div className="block-settings">
                      <label>الحجم:</label>
                      <select value={block.settings.size} onChange={e => updSet(block.id, 'size', e.target.value)}>
                        <option value="small">صغير</option><option value="medium">متوسط</option><option value="large">كبير</option><option value="full">كامل</option>
                      </select>
                      <label>المحاذاة:</label><AlignBtns block={block} />
                    </div>
                    <div className="image-selection">
                      {contentImages.length > 0 ? (
                        <div className="image-grid">
                          {contentImages.map((img, idx) => (
                            <div key={idx} className={`image-card ${block.imageUrl === img ? 'selected' : ''}`} onClick={() => upd(block.id, 'imageUrl', img)}>
                              <img src={getImageUrl(img)} alt={`صورة ${idx + 1}`} />
                              {block.imageUrl === img && <div className="selected-badge">✓</div>}
                            </div>
                          ))}
                        </div>
                      ) : <div className="empty-state"><p>لم يتم رفع أي صور بعد</p></div>}
                      {block.imageUrl && (
                        <div className={`image-preview size-${block.settings.size}`}>
                          <img src={getImageUrl(block.imageUrl)} alt="معاينة" />
                        </div>
                      )}
                    </div>
                  </>
                )}
                {block.type === 'video' && (
                  <>
                    <div className="block-settings">
                      <label>الحجم:</label>
                      <select value={block.settings.size} onChange={e => updSet(block.id, 'size', e.target.value)}>
                        <option value="medium">متوسط</option><option value="large">كبير</option><option value="full">كامل</option>
                      </select>
                      <label>المحاذاة:</label><AlignBtns block={block} />
                    </div>
                    <div className="video-input">
                      <input type="url" placeholder="https://www.youtube.com/watch?v=..." value={block.videoUrl || ''} onChange={e => upd(block.id, 'videoUrl', e.target.value)} />
                    </div>
                    {block.videoUrl && getEmbed(block.videoUrl) && (
                      <div className={`video-preview size-${block.settings.size}`}>
                        <iframe
                          src={getEmbed(block.videoUrl).type === 'youtube' ? `https://www.youtube.com/embed/${getEmbed(block.videoUrl).id}` : `https://player.vimeo.com/video/${getEmbed(block.videoUrl).id}`}
                          frameBorder="0" allowFullScreen title="video"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {blocks.length === 0 && <div className="empty-editor"><p>👋 ابدأ بإضافة عنصر إلى المقال</p></div>}
      </div>

      <div className="add-section">
        <button type="button" className="add-btn" onClick={() => setShowMenu(!showMenu)}><FaPlus /> إضافة عنصر</button>
        {showMenu && (
          <motion.div className="add-menu" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <button type="button" onClick={() => add('heading')} className="menu-item"><FaHeading /><div><strong>عنوان</strong></div></button>
            <button type="button" onClick={() => add('paragraph')} className="menu-item"><FaParagraph /><div><strong>فقرة</strong></div></button>
            <button type="button" onClick={() => add('image')} className="menu-item"><FaImage /><div><strong>صورة</strong></div></button>
            <button type="button" onClick={() => add('video')} className="menu-item"><FaVideo /><div><strong>فيديو</strong></div></button>
          </motion.div>
        )}
      </div>

      <div className="editor-stats">
        <small>📊 {blocks.length} عنصر في المقال</small>
      </div>
    </div>
  );
};

export default ArticleEditor;
