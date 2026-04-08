import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, ShoppingCart, X, Zap } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const navItems = [
  { to: "/home", label: "Home" },
  { to: "/products", label: "Shop" },
  { to: "/about", label: "About" },
];

export function Header() {
  const navigate = useNavigate();
  const { currentUser, cartCount, toggleCart, logoutUser } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0d0d0d]/90 backdrop-blur-xl border-b border-white/8"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        <NavLink to="/home" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-volt rounded-xl flex items-center justify-center">
            <Zap size={15} className="text-ink fill-ink" />
          </div>
          <span className="font-heading font-bold text-lg">
            Sky<span className="text-volt">Mart</span>
          </span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
              <div className="w-6 h-6 bg-volt rounded-lg flex items-center justify-center text-ink text-xs font-bold">
                {currentUser.avatar || currentUser.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="text-sm text-white/70 font-body max-w-[100px] truncate">
                {currentUser.name}
              </span>
            </div>
          ) : null}

          <button
            type="button"
            onClick={toggleCart}
            className="relative p-2.5 bg-white/8 hover:bg-white/15 border border-white/10 rounded-xl transition-all"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 ? (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-volt text-ink text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            title="Logout"
            onClick={handleLogout}
            className="p-2.5 bg-white/8 hover:bg-red-500/20 hover:border-red-500/30 border border-white/10 rounded-xl transition-all text-white/60 hover:text-red-400"
          >
            <LogOut size={16} />
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2.5 bg-white/8 border border-white/10 rounded-xl"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="md:hidden border-t border-white/8 bg-[#111] px-4 py-4 flex flex-col gap-3 animate-fade-in">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `nav-link text-base py-2 ${isActive ? "active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 text-sm mt-2"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      ) : null}
    </header>
  );
}
