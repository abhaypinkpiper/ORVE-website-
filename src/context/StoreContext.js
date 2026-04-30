import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

const SHEETS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY || process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;
const SHEETS_SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || process.env.REACT_APP_GOOGLE_SHEET_ID;
const SHEETS_RANGE = process.env.NEXT_PUBLIC_GOOGLE_SHEET_RANGE || process.env.REACT_APP_GOOGLE_SHEET_RANGE || 'Products!A2:G';

const INITIAL_ORDERS = [
  { id: "ORV-001", customer: "Priya Sharma", phone: "9876543210", product: "Celeste Layered Necklace", amount: 1499, status: "Delivered", date: "2025-04-10", address: "Mumbai, Maharashtra" },
  { id: "ORV-002", customer: "Anita Verma", phone: "9823456780", product: "Lumière Drop Earrings", amount: 699, status: "Shipped", date: "2025-04-14", address: "Delhi, India" },
  { id: "ORV-003", customer: "Kavita Singh", phone: "9712345670", product: "Maharani Jhumka Set", amount: 1899, status: "Confirmed", date: "2025-04-16", address: "Jaipur, Rajasthan" },
  { id: "ORV-004", customer: "Ritu Patel", phone: "9634567890", product: "Aurora Statement Ring", amount: 899, status: "Pending", date: "2025-04-17", address: "Ahmedabad, Gujarat" },
];

const INITIAL_REVIEWS = [
  { id: 1, name: "Priya S.", product: "Celeste Layered Necklace", rating: 5, comment: "Absolutely stunning! The quality is incredible for the price. Got so many compliments at my sister's wedding.", date: "2025-04-12", approved: true },
  { id: 2, name: "Sneha M.", product: "Lumière Drop Earrings", rating: 5, comment: "These are my go-to earrings now. Light, beautiful, and haven't tarnished even after 3 months!", date: "2025-04-08", approved: true },
  { id: 3, name: "Riya K.", product: "Maharani Jhumka Set", rating: 5, comment: "Wore these for Diwali and they were the talk of the party. Luxury at an amazing price.", date: "2025-04-01", approved: true },
];

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function parseOfferEnabled(value) {
  if (typeof value === 'boolean') return value;
  const s = String(value ?? '').trim().toLowerCase();
  return s === 'true' || s === '1' || s === 'yes' || s === 'y' || s === 'enabled' || s === 'on';
}

function parseNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const s = String(value ?? '').trim();
  if (s === '') return null;
  const cleaned = s.replace(/[^0-9.]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function parseCommaList(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

async function fetchProductsFromGoogleSheets() {
  if (!SHEETS_API_KEY || !SHEETS_SPREADSHEET_ID) {
    throw new Error('Missing NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY or NEXT_PUBLIC_GOOGLE_SHEET_ID in .env');
  }
  

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
    SHEETS_SPREADSHEET_ID
  )}/values/${encodeURIComponent(SHEETS_RANGE)}?key=${encodeURIComponent(SHEETS_API_KEY)}`;

  const res = await fetch(url);
  
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Google Sheets request failed (${res.status}) ${text}`.trim());
  }
  const data = await res.json();
  const rows = Array.isArray(data?.values) ? data.values : [];

  const normalizedRows = rows
    .map(r => (Array.isArray(r) ? r : [String(r ?? '')]))
    .filter(r => r.some(cell => String(cell ?? '').trim() !== ''));

  if (normalizedRows.length === 0) return [];

  const maybeHeader = normalizedRows[0].map(v => String(v ?? '').trim().toLowerCase());
  const hasHeader = maybeHeader.includes('name') || maybeHeader[0] === 'name';
  const dataRows = hasHeader ? normalizedRows.slice(1) : normalizedRows;

  return dataRows.map((row, index) => {
    const cells = row.length === 1 ? row[0].split(',') : row;
    const [name, description, price, offerPrice, offerEnabled, imgUrl, videoUrl] = [
      cells[0],
      cells[1],
      cells[2],
      cells[3],
      cells[4],
      cells[5],
      cells[6],
    ].map(v => String(v ?? '').trim());

    const basePrice = parseNumber(price);
    const offerPriceNumber = parseNumber(offerPrice);
    const offerOn = parseOfferEnabled(offerEnabled);

    const effectivePrice = offerOn && offerPriceNumber != null ? offerPriceNumber : basePrice ?? 0;
    const originalPrice =
      offerOn && basePrice != null && offerPriceNumber != null && offerPriceNumber < basePrice ? basePrice : null;

    const imgUrls = parseCommaList(imgUrl);
    const videoUrls = parseCommaList(videoUrl);

    return {
      id: `sheet-${index + 1}`,
      name,
      description,
      price: effectivePrice,
      originalPrice: originalPrice ?? undefined,
      offerEnabled: offerOn,
      offerPrice: offerPriceNumber ?? undefined,
      imgUrls,
      videoUrls,
      image: imgUrls[0] || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
      category: 'All',
      stock: 999,
      inStock: true,
      featured: index < 6,
      rating: 4.8,
      reviews: 0,
    };
  });
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [complaints, setComplaints] = useState([]);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedOrders = window.localStorage.getItem('orve_orders');
    const savedReviews = window.localStorage.getItem('orve_reviews');
    const savedComplaints = window.localStorage.getItem('orve_complaints');

    if (savedOrders) setOrders(safeJsonParse(savedOrders, INITIAL_ORDERS));
    if (savedReviews) setReviews(safeJsonParse(savedReviews, INITIAL_REVIEWS));
    if (savedComplaints) setComplaints(safeJsonParse(savedComplaints, []));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('orve_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('orve_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('orve_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);
        const sheetProducts = await fetchProductsFromGoogleSheets();
        if (cancelled) return;
        setProducts(sheetProducts);
      } catch (e) {
        if (!cancelled) setProductsError(e?.message || 'Failed to load products');
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`${product.name} added to cart ✨`);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(p => p.id !== id));
  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((sum, p) => sum + p.price * p.qty, 0);
  const cartCount = cart.reduce((sum, p) => sum + p.qty, 0);
  const addReview = (review) => {
    const newR = { ...review, id: Date.now(), date: new Date().toISOString().split('T')[0], approved: false };
    setReviews(prev => [...prev, newR]);
    showToast('Review submitted! Thank you 💛');
  };
  const addComplaint = (complaint) => {
    const newC = { ...complaint, id: Date.now(), date: new Date().toISOString().split('T')[0], resolved: false };
    setComplaints(prev => [...prev, newC]);
    showToast('Complaint received. We\'ll respond within 24hrs 🙏');
  };

  return (
    <StoreContext.Provider value={{
      products, orders, reviews, complaints, cart, toast,
      productsLoading, productsError,
      cartTotal, cartCount,
      addToCart, removeFromCart, clearCart,
      addReview,
      addComplaint, showToast
    }}>
      {children}
      {toast && <div className="toast">✨ {toast}</div>}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
