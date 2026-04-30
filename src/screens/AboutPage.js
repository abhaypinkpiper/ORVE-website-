import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', background: '#F5EFE0' }}>
      {/* Hero */}
      <div
        style={{
          height: '60vh',
          minHeight: '400px',
          background: 'linear-gradient(160deg, #2C1A0E 0%, #4A3020 50%, #2C1A0E 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.05,
            backgroundImage: 'repeating-linear-gradient(45deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px',
          }}
        />
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: '0.6rem', letterSpacing: '6px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '20px' }}>Our Story</p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(3rem, 8vw, 5.5rem)',
              fontWeight: 200,
              letterSpacing: '8px',
              background: 'linear-gradient(135deg, #C9A84C 0%, #E8D5A3 40%, #A07830 70%, #C9A84C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            About ORVÉ
          </h1>
          <p style={{ color: '#B8A88A', fontSize: '0.85rem', letterSpacing: '3px', marginTop: '12px', fontStyle: 'italic' }}>Elegance You Wear</p>
        </div>
      </div>

      {/* Story Section */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '100px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.6rem', letterSpacing: '6px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '20px' }}>The Beginning</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, letterSpacing: '4px', color: '#2C1A0E', lineHeight: 1.3, marginBottom: '30px' }}>
          Born from a belief that luxury should last forever
        </h2>
        <p style={{ fontSize: '0.95rem', lineHeight: 2.2, color: '#4A3020', maxWidth: '700px', margin: '0 auto 24px' }}>
          ORVÉ was founded with one mission — to create jewellery that is as enduring as the memories you make wearing it. We noticed that most fashion jewellery tarnishes within weeks, leaving women disappointed. We decided to change that.
        </p>
        <p style={{ fontSize: '0.95rem', lineHeight: 2.2, color: '#4A3020', maxWidth: '700px', margin: '0 auto 24px' }}>
          Every ORVÉ piece is coated with our proprietary anti-tarnish formula, ensuring your jewellery retains its brilliant gold finish for months, even with daily wear. We combine contemporary Indian aesthetics with global luxury design sensibilities.
        </p>
        <p style={{ fontSize: '0.95rem', lineHeight: 2.2, color: '#4A3020', maxWidth: '700px', margin: '0 auto' }}>
          From the workshop to your wardrobe — we believe every woman deserves to wear elegance, every day.
        </p>
      </section>

      {/* Values */}
      <section style={{ background: '#EDE0C8', padding: '100px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '70px' }}>
            <p style={{ fontSize: '0.6rem', letterSpacing: '6px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase' }}>What We Stand For</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, letterSpacing: '4px', color: '#2C1A0E', marginTop: '16px' }}>Our Values</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
            {[
              { icon: '✦', title: 'Lasting Quality', desc: 'Anti-tarnish technology that keeps your jewellery brilliant for months of daily wear.' },
              { icon: '✦', title: 'Thoughtful Design', desc: 'Each piece is designed to complement the modern Indian woman — from boardroom to banquet.' },
              { icon: '✦', title: 'Accessible Luxury', desc: "Premium quality at prices that don't compromise your lifestyle. Luxury should be for everyone." },
              { icon: '✦', title: 'Customer First', desc: "Every ORVÉ customer is family. Our WhatsApp support ensures you're always looked after." },
            ].map((val, i) => (
              <div
                key={i}
                style={{
                  padding: '40px 30px',
                  background: '#FFFDF7',
                  borderTop: '3px solid',
                  borderImage: 'linear-gradient(135deg, #C9A84C, #A07830) 1',
                }}
              >
                <p style={{ color: '#C9A84C', fontSize: '1.5rem', marginBottom: '20px' }}>{val.icon}</p>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 500, letterSpacing: '2px', color: '#2C1A0E', marginBottom: '14px' }}>{val.title}</h3>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.9, color: '#6B5540' }}>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#2C1A0E', padding: '80px 40px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', textAlign: 'center' }}>
          {[
            { num: '500+', label: 'Happy Customers' },
            { num: '100+', label: 'Unique Designs' },
            { num: '4.8★', label: 'Average Rating' },
            { num: '0', label: 'Tarnish Complaints' },
          ].map((stat, i) => (
            <div key={i}>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '3rem',
                  fontWeight: 300,
                  background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.num}
              </p>
              <p style={{ fontSize: '0.7rem', letterSpacing: '3px', color: '#B8A88A', fontWeight: 600, textTransform: 'uppercase', marginTop: '8px' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 40px', textAlign: 'center', background: '#F5EFE0' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, letterSpacing: '4px', color: '#2C1A0E', marginBottom: '24px' }}>
          Wear your elegance today
        </h2>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/shop" className="btn-gold" style={{ fontSize: '0.7rem', letterSpacing: '3px' }}>
            Shop Now
          </Link>
          <a href="https://wa.me/917977459392" target="_blank" rel="noreferrer" className="btn-outline" style={{ fontSize: '0.7rem', letterSpacing: '3px' }}>
            Chat with Us
          </a>
        </div>
      </section>
    </div>
  );
}

