import { useState, useEffect } from "react";
import { FiHome, FiCoffee, FiTrendingUp, FiHeart, FiUser, FiMenu, FiX } from "react-icons/fi";
import "./Navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle screen resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) setIsMenuOpen(false);
  }, [isMobile]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => document.body.style.overflow = "auto";
  }, [isMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/home", icon: <FiHome className="icon" /> },
    { name: "Food Service", href: "/food-service", icon: <FiCoffee className="icon" /> },
    { name: "Progress", href: "/progress", icon: <FiTrendingUp className="icon" /> },
    { name: "Health", href: "/health", icon: <FiHeart className="icon" /> },
    { name: "Profile", href: "/profile", icon: <FiUser className="icon" /> },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand" style={{marginLeft:"5px",color:"blue", fontWeight:"700"}}>Smart Diet</div>

          <div className="desktop-menu">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="nav-link">
                {link.icon}
                <span>{link.name}</span>
              </a>
            ))}
          </div>

          <button 
            className="mobile-menu-button"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FiX className="icon" /> : <FiMenu className="icon" />}
          </button>
        </div>

        <div className={`mobile-menu-overlay ${isMenuOpen ? "open" : ""}`}>
          <div className="mobile-menu-content">
            <div className="mobile-menu-header">
              <span>Menu</span>
              <button onClick={() => setIsMenuOpen(false)}>
                <FiX className="icon" />
              </button>
            </div>
            <div className="mobile-menu-links">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <div className="nav-spacer"></div>
    </>
  );
}