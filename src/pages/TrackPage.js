import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const STATUS_STEPS = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function TrackPage() {
  const { orders } = useStore();
  const [orderId, setOrderId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = () => {
    const found = orders.find(o => o.id.toLowerCase() === orderId.trim().toLowerCase());
    if (found) {
      setResult(found);
      setError('');
    } else {
      setResult(null);
      setError('Order not found. Please check your Order ID and try again.');
    }
  };

  const currentStep = result ? STATUS_STEPS.findIndex(s => s === result.status) : -1;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', background: '#F5EFE0' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, #2C1A0E 0%, #4A3020 100%)',
        padding: '80px 40px', textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.6rem', letterSpacing: '6px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>Order Status</p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', fontWeight: 200, letterSpacing: '8px',
          background: 'linear-gradient(135deg, #C9A84C 0%, #E8D5A3 40%, #A07830 70%, #C9A84C 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>Track Your Order</h1>
        <p style={{ color: '#B8A88A', fontSize: '0.85rem', letterSpacing: '2px', marginTop: '12px' }}>Enter your Order ID to see real-time status</p>
      </div>

      {/* Search Box */}
      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 40px' }}>
        <div style={{ background: '#FFFDF7', padding: '50px 40px', borderTop: '3px solid', borderImage: 'linear-gradient(135deg, #C9A84C, #A07830) 1' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '3px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '24px' }}>
            Enter Order ID (e.g., ORV-001)
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="ORV-001"
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTrack()}
              className="input-luxury"
              style={{ flex: 1 }}
            />
            <button className="btn-gold" onClick={handleTrack} style={{ whiteSpace: 'nowrap', fontSize: '0.7rem', letterSpacing: '2px' }}>
              Track
            </button>
          </div>

          {error && (
            <p style={{ marginTop: '16px', color: '#A07830', fontSize: '0.8rem', letterSpacing: '1px' }}>⚠️ {error}</p>
          )}

          <p style={{ marginTop: '20px', fontSize: '0.7rem', color: '#B8A88A', letterSpacing: '1px' }}>
            You can find your Order ID in the WhatsApp confirmation message we sent you.
          </p>
        </div>

        {/* Result */}
        {result && (
          <div style={{ marginTop: '40px', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ background: '#FFFDF7', padding: '40px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '30px' }}>
                <div>
                  <p style={{ fontSize: '0.6rem', letterSpacing: '3px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Order ID</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 500 }}>{result.id}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.6rem', letterSpacing: '3px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Product</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 400 }}>{result.product}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.6rem', letterSpacing: '3px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Amount</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 500, color: '#C9A84C' }}>₹{result.amount.toLocaleString()}</p>
                </div>
              </div>

              {/* Status Timeline */}
              <div style={{ marginTop: '30px' }}>
                <p style={{ fontSize: '0.6rem', letterSpacing: '3px', color: '#2C1A0E', fontWeight: 600, textTransform: 'uppercase', marginBottom: '30px' }}>Delivery Progress</p>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', top: '20px', left: '20px', right: '20px', height: '2px',
                    background: '#E2D5BE',
                  }} />
                  <div style={{
                    position: 'absolute', top: '20px', left: '20px', height: '2px',
                    background: 'linear-gradient(135deg, #C9A84C, #A07830)',
                    width: `${Math.max(0, (currentStep / (STATUS_STEPS.length - 1)) * 100)}%`,
                    transition: 'width 1s ease',
                  }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                    {STATUS_STEPS.map((step, i) => {
                      const done = i <= currentStep;
                      return (
                        <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flex: 1 }}>
                          <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: done ? 'linear-gradient(135deg, #C9A84C, #A07830)' : '#E2D5BE',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: done ? '0 0 12px rgba(201,168,76,0.5)' : 'none',
                            transition: 'all 0.5s ease',
                          }}>
                            {done ? <span style={{ color: 'white', fontSize: '1rem' }}>✓</span> :
                              <span style={{ color: '#B8A88A', fontSize: '0.7rem' }}>{i + 1}</span>}
                          </div>
                          <p style={{ fontSize: '0.55rem', letterSpacing: '1px', color: done ? '#C9A84C' : '#B8A88A', fontWeight: done ? 600 : 400, textAlign: 'center', textTransform: 'uppercase' }}>{step}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '40px', padding: '20px', background: '#F5EFE0', borderLeft: '3px solid #C9A84C' }}>
                <p style={{ fontSize: '0.75rem', color: '#4A3020', letterSpacing: '1px' }}>
                  📦 Shipped to: <strong>{result.address}</strong>
                </p>
                <p style={{ fontSize: '0.75rem', color: '#A07830', letterSpacing: '1px', marginTop: '8px' }}>
                  📅 Order placed: {result.date}
                </p>
              </div>
            </div>

            <a href={`https://wa.me/917977459392?text=Hi%20ORVÉ!%20I%20need%20help%20with%20my%20order%20${result.id}`}
              target="_blank" rel="noreferrer" className="btn-gold" style={{ display: 'block', textAlign: 'center', fontSize: '0.7rem', letterSpacing: '3px' }}>
              Need Help? Chat on WhatsApp
            </a>
          </div>
        )}
        <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      </section>
    </div>
  );
}
