import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const ADMIN_PASSWORD = 'ORVE2025admin';

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

function StatusBadge({ status }) {
  const colors = {
    Pending: '#F59E0B', Confirmed: '#3B82F6', Packed: '#8B5CF6',
    Shipped: '#06B6D4', 'Out for Delivery': '#F97316', Delivered: '#10B981',
  };
  return (
    <span style={{
      padding: '4px 12px', fontSize: '0.6rem', letterSpacing: '1px', fontWeight: 700,
      background: `${colors[status]}20`, color: colors[status],
      border: `1px solid ${colors[status]}40`, borderRadius: '2px', textTransform: 'uppercase',
    }}>{status}</span>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Rings', price: '', originalPrice: '', image: '', description: '', stock: '', inStock: true });

  const { products, orders, reviews, complaints, addProduct, updateProduct, deleteProduct, toggleStock, updateOrderStatus, approveReview, deleteReview } = useStore();

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(false); }
    else setPwError(true);
  };

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #2C1A0E 0%, #4A3020 50%, #2C1A0E 100%)',
      }}>
        <div style={{ background: '#F5EFE0', padding: '60px 50px', width: '100%', maxWidth: '420px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 200, letterSpacing: '8px', marginBottom: '8px', color: '#2C1A0E' }}>ORVÉ</h1>
          <p style={{ fontSize: '0.6rem', letterSpacing: '4px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '40px' }}>Admin Portal</p>
          <input
            type="password"
            placeholder="Enter admin password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="input-luxury"
            style={{ marginBottom: '16px' }}
          />
          {pwError && <p style={{ color: '#C9A84C', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '16px' }}>⚠️ Incorrect password</p>}
          <button className="btn-gold" onClick={handleLogin} style={{ width: '100%', fontSize: '0.7rem', letterSpacing: '3px' }}>Enter Dashboard</button>
        </div>
      </div>
    );
  }

  // Sales data for charts
  const salesData = [
    { month: 'Jan', revenue: 8400, orders: 6 },
    { month: 'Feb', revenue: 12600, orders: 9 },
    { month: 'Mar', revenue: 18200, orders: 13 },
    { month: 'Apr', revenue: 15800, orders: 11 },
    { month: 'May', revenue: 22400, orders: 16 },
    { month: 'Jun', revenue: 19600, orders: 14 },
  ];

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const pendingReviews = reviews.filter(r => !r.approved).length;

  const tabs = [
    { key: 'dashboard', label: '📊 Dashboard' },
    { key: 'products', label: '💎 Products' },
    { key: 'orders', label: '📦 Orders' },
    { key: 'reviews', label: '⭐ Reviews' },
    { key: 'complaints', label: '🔔 Complaints' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F5EFE0', paddingTop: '80px', display: 'flex', flexDirection: 'column' }}>
      {/* Admin Header */}
      <div style={{
        background: '#2C1A0E', padding: '20px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 300, letterSpacing: '6px', color: '#E8D5A3' }}>ORVÉ Admin</h2>
          <p style={{ fontSize: '0.6rem', letterSpacing: '3px', color: '#C9A84C', fontWeight: 600 }}>MANAGEMENT PORTAL</p>
        </div>
        <button onClick={() => setAuthed(false)} style={{
          background: 'none', border: '1px solid rgba(201,168,76,0.4)', color: '#C9A84C',
          padding: '8px 20px', cursor: 'pointer', fontSize: '0.65rem', letterSpacing: '2px',
        }}>Logout</button>
      </div>

      {/* Tab Navigation */}
      <div style={{ background: '#FFFDF7', borderBottom: '1px solid rgba(201,168,76,0.2)', display: 'flex', overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '16px 24px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '0.7rem', letterSpacing: '1px', fontWeight: 600, whiteSpace: 'nowrap',
            color: tab === t.key ? '#C9A84C' : '#4A3020',
            borderBottom: tab === t.key ? '2px solid #C9A84C' : '2px solid transparent',
            transition: 'all 0.3s',
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: '40px', flex: 1 }}>
        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              {[
                { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: '💰', color: '#C9A84C' },
                { label: 'Total Orders', value: orders.length, icon: '📦', color: '#3B82F6' },
                { label: 'Pending Orders', value: pendingOrders, icon: '⏳', color: '#F59E0B' },
                { label: 'In-Stock Products', value: `${inStockProducts}/${products.length}`, icon: '💎', color: '#10B981' },
                { label: 'Pending Reviews', value: pendingReviews, icon: '⭐', color: '#8B5CF6' },
                { label: 'Complaints', value: complaints.length, icon: '🔔', color: '#EF4444' },
              ].map((kpi, i) => (
                <div key={i} style={{
                  background: '#FFFDF7', padding: '28px 24px',
                  borderTop: `3px solid ${kpi.color}`,
                  display: 'flex', flexDirection: 'column', gap: '8px',
                }}>
                  <span style={{ fontSize: '1.8rem' }}>{kpi.icon}</span>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 500, color: kpi.color }}>{kpi.value}</p>
                  <p style={{ fontSize: '0.65rem', letterSpacing: '2px', color: '#6B5540', fontWeight: 600, textTransform: 'uppercase' }}>{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
              <div style={{ background: '#FFFDF7', padding: '30px' }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 400, letterSpacing: '2px', color: '#2C1A0E', marginBottom: '24px' }}>Monthly Revenue (₹)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2D5BE" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B5540' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#6B5540' }} />
                    <Tooltip contentStyle={{ background: '#FFFDF7', border: '1px solid #C9A84C', borderRadius: 0 }} />
                    <Bar dataKey="revenue" fill="#C9A84C" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: '#FFFDF7', padding: '30px' }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 400, letterSpacing: '2px', color: '#2C1A0E', marginBottom: '24px' }}>Orders Trend</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2D5BE" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B5540' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#6B5540' }} />
                    <Tooltip contentStyle={{ background: '#FFFDF7', border: '1px solid #C9A84C', borderRadius: 0 }} />
                    <Line type="monotone" dataKey="orders" stroke="#A07830" strokeWidth={2} dot={{ fill: '#C9A84C' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {tab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 300, letterSpacing: '4px', color: '#2C1A0E' }}>Product Inventory</h2>
              <button className="btn-gold" onClick={() => setShowAddProduct(true)} style={{ fontSize: '0.65rem', letterSpacing: '2px' }}>+ Add Product</button>
            </div>

            {showAddProduct && (
              <div style={{ background: '#FFFDF7', padding: '40px', marginBottom: '30px', borderTop: '3px solid', borderImage: 'linear-gradient(135deg, #C9A84C, #A07830) 1' }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', letterSpacing: '3px', color: '#2C1A0E', marginBottom: '24px' }}>
                  {editProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  {[
                    { label: 'Product Name', key: 'name', placeholder: 'e.g., Celeste Necklace' },
                    { label: 'Price (₹)', key: 'price', placeholder: '1499' },
                    { label: 'Original Price (₹)', key: 'originalPrice', placeholder: '2199' },
                    { label: 'Stock Quantity', key: 'stock', placeholder: '20' },
                    { label: 'Image URL', key: 'image', placeholder: 'https://...' },
                  ].map(field => (
                    <div key={field.key}>
                      <label style={{ fontSize: '0.6rem', letterSpacing: '2px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>{field.label}</label>
                      <input className="input-luxury" placeholder={field.placeholder}
                        value={editProduct ? editProduct[field.key] : newProduct[field.key]}
                        onChange={e => editProduct ? setEditProduct({ ...editProduct, [field.key]: e.target.value }) : setNewProduct({ ...newProduct, [field.key]: e.target.value })} />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontSize: '0.6rem', letterSpacing: '2px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Category</label>
                    <select className="input-luxury"
                      value={editProduct ? editProduct.category : newProduct.category}
                      onChange={e => editProduct ? setEditProduct({ ...editProduct, category: e.target.value }) : setNewProduct({ ...newProduct, category: e.target.value })}>
                      {['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Sets'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: '20px' }}>
                  <label style={{ fontSize: '0.6rem', letterSpacing: '2px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Description</label>
                  <textarea className="input-luxury" rows={3}
                    value={editProduct ? editProduct.description : newProduct.description}
                    onChange={e => editProduct ? setEditProduct({ ...editProduct, description: e.target.value }) : setNewProduct({ ...newProduct, description: e.target.value })}
                    style={{ resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                  <button className="btn-gold" onClick={() => {
                    if (editProduct) {
                      updateProduct(editProduct.id, { ...editProduct, price: Number(editProduct.price), stock: Number(editProduct.stock) });
                      setEditProduct(null);
                    } else {
                      addProduct({ ...newProduct, price: Number(newProduct.price), originalPrice: Number(newProduct.originalPrice), stock: Number(newProduct.stock) });
                      setNewProduct({ name: '', category: 'Rings', price: '', originalPrice: '', image: '', description: '', stock: '', inStock: true });
                    }
                    setShowAddProduct(false);
                  }} style={{ fontSize: '0.65rem', letterSpacing: '2px' }}>
                    {editProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button className="btn-outline" onClick={() => { setShowAddProduct(false); setEditProduct(null); }} style={{ fontSize: '0.65rem', letterSpacing: '2px' }}>Cancel</button>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {products.map(p => (
                <div key={p.id} style={{ background: '#FFFDF7', overflow: 'hidden', opacity: p.inStock ? 1 : 0.7 }}>
                  <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: p.inStock ? 'none' : 'grayscale(50%)' }} />
                    {!p.inStock && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(44,26,14,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ background: '#2C1A0E', color: '#E8D5A3', padding: '6px 16px', fontSize: '0.65rem', letterSpacing: '2px', fontWeight: 700 }}>OUT OF STOCK</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 500, color: '#2C1A0E', marginBottom: '4px' }}>{p.name}</p>
                    <p style={{ fontSize: '0.65rem', letterSpacing: '2px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>{p.category}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', color: '#C9A84C', fontWeight: 600 }}>₹{p.price.toLocaleString()}</span>
                      <span style={{ fontSize: '0.7rem', color: '#6B5540' }}>Stock: {p.stock}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button onClick={() => { setEditProduct(p); setShowAddProduct(true); }} style={{
                        padding: '8px 16px', background: 'none', border: '1px solid #C9A84C',
                        color: '#C9A84C', cursor: 'pointer', fontSize: '0.6rem', letterSpacing: '1px', fontWeight: 600,
                      }}>Edit</button>
                      <button onClick={() => toggleStock(p.id)} style={{
                        padding: '8px 16px', background: p.inStock ? '#E8D5A3' : 'linear-gradient(135deg,#C9A84C,#A07830)',
                        border: 'none', color: p.inStock ? '#4A3020' : 'white',
                        cursor: 'pointer', fontSize: '0.6rem', letterSpacing: '1px', fontWeight: 600,
                      }}>{p.inStock ? 'Mark OOS' : 'Mark In Stock'}</button>
                      <button onClick={() => { if (window.confirm('Delete this product?')) deleteProduct(p.id); }} style={{
                        padding: '8px 16px', background: '#2C1A0E', border: 'none',
                        color: '#E8D5A3', cursor: 'pointer', fontSize: '0.6rem', letterSpacing: '1px', fontWeight: 600,
                      }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS */}
        {tab === 'orders' && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 300, letterSpacing: '4px', color: '#2C1A0E', marginBottom: '30px' }}>Order Management</h2>
            <div style={{ background: '#FFFDF7', overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#2C1A0E' }}>
                    {['Order ID', 'Customer', 'Product', 'Amount', 'Date', 'Status', 'Update'].map(h => (
                      <th key={h} style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.6rem', letterSpacing: '2px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid rgba(201,168,76,0.1)', background: i % 2 === 0 ? '#FFFDF7' : '#F5EFE0' }}>
                      <td style={{ padding: '16px 20px', fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', fontWeight: 500, color: '#C9A84C' }}>{o.id}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2C1A0E' }}>{o.customer}</p>
                        <p style={{ fontSize: '0.7rem', color: '#B8A88A' }}>{o.phone}</p>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: '#4A3020' }}>{o.product}</td>
                      <td style={{ padding: '16px 20px', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: '#C9A84C', fontWeight: 600 }}>₹{o.amount.toLocaleString()}</td>
                      <td style={{ padding: '16px 20px', fontSize: '0.8rem', color: '#6B5540' }}>{o.date}</td>
                      <td style={{ padding: '16px 20px' }}><StatusBadge status={o.status} /></td>
                      <td style={{ padding: '16px 20px' }}>
                        <select
                          value={o.status}
                          onChange={e => updateOrderStatus(o.id, e.target.value)}
                          style={{ padding: '6px 12px', border: '1px solid rgba(201,168,76,0.4)', background: '#FFFDF7', fontSize: '0.7rem', color: '#4A3020', cursor: 'pointer', outline: 'none' }}
                        >
                          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REVIEWS */}
        {tab === 'reviews' && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 300, letterSpacing: '4px', color: '#2C1A0E', marginBottom: '30px' }}>Review Moderation</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reviews.map(r => (
                <div key={r.id} style={{
                  background: '#FFFDF7', padding: '24px 30px',
                  borderLeft: `4px solid ${r.approved ? '#10B981' : '#F59E0B'}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 500 }}>{r.name}</p>
                      <span style={{ padding: '2px 10px', fontSize: '0.55rem', letterSpacing: '1px', fontWeight: 700, background: r.approved ? '#10B98120' : '#F59E0B20', color: r.approved ? '#10B981' : '#F59E0B', textTransform: 'uppercase' }}>
                        {r.approved ? '✓ Approved' : '⏳ Pending'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.65rem', letterSpacing: '2px', color: '#A07830', marginBottom: '8px' }}>{r.product} • {'★'.repeat(r.rating)}</p>
                    <p style={{ fontSize: '0.85rem', color: '#4A3020', fontStyle: 'italic', lineHeight: 1.7 }}>"{r.comment}"</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!r.approved && (
                      <button onClick={() => approveReview(r.id)} style={{
                        padding: '8px 16px', background: '#10B981', border: 'none',
                        color: 'white', cursor: 'pointer', fontSize: '0.65rem', letterSpacing: '1px', fontWeight: 600,
                      }}>Approve</button>
                    )}
                    <button onClick={() => deleteReview(r.id)} style={{
                      padding: '8px 16px', background: '#2C1A0E', border: 'none',
                      color: '#E8D5A3', cursor: 'pointer', fontSize: '0.65rem', letterSpacing: '1px', fontWeight: 600,
                    }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMPLAINTS */}
        {tab === 'complaints' && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 300, letterSpacing: '4px', color: '#2C1A0E', marginBottom: '30px' }}>
              Customer Complaints {complaints.length > 0 && <span style={{ fontSize: '1rem', color: '#EF4444' }}>({complaints.length})</span>}
            </h2>
            {complaints.length === 0 ? (
              <div style={{ background: '#FFFDF7', padding: '60px', textAlign: 'center', color: '#10B981' }}>
                <p style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 300 }}>No open complaints!</p>
                <p style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#A07830', marginTop: '8px' }}>Your customers are happy ✨</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {complaints.map(c => (
                  <div key={c.id} style={{
                    background: '#FFFDF7', padding: '28px 30px',
                    borderLeft: '4px solid #EF4444',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 500 }}>{c.name}</p>
                        {c.orderId && <p style={{ fontSize: '0.7rem', color: '#C9A84C', letterSpacing: '2px' }}>Order: {c.orderId}</p>}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#B8A88A' }}>{c.date}</p>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#4A3020', lineHeight: 1.7, marginBottom: '16px' }}>{c.issue}</p>
                    <a href={`https://wa.me/917977459392?text=Hi%20${encodeURIComponent(c.name)}!%20We%20received%20your%20complaint%20about%20order%20${c.orderId || 'N/A'}.%20We%27re%20sorry%20for%20the%20inconvenience.%20Please%20share%20more%20details%20so%20we%20can%20resolve%20this%20for%20you.`}
                      target="_blank" rel="noreferrer" className="btn-gold" style={{ fontSize: '0.65rem', letterSpacing: '2px', padding: '10px 20px' }}>
                      Reply on WhatsApp
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
