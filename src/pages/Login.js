import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPhone, FaLock, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../styles/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.phoneNumber, formData.password);
    
    if (result.success) {
      toast.success(result.message);
      // Redirect based on user type
      navigate(result.user?.isAdmin ? '/admin' : '/');
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-card">
          <motion.div
            className="auth-header"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="auth-icon">
              <FaSignInAlt />
            </div>
            <h1>تسجيل الدخول</h1>
            <p>مرحباً بك مرة أخرى!</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>
                <FaPhone /> رقم الهاتف
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+213555123456"
                required
                dir="ltr"
              />
            </div>

            <div className="form-group">
              <label>
                <FaLock /> كلمة المرور
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <motion.button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
            </motion.button>
          </form>

          <div className="auth-footer">
            <p>ليس لديك حساب؟ <Link to="/register">سجل الآن</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
