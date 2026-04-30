import React from "react";
import Link from "next/link";
import { appConfig } from "../config/appConfig";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#2C1A0E",
        color: "#E8D5A3",
        padding: "80px 40px 40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "50px",
          marginBottom: "60px",
        }}
      >
        {/* Brand */}
        <div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.5rem",
              fontWeight: 300,
              letterSpacing: "8px",
              background:
                "linear-gradient(135deg, #C9A84C 0%, #E8D5A3 50%, #A07830 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "8px",
            }}
          >
            ORVÉ
          </h2>
          <p
            style={{
              fontSize: "0.65rem",
              letterSpacing: "4px",
              color: "#A07830",
              fontWeight: 500,
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Luxury Jewellery
          </p>
          <p
            style={{
              fontSize: "0.85rem",
              lineHeight: 1.8,
              color: "#B8A88A",
              maxWidth: "260px",
            }}
          >
            Crafting timeless elegance for the modern woman. Anti-tarnish,
            premium quality jewellery that tells your story.
          </p>
          <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
            <Link
              href={appConfig.instagramUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                width: "40px",
                height: "40px",
                border: "1px solid rgba(201,168,76,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                fontSize: "1.1rem",
                transition: "all 0.3s",
                color: "#C9A84C",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "rgba(201,168,76,0.2)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              📸
            </Link>
            <Link
              href={appConfig.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                width: "40px",
                height: "40px",
                border: "1px solid rgba(201,168,76,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                fontSize: "1.1rem",
                transition: "all 0.3s",
                color: "#C9A84C",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "rgba(201,168,76,0.2)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              💬
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3
            style={{
              fontSize: "0.65rem",
              letterSpacing: "4px",
              color: "#C9A84C",
              fontWeight: 600,
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            Navigate
          </h3>
          {[
            { label: "Home", path: "/" },
            { label: "Collections", path: "/shop" },
            { label: "About ORVÉ", path: "/about" },
            // { label: 'Track Order', path: '/track' },
            { label: "Reviews", path: "/reviews" },
            { label: "Contact", path: "/contact" },
          ].map((link) => (
            <Link
              key={link.path}
              href={link.path}
              style={{
                display: "block",
                textDecoration: "none",
                color: "#B8A88A",
                fontSize: "0.85rem",
                lineHeight: 2.4,
                letterSpacing: "1px",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#C9A84C")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#B8A88A")}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Categories */}
        <div>
          <h3
            style={{
              fontSize: "0.65rem",
              letterSpacing: "4px",
              color: "#C9A84C",
              fontWeight: 600,
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            Collections
          </h3>
          {[
            "Rings",
            "Necklaces",
            "Earrings",
            "Bracelets",
            "Sets",
            "New Arrivals",
          ].map((cat) => (
            <Link
              key={cat}
              href={`/shop?category=${encodeURIComponent(cat)}`}
              style={{
                display: "block",
                textDecoration: "none",
                color: "#B8A88A",
                fontSize: "0.85rem",
                lineHeight: 2.4,
                letterSpacing: "1px",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#C9A84C")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#B8A88A")}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h3
            style={{
              fontSize: "0.65rem",
              letterSpacing: "4px",
              color: "#C9A84C",
              fontWeight: 600,
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            Get in Touch
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <Link
              href={appConfig.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: "none",
                color: "#B8A88A",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ color: "#C9A84C" }}>📱</span>{" "}
              {appConfig.appContact}
            </Link>
            <Link
              href={appConfig.instagramUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: "none",
                color: "#B8A88A",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ color: "#C9A84C" }}>📸</span> @ORVE.jewels
            </Link>
            <Link
              href={appConfig.websiteUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: "none",
                color: "#B8A88A",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ color: "#C9A84C" }}>🌐</span>{" "}
              {appConfig.websiteUrl}
            </Link>
          </div>
          <div style={{ marginTop: "30px" }}>
            <Link
              href={
                appConfig.whatsappUrl +
                "?text=Hi%20ORVÉ!%20I%27m%20interested%20in%20your%20jewellery"
              }
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none" }}
            >
              <button className="btn-gold">Shop Now</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid rgba(201,168,76,0.2)",
          paddingTop: "30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            color: "#6B5540",
            letterSpacing: "1px",
          }}
        >
          © 2025 ORVÉ Luxury Jewellery. All rights reserved.
        </p>
        <p
          style={{ fontSize: "0.7rem", color: "#6B5540", letterSpacing: "1px" }}
        >
          Elegance You Wear ✦
        </p>
      </div>
    </footer>
  );
}
