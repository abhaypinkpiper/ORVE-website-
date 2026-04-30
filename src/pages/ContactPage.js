import React from 'react';
import { appConfig } from '../config/appConfig';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', background: '#F5EFE0' }}>
      <div style={{
        background: 'linear-gradient(160deg, #2C1A0E 0%, #4A3020 100%)',
        padding: '80px 40px', textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.6rem', letterSpacing: '6px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>Reach Us</p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', fontWeight: 200, letterSpacing: '8px',
          background: 'linear-gradient(135deg, #C9A84C 0%, #E8D5A3 40%, #A07830 70%, #C9A84C 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>Contact Us</h1>
        <p style={{ color: '#B8A88A', fontSize: '0.85rem', letterSpacing: '2px', marginTop: '12px' }}>We'd love to hear from you</p>
      </div>

      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '100px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
          {[
            {
              icon: '💬',
              title: 'WhatsApp',
              sub: 'Fastest response — within hours',
              link: appConfig.whatsappUrl + '?text=Hi%20ORVÉ!%20I%20want%20to%20know%20more%20about%20your%20jewellery.',
              label: 'Chat Now',
              detail: '+91 79774 59392',
            },
            {
              icon: '📸',
              title: 'Instagram',
              sub: 'DM us for queries & custom orders',
              link: appConfig.instagramUrl,
              label: 'Follow & DM',
              detail: '@ORVE.jewels',
            },
            {
              icon: '🌐',
              title: 'Website',
              sub: 'Shop our full collection online',
              link: 'https://orve.co.in',
              label: 'Visit Store',
              detail: 'orve.co.in',
            },
          ].map((c, i) => (
            <div key={i} style={{
              background: '#FFFDF7', padding: '50px 36px', textAlign: 'center',
              borderTop: '3px solid', borderImage: 'linear-gradient(135deg, #C9A84C, #A07830) 1',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(44,26,14,0.12)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{c.icon}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 400, letterSpacing: '3px', color: '#2C1A0E', marginBottom: '8px' }}>{c.title}</h3>
              <p style={{ fontSize: '0.75rem', color: '#B8A88A', letterSpacing: '1px', marginBottom: '16px' }}>{c.sub}</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: '#C9A84C', marginBottom: '30px', fontWeight: 500 }}>{c.detail}</p>
              <Link href={c.link} target="_blank" rel="noreferrer" className="btn-gold" style={{ fontSize: '0.65rem', letterSpacing: '3px' }}>{c.label}</Link>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '80px', background: '#2C1A0E', padding: '60px 40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300, letterSpacing: '4px', color: '#E8D5A3', marginBottom: '16px' }}>Business Hours</h2>
          <p style={{ fontSize: '0.8rem', color: '#B8A88A', letterSpacing: '2px', marginBottom: '8px' }}>Monday – Saturday: 10:00 AM – 8:00 PM</p>
          <p style={{ fontSize: '0.8rem', color: '#B8A88A', letterSpacing: '2px', marginBottom: '30px' }}>Sunday: 12:00 PM – 6:00 PM</p>
          <p style={{ fontSize: '0.75rem', color: '#C9A84C', letterSpacing: '2px', fontStyle: 'italic' }}>WhatsApp messages answered within 2 hours during business hours ✦</p>
        </div>
      </section>
    </div>
  );
}
