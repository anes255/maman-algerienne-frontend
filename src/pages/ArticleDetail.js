.article-detail-page {
  padding: 40px 0;
  min-height: 80vh;
  background: linear-gradient(135deg, #fff5f7 0%, #ffe8ef 100%);
}

.back-button {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 30px;
  padding: 12px 24px;
  border-radius: 30px;
  transition: var(--transition);
  box-shadow: 0 2px 8px rgba(255, 105, 180, 0.2);
}

.back-button:hover {
  background: var(--primary-color);
  color: white;
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
}

.article-detail {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: visible;
}

.article-header {
  padding: 50px 40px;
  background: linear-gradient(135deg, rgba(255, 105, 180, 0.15), rgba(255, 182, 193, 0.15));
  border-bottom: 3px solid var(--primary-color);
  position: relative;
}

.article-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color), var(--primary-color));
}

.article-meta-top {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.article-category {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 10px 24px;
  border-radius: 25px;
  font-weight: 700;
  font-size: 0.95rem;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.featured-badge {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: white;
  padding: 10px 24px;
  border-radius: 25px;
  font-weight: 700;
  font-size: 0.95rem;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.article-header h1 {
  font-size: 2.8rem;
  color: var(--text-color);
  line-height: 1.3;
  margin-bottom: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  color: #666;
  font-size: 0.95rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-item svg {
  color: var(--primary-color);
}

.article-image-container {
  width: 100%;
  height: 500px;
  overflow: hidden;
}

.article-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  padding: 70px 50px;
  background: white;
}

.flexible-content {
  max-width: 900px;
  margin: 0 auto;
}

.content-block {
  margin-bottom: 50px;
  animation: fadeInUp 0.6s ease-out;
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.content-block h2 {
  font-size: 2.2rem;
  color: var(--primary-color);
  font-weight: 800;
  margin-bottom: 24px;
  line-height: 1.4;
  position: relative;
  padding-bottom: 16px;
}

.content-block h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), transparent);
  border-radius: 2px;
}

.content-block h3 {
  font-size: 1.8rem;
  color: var(--primary-color);
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.4;
  position: relative;
  padding-right: 20px;
}

.content-block h3::before {
  content: '▸';
  position: absolute;
  right: 0;
  color: var(--primary-color);
  font-size: 1.5rem;
}

.content-block h4 {
  font-size: 1.4rem;
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 16px;
  line-height: 1.4;
  padding-right: 15px;
  border-right: 4px solid var(--primary-color);
}

.content-block p {
  font-size: 1.15rem;
  line-height: 2;
  color: #444;
  margin-bottom: 24px;
  text-align: justify;
  font-weight: 400;
}

/* First letter styling removed as per user request */

.block-image {
  margin: 40px 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.block-image:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.block-image img {
  width: 100%;
  height: auto;
  display: block;
}

.block-image.size-small {
  width: 33%;
}

.block-image.size-medium {
  width: 66%;
}

.block-image.size-large {
  width: 90%;
}

.block-image.size-full {
  width: 100%;
}

.block-image.align-left {
  margin-left: 0;
  margin-right: auto;
}

.block-image.align-center {
  margin-left: auto;
  margin-right: auto;
}

.block-image.align-right {
  margin-left: auto;
  margin-right: 0;
}

.block-video {
  margin: 40px 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.block-video .video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
}

.block-video .video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.block-video.size-medium {
  width: 66%;
}

.block-video.size-large {
  width: 90%;
}

.block-video.size-full {
  width: 100%;
}

.block-video.align-left {
  margin-left: 0;
  margin-right: auto;
}

.block-video.align-center {
  margin-left: auto;
  margin-right: auto;
}

.block-video.align-right {
  margin-left: auto;
  margin-right: 0;
}

.content-text {
  max-width: 800px;
  margin: 0 auto;
  line-height: 2;
  font-size: 1.1rem;
  color: #333;
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

.content-text p {
  margin-bottom: 25px;
  text-align: justify;
  background: transparent;
  border: none;
  padding: 0;
}

/* First letter styling removed as per user request */

.content-images {
  max-width: 1000px;
  margin: 60px auto 0;
  padding-top: 40px;
  border-top: 2px solid var(--bg-color);
}

.content-images h3 {
  font-size: 1.8rem;
  color: var(--text-color);
  margin-bottom: 30px;
  text-align: center;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.content-image {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: var(--transition);
}

.content-image:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.content-image img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  display: block;
}

.article-footer {
  padding: 40px;
  background: var(--bg-color);
  text-align: center;
}

.back-to-articles-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
}

.back-to-articles-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--bg-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.not-found {
  text-align: center;
  padding: 100px 20px;
}

.not-found h2 {
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 30px;
}

.not-found .back-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.not-found .back-btn:hover {
  background: var(--secondary-color);
  transform: translateY(-3px);
}

/* Responsive Design */
@media (max-width: 992px) {
  .article-header {
    padding: 30px;
  }

  .article-header h1 {
    font-size: 2rem;
  }

  .article-image-container {
    height: 400px;
  }

  .article-content {
    padding: 40px 30px;
  }

  .content-text {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .article-detail-page {
    padding: 15px 10px;
  }

  .article-detail {
    border-radius: 12px;
  }

  .back-button {
    padding: 10px 15px;
    font-size: 0.9rem;
  }

  .article-header {
    padding: 25px 15px;
  }

  .article-header h1 {
    font-size: 1.5rem;
  }

  .article-meta {
    gap: 12px;
    font-size: 0.85rem;
  }

  .article-content {
    padding: 25px 15px;
  }

  .content-block h2 {
    font-size: 1.6rem;
  }

  .content-block h3 {
    font-size: 1.3rem;
  }

  .content-block h4 {
    font-size: 1.1rem;
  }

  .content-block p {
    font-size: 1rem;
    line-height: 1.8;
  /* First letter styling removed */
  }

  .block-image.size-small,
  .block-image.size-medium,
  .block-image.size-large {
    width: 100% !important;
  }

  .block-video.size-medium,
  .block-video.size-large {
    width: 100% !important;
  }

  .content-text {
    font-size: 0.95rem;
    line-height: 1.8;
  /* First letter styling removed */
  }

  .content-images h3 {
    font-size: 1.5rem;
  }

  .images-grid {
    grid-template-columns: 1fr;
  }

  .content-image img {
    height: 200px;
  }

  .article-footer {
    padding: 30px 20px;
  }
}

/* ═══════════════════════════════════════ */
/*  COMMENTS SECTION                       */
/* ═══════════════════════════════════════ */

.comments-section {
  max-width: 800px;
  margin: 40px auto 0;
  padding: 30px 40px;
  border-top: 2px solid #f0f0f0;
}

.comments-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4rem;
  color: #2d3748;
  margin-bottom: 25px;
}

.comments-title svg {
  color: var(--primary-color, #FF69B4);
}

/* Comment Form */
.comment-form {
  margin-bottom: 30px;
}

.comment-input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 12px;
}

.comment-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color, #FF69B4), var(--secondary-color, #FFC0CB));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.comment-form textarea {
  flex: 1;
  padding: 14px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.3s ease;
}

.comment-form textarea:focus {
  outline: none;
  border-color: var(--primary-color, #FF69B4);
}

.comment-submit-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: var(--primary-color, #FF69B4);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 57px;
}

.comment-submit-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.comment-submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Login Prompt */
.comment-login-prompt {
  text-align: center;
  padding: 20px;
  background: #f7fafc;
  border-radius: 12px;
  margin-bottom: 25px;
  color: #4a5568;
  font-size: 1rem;
}

.login-link {
  color: var(--primary-color, #FF69B4);
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

/* Comments List */
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.no-comments {
  text-align: center;
  color: #a0aec0;
  font-size: 1rem;
  padding: 20px 0;
}

.comment-card {
  background: #f7fafc;
  border-radius: 12px;
  padding: 18px;
  transition: background 0.2s ease;
}

.comment-card:hover {
  background: #edf2f7;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.comment-user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.comment-avatar-small {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color, #FF69B4), var(--secondary-color, #FFC0CB));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.comment-author {
  display: block;
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
}

.comment-date {
  display: block;
  font-size: 0.8rem;
  color: #a0aec0;
  margin-top: 2px;
}

.comment-delete-btn {
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  opacity: 0.6;
}

.comment-delete-btn:hover {
  opacity: 1;
  background: #fed7d7;
}

.comment-content {
  color: #4a5568;
  line-height: 1.8;
  font-size: 1rem;
  margin: 0;
  padding-right: 46px;
}

/* Mobile Comments */
@media (max-width: 768px) {
  .comments-section {
    padding: 20px 15px;
    margin-top: 25px;
  }

  .comments-title {
    font-size: 1.1rem;
    margin-bottom: 20px;
  }

  .comment-input-wrapper {
    flex-direction: column;
    gap: 10px;
  }

  .comment-avatar {
    width: 38px;
    height: 38px;
    font-size: 1rem;
  }

  .comment-form textarea {
    font-size: 16px;
    min-height: 70px;
    width: 100%;
    box-sizing: border-box;
  }

  .comment-submit-btn {
    margin-right: 0;
    width: 100%;
    justify-content: center;
    padding: 12px;
  }

  .comment-content {
    padding-right: 0;
    font-size: 0.95rem;
  }

  .comment-card {
    padding: 14px;
  }

  .comment-header {
    flex-wrap: wrap;
    gap: 8px;
  }

  .comment-user-info {
    gap: 8px;
  }

  .comment-avatar-small {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }

  .comment-author {
    font-size: 0.9rem;
  }

  .comment-date {
    font-size: 0.75rem;
  }

  .comment-login-prompt {
    padding: 15px;
    font-size: 0.95rem;
  }

  .comments-list {
    gap: 12px;
  }
}
