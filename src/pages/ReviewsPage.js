import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export default function ReviewsPage() {
  const { reviews, addReview, addComplaint, products } = useStore();
  const approved = reviews.filter(r => r.approved);
  const [tab, setTab] = useState('reviews');
  const [reviewForm, setReviewForm] = useState({ name: '', product: '', rating: 5, comment: '' });
  const [complaintForm, setComplaintForm] = useState({ name: '', orderId: '', issue: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleReviewSubmit = () => {
    if (!reviewForm.name || !reviewForm.comment || !reviewForm.product) return alert('Please fill all fields');
    addReview(reviewForm);
    setReviewForm({ name: '', product: '', rating: 5, comment: '' });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleComplaintSubmit = () => {
    if (!complaintForm.name || !complaintForm.issue) return alert('Please fill all fields');
    addComplaint(complaintForm);
    setComplaintForm({ name: '', orderId: '', issue: '' });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', background: '#F5EFE0' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, #2C1A0E 0%, #4A3020 100%)',
        padding: '80px 40px', textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.6rem', letterSpacing: '6px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>Customer Voice</p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', fontWeight: 200, letterSpacing: '8px',
          background: 'linear-gradient(135deg, #C9A84C 0%, #E8D5A3 40%, #A07830 70%, #C9A84C 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>Reviews & Feedback</h1>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', borderBottom: '1px solid rgba(201,168,76,0.2)',
        background: '#FFFDF7', maxWidth: '900px', margin: '0 auto',
      }}>
        {[{ key: 'reviews', label: 'Customer Reviews' }, { key: 'write', label: 'Write a Review' }, { key: 'complaint', label: 'Report an Issue' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '20px 30px',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '0.65rem', letterSpacing: '2px', fontWeight: 600, textTransform: 'uppercase',
            color: tab === t.key ? '#C9A84C' : '#6B5540',
            borderBottom: tab === t.key ? '2px solid #C9A84C' : '2px solid transparent',
            transition: 'all 0.3s',
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 40px' }}>
        {/* Reviews List */}
        {tab === 'reviews' && (
          <div>
            {/* Rating summary */}
            <div style={{
              background: '#FFFDF7', padding: '40px', marginBottom: '40px',
              display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap',
              borderTop: '3px solid', borderImage: 'linear-gradient(135deg, #C9A84C, #A07830) 1',
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '4rem', fontWeight: 300, color: '#C9A84C', lineHeight: 1 }}>4.9</p>
                <p style={{ color: '#C9A84C', fontSize: '1.2rem', letterSpacing: '3px' }}>★★★★★</p>
                <p style={{ fontSize: '0.7rem', letterSpacing: '2px', color: '#B8A88A', marginTop: '6px' }}>{approved.length} reviews</p>
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                {[5, 4, 3, 2, 1].map(star => (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#4A3020', width: '20px' }}>{star}★</span>
                    <div style={{ flex: 1, height: '6px', background: '#E2D5BE', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${(approved.filter(r => r.rating === star).length / Math.max(approved.length, 1)) * 100}%`,
                        background: 'linear-gradient(135deg, #C9A84C, #A07830)',
                        borderRadius: '3px',
                      }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#B8A88A', width: '20px' }}>{approved.filter(r => r.rating === star).length}</span>
                  </div>
                ))}
              </div>
            </div>

            {approved.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#A07830' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 300 }}>Be the first to review!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {approved.map(review => (
                  <div key={review.id} style={{
                    background: '#FFFDF7', padding: '30px',
                    borderLeft: '3px solid #C9A84C',
                    animation: 'fadeIn 0.5s ease',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                      <div>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 500, color: '#2C1A0E' }}>{review.name}</p>
                        <p style={{ fontSize: '0.65rem', letterSpacing: '2px', color: '#A07830', fontWeight: 600, textTransform: 'uppercase' }}>{review.product}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ color: '#C9A84C', fontSize: '1rem', letterSpacing: '2px' }}>{'★'.repeat(review.rating)}</p>
                        <p style={{ fontSize: '0.7rem', color: '#B8A88A', marginTop: '4px' }}>{review.date}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.9, color: '#4A3020', fontStyle: 'italic' }}>"{review.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Write Review */}
        {tab === 'write' && (
          <div style={{ background: '#FFFDF7', padding: '50px 40px', borderTop: '3px solid', borderImage: 'linear-gradient(135deg, #C9A84C, #A07830) 1' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300, letterSpacing: '4px', color: '#2C1A0E', marginBottom: '40px' }}>Share Your Experience</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ fontSize: '0.6rem', letterSpacing: '3px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>Your Name</label>
                <input className="input-luxury" value={reviewForm.name} onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })} placeholder="e.g., Priya S." />
              </div>
              <div>
                <label style={{ fontSize: '0.6rem', letterSpacing: '3px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>Product</label>
                <select className="input-luxury" value={reviewForm.product} onChange={e => setReviewForm({ ...reviewForm, product: e.target.value })}>
                  <option value="">Select a product...</option>
                  {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.6rem', letterSpacing: '3px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>Rating</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '2rem', color: star <= reviewForm.rating ? '#C9A84C' : '#E2D5BE',
                      transition: 'color 0.2s',
                    }}>★</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.6rem', letterSpacing: '3px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>Your Review</label>
                <textarea className="input-luxury" rows={5} value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Tell us about your experience with this jewellery..." style={{ resize: 'vertical' }} />
              </div>
              {submitted && <p style={{ color: '#C9A84C', fontSize: '0.85rem', letterSpacing: '2px' }}>✨ Thank you! Your review is under moderation.</p>}
              <button className="btn-gold" onClick={handleReviewSubmit} style={{ fontSize: '0.7rem', letterSpacing: '3px', alignSelf: 'flex-start' }}>Submit Review</button>
            </div>
          </div>
        )}

        {/* Complaint */}
        {tab === 'complaint' && (
          <div style={{ background: '#FFFDF7', padding: '50px 40px', borderTop: '3px solid', borderImage: 'linear-gradient(135deg, #C9A84C, #A07830) 1' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300, letterSpacing: '4px', color: '#2C1A0E', marginBottom: '16px' }}>Report an Issue</h2>
            <p style={{ fontSize: '0.85rem', color: '#6B5540', lineHeight: 1.8, marginBottom: '40px' }}>We're sorry to hear you had an issue. Please share the details and we'll get back to you within 24 hours via WhatsApp.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ fontSize: '0.6rem', letterSpacing: '3px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>Your Name</label>
                <input className="input-luxury" value={complaintForm.name} onChange={e => setComplaintForm({ ...complaintForm, name: e.target.value })} placeholder="Full name" />
              </div>
              <div>
                <label style={{ fontSize: '0.6rem', letterSpacing: '3px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>Order ID (if applicable)</label>
                <input className="input-luxury" value={complaintForm.orderId} onChange={e => setComplaintForm({ ...complaintForm, orderId: e.target.value })} placeholder="e.g., ORV-001" />
              </div>
              <div>
                <label style={{ fontSize: '0.6rem', letterSpacing: '3px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>Describe the Issue</label>
                <textarea className="input-luxury" rows={6} value={complaintForm.issue} onChange={e => setComplaintForm({ ...complaintForm, issue: e.target.value })} placeholder="Please describe your issue in detail..." style={{ resize: 'vertical' }} />
              </div>
              {submitted && <p style={{ color: '#C9A84C', fontSize: '0.85rem', letterSpacing: '2px' }}>✨ Complaint received! We'll respond within 24 hours.</p>}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button className="btn-gold" onClick={handleComplaintSubmit} style={{ fontSize: '0.7rem', letterSpacing: '3px' }}>Submit Complaint</button>
                <a href="https://wa.me/917977459392?text=Hi%20ORVÉ!%20I%20have%20a%20complaint%20about%20my%20order." target="_blank" rel="noreferrer" className="btn-outline" style={{ fontSize: '0.7rem', letterSpacing: '3px' }}>Chat on WhatsApp</a>
              </div>
            </div>
          </div>
        )}
        <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
      </div>
    </div>
  );
}
