import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { getImageUrl } from '../config';
import { toast } from 'react-toastify';
import '../styles/Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [checkout, setCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ customerName: '', customerPhone: '', street: '', city: '', state: '' });
  const nav = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createOrder({
        customerName: form.customerName, customerPhone: form.customerPhone,
        shippingAddress: { street: form.street, city: form.city, state: form.state },
        items: cart.map(i => ({ product: i._id, name: i.name, price: i.price, quantity: i.quantity })),
        totalAmount: getCartTotal()
      });
      toast.success('تم إرسال طلبك بنجاح!');
      clearCart();
      nav('/');
    } catch { toast.error('حدث خطأ في إرسال الطلب'); }
    finally { setLoading(false); }
  };

  if (cart.length === 0) return (
    <motion.div className="empty-cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <FaShoppingBag className="empty-icon" /><h2>سلة التسوق فارغة</h2><p>أضف بعض المنتجات لتبدأ التسوق</p>
      <button onClick={() => nav('/products')} className="shop-btn">تسوق الآن</button>
    </motion.div>
  );

  return (
    <div className="cart-page">
      <motion.h1 className="page-title" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>سلة التسوق</motion.h1>
      {!checkout ? (
        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item, i) => (
              <motion.div key={item._id} className="cart-item" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <img src={getImageUrl(item.image)} alt={item.name} />
                <div className="item-details"><h3>{item.nameAr || item.name}</h3><p className="item-price">{item.price} دج</p></div>
                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)}><FaMinus /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}><FaPlus /></button>
                </div>
                <div className="item-total">{item.price * item.quantity} دج</div>
                <button className="remove-btn" onClick={() => removeFromCart(item._id)}><FaTrash /></button>
              </motion.div>
            ))}
          </div>
          <motion.div className="cart-summary" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
            <h2>ملخص الطلب</h2>
            <div className="summary-row"><span>المجموع الفرعي</span><span>{getCartTotal()} دج</span></div>
            <div className="summary-row"><span>الشحن</span><span>مجاني</span></div>
            <div className="summary-row total"><span>الإجمالي</span><span>{getCartTotal()} دج</span></div>
            <button className="checkout-btn" onClick={() => setCheckout(true)}>إتمام الطلب</button>
          </motion.div>
        </div>
      ) : (
        <motion.div className="checkout-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button className="back-btn" onClick={() => setCheckout(false)}>← العودة إلى السلة</button>
          <h2>معلومات التوصيل</h2>
          <form onSubmit={submit}>
            <div className="form-group"><label>الاسم الكامل *</label><input type="text" name="customerName" value={form.customerName} onChange={onChange} required /></div>
            <div className="form-group"><label>رقم الهاتف *</label><input type="tel" name="customerPhone" value={form.customerPhone} onChange={onChange} required /></div>
            <div className="form-group"><label>العنوان *</label><input type="text" name="street" value={form.street} onChange={onChange} required /></div>
            <div className="form-row">
              <div className="form-group"><label>المدينة *</label><input type="text" name="city" value={form.city} onChange={onChange} required /></div>
              <div className="form-group"><label>الولاية *</label><input type="text" name="state" value={form.state} onChange={onChange} required /></div>
            </div>
            <div className="order-summary-checkout">
              <h3>ملخص الطلب</h3>
              <div className="summary-items">{cart.map(i => <div key={i._id} className="summary-item"><span>{i.nameAr || i.name} × {i.quantity}</span><span>{i.price * i.quantity} دج</span></div>)}</div>
              <div className="summary-total"><strong>الإجمالي:</strong><strong>{getCartTotal()} دج</strong></div>
            </div>
            <button type="submit" className="submit-order-btn" disabled={loading}>{loading ? 'جاري الإرسال...' : 'تأكيد الطلب'}</button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;
