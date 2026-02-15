import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaPhone, FaLock, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../styles/Auth.css';

const Register = () => {
  const [form, setForm] = useState({ fullName: '', phoneNumber: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const nav = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('كلمات المرور غير متطابقة');
    if (form.password.length < 6) return toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    setLoading(true);
    const res = await register(form.fullName, form.phoneNumber, form.password);
    if (res.success) { toast.success(res.message); nav('/'); }
    else toast.error(res.message);
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <motion.div className="auth-container" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
        <div className="auth-card register-card">
          <motion.div className="auth-header" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
            <div className="auth-icon"><FaUserPlus /></div>
            <h1>إنشاء حساب جديد</h1>
            <p>انضم إلى مجتمع مامان الجزائرية</p>
          </motion.div>
          <form onSubmit={onSubmit} className="auth-form">
            <div className="form-group"><label><FaUser /> الاسم الكامل</label><input type="text" name="fullName" value={form.fullName} onChange={onChange} placeholder="أدخل اسمك الكامل" required /></div>
            <div className="form-group"><label><FaPhone /> رقم الهاتف</label><input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={onChange} placeholder="+213 555 123 456" required /></div>
            <div className="form-group"><label><FaLock /> كلمة المرور</label><input type="password" name="password" value={form.password} onChange={onChange} placeholder="••••••••" required minLength="6" /></div>
            <div className="form-group"><label><FaLock /> تأكيد كلمة المرور</label><input type="password" name="confirmPassword" value={form.confirmPassword} onChange={onChange} placeholder="••••••••" required /></div>
            <motion.button type="submit" className="auth-submit-btn" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {loading ? 'جاري التحميل...' : 'إنشاء حساب'}
            </motion.button>
          </form>
          <div className="auth-footer"><p>لديك حساب بالفعل؟ <Link to="/login">سجل دخولك</Link></p></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
