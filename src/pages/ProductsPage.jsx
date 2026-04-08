import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { ProductCard } from "../components/ProductCard";

const sortOptions = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating-desc", label: "Top Rated" },
  { value: "rating-asc", label: "Lowest Rated" },
];

function ProductSkeleton() {
  return (
    <div className="bg-[#111] border border-white/8 rounded-3xl overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 skeleton rounded-lg w-1/3" />
        <div className="h-4 skeleton rounded-lg w-full" />
        <div className="h-4 skeleton rounded-lg w-2/3" />
        <div className="h-3 skeleton rounded-lg w-1/4" />
        <div className="h-px bg-white/5 my-2" />
        <div className="flex justify-between items-center">
          <div className="h-5 skeleton rounded-lg w-16" />
          <div className="h-7 skeleton rounded-xl w-16" />
        </div>
      </div>
    </div>
  );
}

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") === "rating" ? "rating-desc" : "default"
  );

  const { products, categories, isLoadingProducts, productsError } = useAppContext();

  useEffect(() => {
    document.title = "SkyMart | Products";
  }, []);

  useEffect(() => {
    const categoryQuery = searchParams.get("category");
    if (categoryQuery) {
      setCategoryFilter(categoryQuery);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (categoryFilter !== "all") {
      result = result.filter((item) => item.category === categoryFilter);
    }

    if (searchText.trim()) {
      const normalized = searchText.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(normalized) ||
          item.description.toLowerCase().includes(normalized) ||
          item.category.toLowerCase().includes(normalized)
      );
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
      case "rating-asc":
        result.sort((a, b) => (a.rating?.rate || 0) - (b.rating?.rate || 0));
        break;
      default:
        break;
    }

    return result;
  }, [products, categoryFilter, searchText, sortBy]);

  const hasActiveFilters =
    searchText.trim() !== "" || categoryFilter !== "all" || sortBy !== "default";

  const clearFilters = () => {
    setSearchText("");
    setCategoryFilter("all");
    setSortBy("default");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl sm:text-4xl mb-2">All Products</h1>
        <p className="text-white/40 font-body text-sm">
          {isLoadingProducts ? "Loading..." : `${filteredProducts.length} products found`}
          {categoryFilter !== "all" ? (
            <span className="text-volt">
              {" "}
              in <span className="capitalize">{categoryFilter}</span>
            </span>
          ) : null}
        </p>
      </div>

      <div className="bg-[#111] border border-white/8 rounded-2xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="field pl-10 pr-8 h-10 w-full"
            />
            {searchText ? (
              <button
                type="button"
                onClick={() => setSearchText("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60"
              >
                <X size={13} />
              </button>
            ) : null}
          </div>

          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="field h-10 pr-8 appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option value={category} key={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
            />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="field h-10 pr-8 appearance-none cursor-pointer min-w-[180px]"
            >
              {sortOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
            />
          </div>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 px-4 h-10 rounded-2xl text-sm font-body transition-all shrink-0"
            >
              <X size={13} /> Clear
            </button>
          ) : null}
        </div>

        {hasActiveFilters ? (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/6">
            {categoryFilter !== "all" ? (
              <span className="badge bg-volt/15 text-volt border border-volt/20 text-xs gap-1">
                {categoryFilter}
                <button type="button" onClick={() => setCategoryFilter("all")}>
                  <X size={10} />
                </button>
              </span>
            ) : null}

            {searchText ? (
              <span className="badge bg-volt/10 text-volt border border-volt/20 text-xs gap-1">
                "{searchText}"
                <button type="button" onClick={() => setSearchText("")}>
                  <X size={10} />
                </button>
              </span>
            ) : null}

            {sortBy !== "default" ? (
              <span className="badge bg-volt/10 text-volt border border-volt/20 text-xs gap-1">
                {sortOptions.find((option) => option.value === sortBy)?.label}
                <button type="button" onClick={() => setSortBy("default")}>
                  <X size={10} />
                </button>
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {productsError ? (
        <div className="flex flex-col items-center py-24 gap-4 text-center">
          <p className="font-heading font-bold text-xl text-white/60">Failed to load products</p>
          <button type="button" onClick={() => window.location.reload()} className="btn-volt">
            Retry
          </button>
        </div>
      ) : null}

      {isLoadingProducts ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : null}

      {!isLoadingProducts && !productsError && filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center py-24 gap-4 text-center">
          <div>
            <p className="font-heading font-bold text-xl text-white/50">No products found</p>
            <p className="text-white/25 text-sm mt-1">
              {searchText ? `No results for "${searchText}"` : "Try changing the filters"}
            </p>
          </div>
          <button type="button" onClick={clearFilters} className="btn-ghost mt-2">
            Clear Filters
          </button>
        </div>
      ) : null}

      {!isLoadingProducts && !productsError && filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              style={{ animationDelay: `${Math.min(index * 40, 500)}ms` }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
