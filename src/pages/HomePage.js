import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

function GoldParticles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: -(Math.random() * 0.6 + 0.2),
      opacity: Math.random() * 0.6 + 0.2,
    }));

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.opacity})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        p.opacity -= 0.002;
        if (p.y < -10 || p.opacity <= 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 10;
          p.opacity = Math.random() * 0.6 + 0.2;
        }
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }} />;
}

function TypewriterText({ texts, style }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index];
    let timer;
    if (!deleting) {
      if (displayed.length < current.length) {
        timer = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
      } else {
        timer = setTimeout(() => setDeleting(true), 2500);
      }
    } else {
      if (displayed.length > 0) {
        timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
      } else {
        setDeleting(false);
        setIndex((index + 1) % texts.length);
      }
    }
    return () => clearTimeout(timer);
  }, [displayed, deleting, index, texts]);

  return <span style={style}>{displayed}<span style={{ color: '#C9A84C', animation: 'blink 1s infinite' }}>|</span></span>;
}

function ProductCard({ product, productIndex }) {
  const { addToCart } = useStore();
  const [hovered, setHovered] = useState(false);
  const productHref = Number.isInteger(productIndex) && productIndex >= 0 ? `/product/${productIndex}` : null;

  return (
    <div
      className="product-card"
      style={{ borderRadius: '2px', overflow: 'hidden' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4' }}>
        {productHref ? (
          <Link to={productHref} style={{ display: 'block' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.6s ease',
                transform: hovered ? 'scale(1.08)' : 'scale(1)',
              }}
            />
          </Link>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.6s ease',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
            }}
          />
        )}
        {!product.inStock && (
          <div style={{
            position: 'absolute', top: '16px', left: '16px',
            background: '#2C1A0E', color: '#E8D5A3',
            fontSize: '0.6rem', letterSpacing: '2px', fontWeight: 700,
            padding: '5px 12px', textTransform: 'uppercase',
          }}>Out of Stock</div>
        )}
        {product.inStock && product.originalPrice && (
          <div style={{
            position: 'absolute', top: '16px', left: '16px',
            background: 'linear-gradient(135deg, #C9A84C, #A07830)', color: 'white',
            fontSize: '0.6rem', letterSpacing: '2px', fontWeight: 700,
            padding: '5px 12px', textTransform: 'uppercase',
          }}>Sale</div>
        )}
        {hovered && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(44,26,14,0.75)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '12px',
            animation: 'fadeIn 0.3s ease',
          }}>
            {product.inStock ? (
              <>
                <button className="btn-gold" onClick={() => addToCart(product)}
                  style={{ fontSize: '0.65rem', padding: '10px 24px', letterSpacing: '2px' }}>
                  Add to Bag
                </button>
                <a href={`https://wa.me/917977459392?text=Hi%20ORVÉ!%20I%20want%20to%20buy%20${encodeURIComponent(product.name)}%20(₹${product.price}).%20Please%20confirm%20availability.`}
                  target="_blank" rel="noreferrer"
                  style={{ textDecoration: 'none' }}>
                  <button className="btn-outline" style={{ fontSize: '0.65rem', padding: '10px 24px', letterSpacing: '2px', borderColor: '#E8D5A3', color: '#E8D5A3' }}>
                    Buy on WhatsApp
                  </button>
                </a>
              </>
            ) : (
              <p style={{ color: '#E8D5A3', fontSize: '0.75rem', letterSpacing: '2px' }}>SOLD OUT</p>
            )}
          </div>
        )}
      </div>
      <div style={{ padding: '20px 16px', background: '#FFFDF7' }}>
        <p style={{ fontSize: '0.6rem', letterSpacing: '3px', color: '#A07830', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>{product.category}</p>
        {productHref ? (
          <Link to={productHref} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 500, marginBottom: '8px', letterSpacing: '1px' }}>{product.name}</h3>
          </Link>
        ) : (
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 500, marginBottom: '8px', letterSpacing: '1px' }}>{product.name}</h3>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', color: '#C9A84C', fontWeight: 600 }}>₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span style={{ fontSize: '0.85rem', color: '#B8A88A', textDecoration: 'line-through' }}>₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        <div style={{ marginTop: '6px', color: '#C9A84C', fontSize: '0.8rem' }}>
          {'★'.repeat(Math.round(product.rating))} <span style={{ color: '#B8A88A', fontSize: '0.7rem' }}>({product.reviews})</span>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { products } = useStore();
  const featured = (products.filter(p => p.featured).length > 0 ? products.filter(p => p.featured) : products).slice(0, 6);
  console.log(featured)
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const categories = [
    { name: 'Rings', icon: '💍', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80' },
    { name: 'Necklaces', icon: '📿', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80' },
    { name: 'Earrings', icon: '✨', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80' },
    { name: 'Bracelets', icon: '🔗', img: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=400&q=80' },
  ];

  return (
    <div>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes heroReveal { from{opacity:0;transform:translateY(60px)} to{opacity:1;transform:translateY(0)} }
        .hero-title { animation: heroReveal 1.2s ease 0.3s both; }
        .hero-sub { animation: heroReveal 1.2s ease 0.6s both; }
        .hero-cta { animation: heroReveal 1.2s ease 0.9s both; }
        .cat-card { transition: all 0.4s ease; }
        .cat-card:hover { transform: translateY(-6px); }
        .cat-card:hover img { transform: scale(1.1); }
      `}</style>

      {/* HERO */}
      <div style={{
        position: 'relative', height: '100vh', minHeight: '700px',
        background: 'linear-gradient(160deg, #2C1A0E 0%, #4A3020 30%, #2C1A0E 60%, #1A0E06 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <GoldParticles />

        {/* Decorative rings */}
        {[200, 350, 500].map((size, i) => (
          <div key={i} style={{
            position: 'absolute', width: size, height: size,
            border: `1px solid rgba(201,168,76,${0.08 - i * 0.02})`,
            borderRadius: '50%', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            animation: `float ${4 + i}s ease-in-out infinite`,
          }} />
        ))}

        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '0 20px' }}>
          <p className="hero-sub" style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: '0.65rem', letterSpacing: '8px', color: '#C9A84C',
            fontWeight: 600, textTransform: 'uppercase', marginBottom: '24px',
          }}>Luxury Jewellery</p>

          <h1 className="hero-title" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(5rem, 15vw, 10rem)',
            fontWeight: 200,
            letterSpacing: '16px',
            background: 'linear-gradient(135deg, #C9A84C 0%, #E8D5A3 40%, #A07830 70%, #C9A84C 100%)',
            backgroundSize: '200%',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 0.9,
            animation: 'heroReveal 1.2s ease 0.3s both, goldShimmer 5s ease infinite',
          }}>ORVÉ</h1>

          <div style={{ marginTop: '20px', marginBottom: '40px' }}>
            <TypewriterText
              texts={['Elegance You Wear', 'Crafted for You', 'Timeless Beauty', 'Pure Luxury']}
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
                letterSpacing: '6px',
                color: '#E8D5A3',
                fontWeight: 300,
                textTransform: 'uppercase',
              }}
            />
          </div>

          <div className="hero-cta" style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn-gold" style={{ fontSize: '0.7rem', letterSpacing: '3px', padding: '16px 44px' }}>
              Explore Collection
            </Link>
            <a href="https://wa.me/917977459392?text=Hi%20ORVÉ!%20I%27m%20interested%20in%20your%20jewellery"
              target="_blank" rel="noreferrer" className="btn-outline"
              style={{ fontSize: '0.7rem', letterSpacing: '3px', padding: '16px 44px', borderColor: '#C9A84C', color: '#C9A84C' }}>
              Shop on WhatsApp
            </a>
          </div>

          {/* Scroll indicator */}
          <div style={{ position: 'absolute', bottom: '-80px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', animation: 'float 2s ease-in-out infinite' }}>
            <span style={{ fontSize: '0.55rem', letterSpacing: '4px', color: '#C9A84C', fontWeight: 600 }}>SCROLL</span>
            <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, #C9A84C, transparent)' }} />
          </div>
        </div>
      </div>

      {/* MARQUEE */}
      <div style={{ background: 'linear-gradient(135deg, #C9A84C, #A07830)', padding: '16px 0', overflow: 'hidden' }}>
        <div style={{
          display: 'flex', gap: '60px',
          animation: 'marquee 20s linear infinite',
          whiteSpace: 'nowrap',
        }}>
          {Array(8).fill(['✦ ANTI-TARNISH', '✦ LUXURY QUALITY', '✦ FREE DELIVERY', '✦ ELEGANCE YOU WEAR', '✦ HANDCRAFTED', '✦ ORVE.CO.IN']).flat().map((text, i) => (
            <span key={i} style={{ color: 'white', fontSize: '0.65rem', letterSpacing: '3px', fontWeight: 600 }}>{text}</span>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }`}</style>

      {/* CATEGORIES */}
      <section style={{ padding: '100px 40px', background: '#F5EFE0', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p className="section-subtitle">Curated For You</p>
          <div className="divider-gold"><span>✦</span></div>
          <h2 className="section-title gold-text">Shop by Collection</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          {categories.map(cat => (
            <Link key={cat.name} to={`/shop?category=${cat.name}`} className="cat-card" style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ overflow: 'hidden', aspectRatio: '3/4', position: 'relative' }}>
                <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(44,26,14,0.7) 0%, transparent 60%)',
                }}/>
                <div style={{ position: 'absolute', bottom: '24px', left: '24px' }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', color: 'white', fontWeight: 300, letterSpacing: '4px' }}>{cat.name}</p>
                  <p style={{ fontSize: '0.6rem', letterSpacing: '2px', color: '#E8D5A3', fontWeight: 600 }}>VIEW ALL →</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={{ padding: '80px 40px', background: '#EDE0C8' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p className="section-subtitle">Handpicked Favourites</p>
            <div className="divider-gold"><span>✦</span></div>
            <h2 className="section-title" style={{ color: '#2C1A0E' }}>Featured Pieces</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {featured.map(product => <ProductCard key={product.id} product={product} productIndex={products.findIndex(p => p.id === product.id)} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Link to="/shop" className="btn-gold" style={{ fontSize: '0.7rem', letterSpacing: '3px' }}>View All Collections</Link>
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section style={{
        padding: '120px 40px',
        background: 'linear-gradient(160deg, #2C1A0E 0%, #4A3020 50%, #2C1A0E 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'repeating-linear-gradient(45deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: '0.6rem', letterSpacing: '6px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '20px' }}>Our Story</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 300,
            letterSpacing: '4px',
            color: '#E8D5A3',
            lineHeight: 1.2,
            marginBottom: '30px',
          }}>
            Born from a love of<br /><em>timeless elegance</em>
          </h2>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: '0.95rem', lineHeight: 2, color: '#B8A88A', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            ORVÉ was created for women who believe that luxury shouldn't compromise on longevity. Every piece in our collection is crafted with anti-tarnish technology, ensuring your jewellery looks as radiant on day 300 as it did on day one.
          </p>
          <Link to="/about" className="btn-outline" style={{ borderColor: '#C9A84C', color: '#C9A84C', fontSize: '0.7rem', letterSpacing: '3px' }}>
            Read Our Story
          </Link>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section style={{ padding: '100px 40px', background: '#F5EFE0' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', textAlign: 'center' }}>
          <p className="section-subtitle">Follow Us</p>
          <div className="divider-gold"><span>✦</span></div>
          <h2 className="section-title" style={{ color: '#2C1A0E', marginBottom: '8px' }}>@ORVE.jewels</h2>
          <a href="https://instagram.com/ORVE.jewels" target="_blank" rel="noreferrer"
            style={{ textDecoration: 'none', fontSize: '0.7rem', letterSpacing: '3px', color: '#A07830', fontWeight: 600, display: 'block', marginBottom: '50px' }}>
            Follow on Instagram →
          </a>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '3px' }}>
            {[
              'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80',
              'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80',
              'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80',
              'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=400&q=80',
              'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80',
              'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80',
            ].map((img, i) => (
              <a key={i} href="https://instagram.com/ORVE.jewels" target="_blank" rel="noreferrer"
                style={{ display: 'block', aspectRatio: '1', overflow: 'hidden', position: 'relative' }}>
                <img src={img} alt={`ORVÉ Instagram ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.target.style.transform = 'scale(1)'} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(44,26,14,0)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.3s',
                }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(44,26,14,0.4)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(44,26,14,0)'}>
                  <span style={{ color: 'white', fontSize: '1.5rem', opacity: 0 }}
                    onMouseOver={e => e.currentTarget.style.opacity = '1'}
                    onMouseOut={e => e.currentTarget.style.opacity = '0'}>📸</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section style={{ padding: '60px 40px', background: '#2C1A0E' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', textAlign: 'center' }}>
          {[
            { icon: '🛡️', title: 'Anti-Tarnish', sub: 'Guaranteed lasting shine' },
            { icon: '🚚', title: 'Free Delivery', sub: 'On all orders above ₹999' },
            { icon: '↩️', title: 'Easy Returns', sub: '7-day return policy' },
            { icon: '💎', title: 'Premium Quality', sub: 'Crafted with care' },
            { icon: '🔒', title: 'Secure Payment', sub: 'UPI, Card & COD' },
          ].map((badge, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '2rem' }}>{badge.icon}</span>
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: '#E8D5A3', letterSpacing: '2px', fontWeight: 500 }}>{badge.title}</h4>
              <p style={{ fontSize: '0.75rem', color: '#B8A88A', letterSpacing: '1px' }}>{badge.sub}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
