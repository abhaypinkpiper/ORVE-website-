import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function ProductPage() {
  const { index } = useParams();
  const productIndex = Number.parseInt(index, 10);
  const { products, productsLoading, productsError, addToCart } = useStore();

  const product = Number.isInteger(productIndex) && productIndex >= 0 ? products[productIndex] : undefined;

  const images = useMemo(() => {
    const fromList = Array.isArray(product?.imgUrls) ? product.imgUrls : [];
    const fallback = product?.image ? [product.image] : [];
    const merged = [...fromList, ...fallback].map(s => String(s || '').trim()).filter(Boolean);
    return Array.from(new Set(merged));
  }, [product]);

  const videoUrls = useMemo(() => {
    const list = Array.isArray(product?.videoUrls) ? product.videoUrls : [];
    return list.map(s => String(s || '').trim()).filter(Boolean);
  }, [product]);

  const [activeImage, setActiveImage] = useState(0);

  if (productsLoading && products.length === 0) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '100px', background: '#F5EFE0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 40px', textAlign: 'center', color: '#A07830' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300 }}>Loading product…</p>
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '100px', background: '#F5EFE0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 40px', textAlign: 'center', color: '#A07830' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300 }}>Couldn’t load product</p>
          <p style={{ fontSize: '0.85rem', letterSpacing: '2px', color: '#6B5540', marginTop: '12px' }}>{productsError}</p>
          <div style={{ marginTop: '24px' }}>
            <Link to="/shop" className="btn-gold" style={{ fontSize: '0.7rem', letterSpacing: '3px' }}>Back to Shop</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '100px', background: '#F5EFE0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 40px', textAlign: 'center', color: '#A07830' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300 }}>Product not found</p>
          <div style={{ marginTop: '24px' }}>
            <Link to="/shop" className="btn-gold" style={{ fontSize: '0.7rem', letterSpacing: '3px' }}>Back to Shop</Link>
          </div>
        </div>
      </div>
    );
  }

  const hasDiscount =
    product.originalPrice != null &&
    Number.isFinite(product.originalPrice) &&
    product.price != null &&
    Number.isFinite(product.price) &&
    product.originalPrice > product.price;

  const activeImageUrl = images[activeImage] || images[0];

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px', background: '#F5EFE0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '50px 40px' }}>
        <div style={{ marginBottom: '26px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/shop" style={{ textDecoration: 'none', fontSize: '0.65rem', letterSpacing: '3px', color: '#A07830', fontWeight: 700, textTransform: 'uppercase' }}>
            Shop
          </Link>
          <span style={{ color: '#B8A88A' }}>→</span>
          <span style={{ fontSize: '0.65rem', letterSpacing: '3px', color: '#2C1A0E', fontWeight: 700, textTransform: 'uppercase' }}>
            {product.name}
          </span>
        </div>

        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '36px' }}>
          <div>
            <div style={{ background: '#FFFDF7', overflow: 'hidden' }}>
              {activeImageUrl ? (
                <img
                  src={activeImageUrl}
                  alt={product.name}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              ) : (
                <div style={{ padding: '120px 0', textAlign: 'center', color: '#A07830' }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 300 }}>No image</p>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div style={{ marginTop: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {images.map((url, i) => (
                  <button
                    key={url}
                    onClick={() => setActiveImage(i)}
                    style={{
                      border: i === activeImage ? '1px solid #C9A84C' : '1px solid rgba(201,168,76,0.25)',
                      background: '#FFFDF7',
                      padding: 0,
                      cursor: 'pointer',
                      width: '78px',
                      height: '78px',
                      overflow: 'hidden',
                    }}
                  >
                    <img src={url} alt={`${product.name} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
              </div>
            )}

            {videoUrls.length > 0 && (
              <div style={{ marginTop: '22px' }}>
                <p style={{ fontSize: '0.6rem', letterSpacing: '4px', color: '#A07830', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
                  Videos
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {videoUrls.map((url, i) => (
                    <a
                      key={`${url}-${i}`}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: 'none', color: '#2C1A0E', fontSize: '0.85rem', letterSpacing: '1px' }}
                    >
                      Watch video {i + 1} →
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div style={{ background: '#FFFDF7', padding: '30px' }}>
              <p style={{ fontSize: '0.6rem', letterSpacing: '4px', color: '#A07830', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
                {product.category || 'Collection'}
              </p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.4rem', fontWeight: 300, letterSpacing: '2px', color: '#2C1A0E', marginBottom: '16px' }}>
                {product.name}
              </h1>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '18px' }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: '#C9A84C', fontWeight: 600 }}>
                  ₹{Number(product.price || 0).toLocaleString()}
                </span>
                {hasDiscount && (
                  <span style={{ fontSize: '1rem', color: '#B8A88A', textDecoration: 'line-through' }}>
                    ₹{Number(product.originalPrice || 0).toLocaleString()}
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.95rem', color: '#4A3020', lineHeight: 1.9, marginBottom: '24px' }}>
                {product.description}
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  className="btn-gold"
                  onClick={() => addToCart(product)}
                  style={{ fontSize: '0.7rem', letterSpacing: '3px' }}
                >
                  Add to Bag
                </button>
                <a
                  href={`https://wa.me/917977459392?text=Hi%20ORVÉ!%20I%20want%20to%20order:%20${encodeURIComponent(product.name)}%20at%20₹${product.price}.%20Please%20confirm%20availability.`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <button className="btn-outline" style={{ fontSize: '0.7rem', letterSpacing: '3px', borderColor: '#C9A84C', color: '#A07830' }}>
                    WhatsApp Order
                  </button>
                </a>
              </div>
            </div>

            <div style={{ marginTop: '16px', background: '#EDE0C8', padding: '22px 24px' }}>
              <p style={{ fontSize: '0.6rem', letterSpacing: '4px', color: '#A07830', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
                Details
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', color: '#4A3020', fontSize: '0.85rem', letterSpacing: '1px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <span style={{ color: '#6B5540' }}>Offer Enabled</span>
                  <span style={{ fontWeight: 600 }}>{product.offerEnabled ? 'Yes' : 'No'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <span style={{ color: '#6B5540' }}>Offer Price</span>
                  <span style={{ fontWeight: 600 }}>{product.offerPrice != null ? `₹${Number(product.offerPrice).toLocaleString()}` : '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 980px) {
            .product-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
