import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

function ProductCard({ product }) {
  const { addToCart } = useStore();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#FFFDF7',
        overflow: 'hidden',
        transition: 'all 0.4s ease',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 60px rgba(44,26,14,0.15)' : 'none',
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.6s ease',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
            filter: !product.inStock ? 'grayscale(30%)' : 'none',
          }}
        />
        {!product.inStock && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(44,26,14,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              background: '#2C1A0E', color: '#E8D5A3',
              padding: '8px 24px', fontSize: '0.65rem', letterSpacing: '3px', fontWeight: 700, textTransform: 'uppercase',
            }}>Out of Stock</span>
          </div>
        )}
        {product.inStock && (
          <div style={{
            position: 'absolute', top: '16px', left: '16px',
            background: 'linear-gradient(135deg, #C9A84C, #A07830)', color: 'white',
            fontSize: '0.55rem', letterSpacing: '2px', fontWeight: 700,
            padding: '4px 10px', textTransform: 'uppercase',
          }}>
            {Math.round((1 - product.price / product.originalPrice) * 100)}% Off
          </div>
        )}
        {hovered && product.inStock && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(44,26,14,0.75)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '12px',
            animation: 'fadeIn 0.25s ease',
          }}>
            <button
              className="btn-gold"
              onClick={() => addToCart(product)}
              style={{ fontSize: '0.65rem', padding: '10px 28px', letterSpacing: '2px' }}
            >Add to Bag</button>
            <a
              href={`https://wa.me/917977459392?text=Hi%20ORVÉ!%20I%20want%20to%20order:%20${encodeURIComponent(product.name)}%20at%20₹${product.price}.%20Please%20confirm%20availability.`}
              target="_blank" rel="noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button className="btn-outline"
                style={{ fontSize: '0.65rem', padding: '10px 28px', letterSpacing: '2px', borderColor: '#E8D5A3', color: '#E8D5A3' }}>
                WhatsApp Order
              </button>
            </a>
          </div>
        )}
      </div>
      <div style={{ padding: '20px' }}>
        <p style={{ fontSize: '0.55rem', letterSpacing: '3px', color: '#A07830', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>{product.category}</p>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem', fontWeight: 500, letterSpacing: '1px', marginBottom: '10px' }}>{product.name}</h3>
        <p style={{ fontSize: '0.78rem', color: '#6B5540', lineHeight: 1.7, marginBottom: '12px' }}>{product.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: '#C9A84C', fontWeight: 600 }}>₹{product.price.toLocaleString()}</span>
          <span style={{ fontSize: '0.85rem', color: '#B8A88A', textDecoration: 'line-through' }}>₹{product.originalPrice?.toLocaleString()}</span>
        </div>
        <div style={{ color: '#C9A84C', fontSize: '0.8rem' }}>
          {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
          <span style={{ color: '#B8A88A', fontSize: '0.7rem', marginLeft: '6px' }}>({product.reviews})</span>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const { products, productsLoading, productsError } = useStore();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultCategory = queryParams.get('category') || 'All';

  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [sort, setSort] = useState('featured');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const cat = new URLSearchParams(location.search).get('category') || 'All';
    setActiveCategory(cat);
  }, [location.search]);

  const categories = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Sets'];

  let filtered = products.filter(p =>
    (activeCategory === 'All' || p.category === activeCategory) &&
    (search === '' || p.name.toLowerCase().includes(search.toLowerCase()))
  );

  if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', background: '#F5EFE0' }}>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, #2C1A0E 0%, #4A3020 100%)',
        padding: '80px 40px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.6rem', letterSpacing: '6px', color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>Explore</p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(3rem, 8vw, 5rem)',
          fontWeight: 200,
          letterSpacing: '8px',
          background: 'linear-gradient(135deg, #C9A84C 0%, #E8D5A3 40%, #A07830 70%, #C9A84C 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>Our Collections</h1>
        <p style={{ fontSize: '0.8rem', color: '#B8A88A', letterSpacing: '3px', marginTop: '12px' }}>
          {filtered.length} pieces curated for you
        </p>
      </div>

      {/* Filters */}
      <div style={{
        background: '#FFFDF7',
        padding: '24px 40px',
        borderBottom: '1px solid rgba(201,168,76,0.2)',
        display: 'flex', flexWrap: 'wrap', gap: '16px',
        alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: '70px', zIndex: 100,
      }}>
        {/* Category pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '8px 20px',
              background: activeCategory === cat ? 'linear-gradient(135deg, #C9A84C, #A07830)' : 'transparent',
              color: activeCategory === cat ? 'white' : '#4A3020',
              border: activeCategory === cat ? 'none' : '1px solid rgba(201,168,76,0.4)',
              cursor: 'pointer',
              fontSize: '0.65rem', letterSpacing: '2px', fontWeight: 600, textTransform: 'uppercase',
              transition: 'all 0.3s ease',
            }}>{cat}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <input
            type="text"
            placeholder="Search jewellery..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '8px 16px',
              border: '1px solid rgba(201,168,76,0.4)',
              background: 'transparent',
              fontFamily: "'Raleway', sans-serif",
              fontSize: '0.8rem', color: '#2C1A0E', outline: 'none',
              width: '200px',
            }}
          />
          {/* Sort */}
          <select value={sort} onChange={e => setSort(e.target.value)} style={{
            padding: '8px 16px',
            border: '1px solid rgba(201,168,76,0.4)',
            background: '#FFFDF7',
            fontFamily: "'Raleway', sans-serif",
            fontSize: '0.75rem', color: '#4A3020', outline: 'none', cursor: 'pointer',
          }}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '60px 40px' }}>
        {productsLoading && products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#A07830' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300 }}>Loading products…</p>
          </div>
        ) : productsError ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#A07830' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 300 }}>Couldn’t load products</p>
            <p style={{ fontSize: '0.8rem', letterSpacing: '2px', marginTop: '12px', color: '#6B5540' }}>{productsError}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#A07830' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300 }}>No pieces found</p>
            <p style={{ fontSize: '0.8rem', letterSpacing: '2px', marginTop: '12px' }}>Try a different search or category</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '28px' }}>
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ background: '#EDE0C8', padding: '80px 40px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 300, letterSpacing: '3px', color: '#2C1A0E', marginBottom: '8px' }}>Can't find what you're looking for?</p>
        <p style={{ fontSize: '0.8rem', letterSpacing: '2px', color: '#A07830', marginBottom: '30px' }}>Chat with us on WhatsApp for custom orders</p>
        <a href="https://wa.me/917977459392?text=Hi%20ORVÉ!%20I%27m%20looking%20for%20a%20specific%20jewellery%20piece." target="_blank" rel="noreferrer" className="btn-gold" style={{ fontSize: '0.7rem', letterSpacing: '3px' }}>
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
