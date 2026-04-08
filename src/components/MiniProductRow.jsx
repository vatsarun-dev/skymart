import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export function MiniProductRow({ product }) {
  const { addToCart, openCart } = useAppContext();

  const quickAdd = (event) => {
    event.preventDefault();
    addToCart(product);
    openCart();
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex items-center gap-3 p-3 bg-white/3 hover:bg-white/6 border border-white/6 hover:border-volt/30 rounded-2xl transition-all duration-200"
    >
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 p-1.5">
        <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white/80 text-xs font-body clamp-1">{product.title}</p>
        <p className="text-volt font-heading font-bold text-sm mt-0.5">${product.price.toFixed(2)}</p>
      </div>
      <button
        type="button"
        onClick={quickAdd}
        className="shrink-0 w-7 h-7 bg-volt/10 hover:bg-volt text-volt hover:text-ink rounded-lg flex items-center justify-center transition-all"
      >
        <ShoppingBag size={13} />
      </button>
    </Link>
  );
}
