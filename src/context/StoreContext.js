import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

const INITIAL_PRODUCTS = [
  { id: 1, name: "Celeste Layered Necklace", category: "Necklaces", price: 1499, originalPrice: 2199, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80", description: "Delicate multi-layer gold chain with pearl drop pendant. Anti-tarnish coated for lasting brilliance.", stock: 15, inStock: true, featured: true, rating: 4.8, reviews: 24 },
  { id: 2, name: "Aurora Statement Ring", category: "Rings", price: 899, originalPrice: 1299, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80", description: "Bold geometric ring with faux diamond cluster. Adjustable band fits sizes 6–9.", stock: 22, inStock: true, featured: true, rating: 4.7, reviews: 18 },
  { id: 3, name: "Lumière Drop Earrings", category: "Earrings", price: 699, originalPrice: 999, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80", description: "Long cascading gold drops with crystal detailing. Lightweight and hypoallergenic.", stock: 8, inStock: true, featured: true, rating: 4.9, reviews: 31 },
  { id: 4, name: "Velvet Cuff Bracelet", category: "Bracelets", price: 1199, originalPrice: 1699, image: "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&q=80", description: "Wide gold cuff with intricate laser-cut floral motif. A statement on its own.", stock: 5, inStock: true, featured: false, rating: 4.6, reviews: 12 },
  { id: 5, name: "Celestial Choker Set", category: "Sets", price: 2499, originalPrice: 3499, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80", description: "Matching choker necklace and stud earrings set with moon & star motifs.", stock: 0, inStock: false, featured: true, rating: 4.8, reviews: 9 },
  { id: 6, name: "Soleil Stud Earrings", category: "Earrings", price: 499, originalPrice: 749, image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&q=80", description: "Mini sunburst stud earrings in 18K gold-plated brass. Everyday luxury.", stock: 30, inStock: true, featured: false, rating: 4.5, reviews: 42 },
  { id: 7, name: "Maharani Jhumka Set", category: "Sets", price: 1899, originalPrice: 2699, image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80", description: "Traditional Indian jhumka earrings with contemporary gold finish. Festival-ready elegance.", stock: 12, inStock: true, featured: true, rating: 4.9, reviews: 55 },
  { id: 8, name: "Rivière Tennis Bracelet", category: "Bracelets", price: 1699, originalPrice: 2299, image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80", description: "Classic diamond-cut crystal tennis bracelet in lustrous gold. Timeless sophistication.", stock: 7, inStock: true, featured: false, rating: 4.7, reviews: 19 },
];

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

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('orve_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orve_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('orve_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('orve_complaints');
    return saved ? JSON.parse(saved) : [];
  });
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => { localStorage.setItem('orve_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('orve_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('orve_reviews', JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem('orve_complaints', JSON.stringify(complaints)); }, [complaints]);

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

  const addProduct = (product) => {
    const newP = { ...product, id: Date.now(), rating: 0, reviews: 0 };
    setProducts(prev => [...prev, newP]);
    showToast('Product added successfully ✨');
  };

  const updateProduct = (id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product deleted');
  };

  const toggleStock = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, inStock: !p.inStock, stock: p.inStock ? 0 : 10 } : p));
  };

  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    showToast(`Order ${id} updated to ${status}`);
  };

  const addOrder = (order) => {
    const newOrder = { ...order, id: `ORV-${String(orders.length + 1).padStart(3, '0')}`, date: new Date().toISOString().split('T')[0] };
    setOrders(prev => [...prev, newOrder]);
    return newOrder.id;
  };

  const approveReview = (id) => setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: true } : r));
  const deleteReview = (id) => setReviews(prev => prev.filter(r => r.id !== id));
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
      cartTotal, cartCount,
      addToCart, removeFromCart, clearCart,
      addProduct, updateProduct, deleteProduct, toggleStock,
      updateOrderStatus, addOrder,
      approveReview, deleteReview, addReview,
      addComplaint, showToast
    }}>
      {children}
      {toast && <div className="toast">✨ {toast}</div>}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
