import { useEffect } from "react";
import { ArrowRight, ShieldCheck, Star, Tags, TrendingUp, Truck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { StatCard } from "../components/StatCard";
import { MiniProductRow } from "../components/MiniProductRow";

export function HomePage() {
  const {
    currentUser,
    cartCount,
    cartTotal,
    products,
    topRatedProducts,
    newArrivalProducts,
    categoryCounts,
    isLoadingProducts,
  } = useAppContext();

  useEffect(() => {
    document.title = "SkyTrust | Home";
  }, []);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Good morning" : currentHour < 17 ? "Good afternoon" : "Good evening";
  const firstName = currentUser?.name?.split(" ")[0] || "Shopper";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative overflow-hidden rounded-3xl bg-[#111] border border-white/8 p-8 sm:p-12 mb-10">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -right-16 w-80 h-80 bg-volt/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-volt/5 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(200,244,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,244,0,1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <p className="text-volt/70 text-sm font-body tracking-widest uppercase mb-3">{greeting}</p>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white leading-tight mb-4">
              Welcome back,
              <br />
              <span className="text-volt">{firstName}!</span>
            </h1>
            <p className="text-white/40 font-body max-w-md">
              Small demo store app using DummyJSON products.
            </p>
            <div className="flex gap-3 mt-6 flex-wrap">
              <Link to="/products" className="btn-volt flex items-center gap-2">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link to="/products" className="btn-ghost flex items-center gap-2">
                View All Products
              </Link>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-3">
            <div className="bg-volt/10 border border-volt/20 rounded-2xl px-6 py-4 text-center">
              <p className="font-heading font-bold text-4xl text-volt">
                {isLoadingProducts ? "..." : products.length}
              </p>
              <p className="text-white/40 text-xs font-body mt-1">Products</p>
            </div>
            <div className="bg-white/4 border border-white/8 rounded-2xl px-6 py-4 text-center">
              <p className="font-heading font-bold text-2xl text-white">DummyJSON</p>
              <p className="text-white/40 text-xs font-body mt-1">Data source</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 stagger">
        <StatCard
          icon={Truck}
          label="Cart Items"
          value={cartCount}
          sub="In your bag"
          color="bg-volt/10 text-volt"
        />
        <StatCard
          icon={TrendingUp}
          label="Cart Value"
          value={`$${cartTotal.toFixed(2)}`}
          sub="Ready to checkout"
          color="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          icon={Star}
          label="Top Products"
          value={topRatedProducts.length}
          sub="Highly rated"
          color="bg-amber-500/10 text-amber-400"
        />
        <StatCard
          icon={Tags}
          label="Categories"
          value={categoryCounts.length}
          sub="To explore"
          color="bg-purple-500/10 text-purple-400"
        />
      </div>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-xl">Shop by Category</h2>
          <Link
            to="/products"
            className="text-volt text-sm hover:text-volt-light transition-colors flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categoryCounts.map(([category, count]) => (
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              className="group bg-white border border-white/20 hover:border-white/40 hover:bg-white/95 rounded-2xl p-5 text-center transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-volt/20 flex items-center justify-center font-heading font-bold text-lg text-ink">
                {category.charAt(0).toUpperCase()}
              </div>
              <p className="font-body font-semibold text-ink/80 text-sm capitalize">{category}</p>
              <p className="text-ink/50 text-xs mt-1">{count} items</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-white border border-white/20 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-lg flex items-center gap-2 text-ink">
              <Star size={18} className="text-amber-400 fill-amber-400" /> Top Rated
            </h2>
            <Link
              to="/products?sort=rating"
              className="text-volt text-xs hover:text-volt-light flex items-center gap-1"
            >
              See all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {isLoadingProducts
              ? [...Array(5)].map((_, index) => (
                  <div key={`top-skeleton-${index}`} className="h-14 skeleton rounded-2xl" />
                ))
              : topRatedProducts.map((item) => <MiniProductRow key={item.id} product={item} />)}
          </div>
        </div>

        <div className="bg-white border border-white/20 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-lg flex items-center gap-2 text-ink">
              <Zap size={18} className="text-volt fill-volt" /> New Arrivals
            </h2>
            <Link to="/products" className="text-volt text-xs hover:text-volt-light flex items-center gap-1">
              See all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {isLoadingProducts
              ? [...Array(5)].map((_, index) => (
                  <div key={`new-skeleton-${index}`} className="h-14 skeleton rounded-2xl" />
                ))
              : newArrivalProducts.map((item) => <MiniProductRow key={item.id} product={item} />)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Zap, title: "React Router", desc: "Multi-page navigation", color: "text-volt" },
          { icon: ShieldCheck, title: "Context API", desc: "App state in one place", color: "text-blue-400" },
          { icon: Tags, title: "DummyJSON", desc: "Product list API", color: "text-green-400" },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-[#111] border border-white/8 rounded-2xl p-5 flex items-center gap-4"
          >
            <item.icon size={24} className={item.color} />
            <div>
              <p className="font-body font-semibold text-white/80 text-sm">{item.title}</p>
              <p className="text-white/30 text-xs">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
