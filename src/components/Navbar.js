import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStore } from "../context/StoreContext";
import { appConfig } from "../config/appConfig";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cart, cartCount, cartTotal, removeFromCart } = useStore();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setCartOpen(false);
  }, [router.asPath]);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Collections", path: "/shop" },
    { label: "About", path: "/about" },
    { label: "Track Order", path: "/track" },
    { label: "Contact", path: "/contact" },
  ];

  const navStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    padding: scrolled ? "12px 40px" : "24px 40px",
    background: scrolled ? "rgba(245,239,224,0.97)" : "transparent",
    backdropFilter: scrolled ? "blur(20px)" : "none",
    borderBottom: scrolled ? "1px solid rgba(201,168,76,0.2)" : "none",
    transition: "all 0.4s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  return (
    <>
      <nav style={navStyle}>
        {/* Logo */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.8rem",
              fontWeight: 300,
              letterSpacing: "8px",
              background:
                "linear-gradient(135deg, #C9A84C 0%, #E8D5A3 40%, #A07830 70%, #C9A84C 100%)",
              backgroundSize: "200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ORVÉ
          </span>
          <span
            style={{
              fontSize: "0.55rem",
              letterSpacing: "5px",
              color: "#A07830",
              fontWeight: 500,
              textTransform: "uppercase",
            }}
          >
            Luxury Jewellery
          </span>
        </Link>

        {/* Desktop Nav */}
        <div
          style={{ display: "flex", gap: "36px", alignItems: "center" }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              style={{
                textDecoration: "none",
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: router.asPath === link.path ? "#C9A84C" : "#2C1A0E",
                borderBottom:
                  router.asPath === link.path
                    ? "1px solid #C9A84C"
                    : "1px solid transparent",
                paddingBottom: "2px",
                transition: "all 0.3s ease",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Icons */}
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {/* Cart */}
          <button
            onClick={() => setCartOpen(!cartOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
              color: "#2C1A0E",
              fontSize: "1.3rem",
            }}
          >
            🛍️
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "linear-gradient(135deg, #C9A84C, #A07830)",
                  color: "white",
                  fontSize: "0.6rem",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              padding: "4px",
            }}
            className="hamburger"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: "22px",
                  height: "1.5px",
                  background: "#2C1A0E",
                  display: "block",
                  transition: "all 0.3s ease",
                  transform:
                    menuOpen && i === 0
                      ? "rotate(45deg) translate(5px,5px)"
                      : menuOpen && i === 1
                        ? "scaleX(0)"
                        : menuOpen && i === 2
                          ? "rotate(-45deg) translate(5px,-5px)"
                          : "none",
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile / Side Menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 998,
            display: "flex",
          }}
        >
          <div
            onClick={() => setMenuOpen(false)}
            style={{ flex: 1, background: "rgba(44,26,14,0.5)" }}
          />
          <div
            style={{
              width: "300px",
              background: "#F5EFE0",
              padding: "100px 40px 40px",
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              borderLeft: "1px solid rgba(201,168,76,0.3)",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                style={{
                  textDecoration: "none",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.8rem",
                  fontWeight: 300,
                  letterSpacing: "3px",
                  color: router.asPath === link.path ? "#C9A84C" : "#2C1A0E",
                }}
              >
                {link.label}
              </Link>
            ))}
            <div
              style={{
                marginTop: "auto",
                borderTop: "1px solid rgba(201,168,76,0.3)",
                paddingTop: "24px",
              }}
            >
              <Link
                href={
                  appConfig.whatsappUrl +
                  "?text=Hi%20ORVÉ!%20I%27m%20interested%20in%20your%20jewellery"
                }
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none" }}
              >
                <button className="btn-gold" style={{ width: "100%" }}>
                  Shop on WhatsApp
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 998, display: "flex" }}
        >
          <div
            onClick={() => setCartOpen(false)}
            style={{ flex: 1, background: "rgba(44,26,14,0.5)" }}
          />
          <div
            style={{
              width: "380px",
              background: "#FFFDF7",
              padding: "80px 30px 30px",
              display: "flex",
              flexDirection: "column",
              borderLeft: "1px solid rgba(201,168,76,0.3)",
              overflowY: "auto",
            }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.8rem",
                fontWeight: 300,
                letterSpacing: "4px",
                marginBottom: "30px",
              }}
            >
              YOUR BAG
            </h2>
            {cart.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: "#A07830",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🛍️</div>
                <p
                  style={{
                    fontFamily: "'Raleway', sans-serif",
                    fontSize: "0.8rem",
                    letterSpacing: "2px",
                  }}
                >
                  YOUR BAG IS EMPTY
                </p>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      gap: "16px",
                      padding: "16px 0",
                      borderBottom: "1px solid rgba(201,168,76,0.2)",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "1rem",
                          fontWeight: 500,
                        }}
                      >
                        {item.name}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#A07830",
                          letterSpacing: "1px",
                        }}
                      >
                        Qty: {item.qty}
                      </p>
                      <p
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "#C9A84C",
                        }}
                      >
                        ₹{(item.price * item.qty).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        color: "#A07830",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div
                  style={{
                    marginTop: "24px",
                    paddingTop: "20px",
                    borderTop: "1px solid rgba(201,168,76,0.3)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "20px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Raleway', sans-serif",
                        letterSpacing: "2px",
                        fontSize: "0.8rem",
                      }}
                    >
                      TOTAL
                    </span>
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1.4rem",
                        color: "#C9A84C",
                        fontWeight: 500,
                      }}
                    >
                      ₹{cartTotal.toLocaleString()}
                    </span>
                  </div>
                  <Link
                    href={
                      appConfig.whatsappUrl +
                      `?text=Hi%20ORVÉ!%20I%20want%20to%20order:%20${cart.map((p) => `${p.name} x${p.qty}`).join(", ")}%20Total:%20₹${cartTotal}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none", display: "block" }}
                  >
                    <button className="btn-gold" style={{ width: "100%" }}>
                      Checkout via WhatsApp
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          nav { padding: 16px 20px !important; }
        }
      `}</style>
    </>
  );
}
