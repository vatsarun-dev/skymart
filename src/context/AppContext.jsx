import { createContext, useContext, useEffect, useMemo, useState } from "react";

const PRODUCTS_ENDPOINT = "https://dummyjson.com/products";
const STORAGE_KEYS = {
  USERS: "skymart_users",
  AUTH_USER: "skymart_auth_user",
  CART: "skymart_cart",
  FAVORITES: "skymart_favorites",
};

const AppContext = createContext(null);

const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
};

const normalizeProduct = (item) => ({
  id: item.id,
  title: item.title,
  description: item.description,
  category: item.category,
  price: Number(item.price || 0),
  image: item.thumbnail || item.images?.[0] || "",
  rating: {
    rate:
      typeof item.rating === "number"
        ? item.rating
        : Number(item.rating?.rate || 0),
    count:
      typeof item.rating === "object" && typeof item.rating?.count === "number"
        ? item.rating.count
        : Math.max(40, Number(item.stock || 0) * 8),
  },
});

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [users, setUsers] = useState(() => readStorage(STORAGE_KEYS.USERS, []));
  const [currentUser, setCurrentUser] = useState(() =>
    readStorage(STORAGE_KEYS.AUTH_USER, null)
  );
  const [cartItems, setCartItems] = useState(() =>
    readStorage(STORAGE_KEYS.CART, [])
  );
  const [favoriteIds, setFavoriteIds] = useState(() =>
    readStorage(STORAGE_KEYS.FAVORITES, [])
  );
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch(PRODUCTS_ENDPOINT)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load products");
        }
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        const mapped = (data.products || []).map(normalizeProduct);
        setProducts(mapped);
        setProductsError("");
      })
      .catch((error) => {
        if (!isMounted) return;
        setProductsError(error.message || "Unable to fetch products");
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoadingProducts(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const categories = useMemo(
    () => [...new Set(products.map((item) => item.category))],
    [products]
  );

  const categoryCounts = useMemo(() => {
    const map = {};
    products.forEach((item) => {
      map[item.category] = (map[item.category] || 0) + 1;
    });
    return Object.entries(map);
  }, [products]);

  const topRatedProducts = useMemo(
    () =>
      [...products]
        .sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
        .slice(0, 5),
    [products]
  );

  const newArrivalProducts = useMemo(() => products.slice(0, 5), [products]);

  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0),
        0
      ),
    [cartItems]
  );

  const isAuthenticated = Boolean(currentUser);

  const registerUser = ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = users.find((user) => user.email === normalizedEmail);

    if (existing) {
      return { ok: false, message: "User already exists with this email." };
    }

    const nextUser = {
      id: Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      avatar: name.trim().charAt(0).toUpperCase(),
    };

    setUsers((prev) => [...prev, nextUser]);
    setCurrentUser({
      id: nextUser.id,
      name: nextUser.name,
      email: nextUser.email,
      avatar: nextUser.avatar,
    });
    return { ok: true };
  };

  const loginUser = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = users.find(
      (user) => user.email === normalizedEmail && user.password === password
    );

    if (!existing) {
      return { ok: false, message: "Invalid email or password." };
    }

    setCurrentUser({
      id: existing.id,
      name: existing.name,
      email: existing.email,
      avatar: existing.avatar,
    });
    return { ok: true };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setIsCartOpen(false);
  };

  const getProductById = (id) =>
    products.find((item) => Number(item.id) === Number(id)) || null;

  const getRelatedProducts = (productId, limit = 5) => {
    const source = getProductById(productId);
    if (!source) return [];
    return products
      .filter(
        (item) =>
          item.category === source.category && Number(item.id) !== Number(productId)
      )
      .slice(0, limit);
  };

  const isInCart = (productId) =>
    cartItems.some((item) => Number(item.id) === Number(productId));

  const addToCart = (product) => {
    setCartItems((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    });
  };

  const incrementCartItem = (productId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementCartItem = (productId) => {
    setCartItems((prev) =>
      prev.flatMap((item) => {
        if (item.id !== productId) return item;
        if (item.quantity <= 1) return [];
        return { ...item, quantity: item.quantity - 1 };
      })
    );
  };

  const removeCartItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCartItems([]);

  const toggleFavorite = (productId) => {
    setFavoriteIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isFavorite = (productId) => favoriteIds.includes(productId);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const value = {
    products,
    isLoadingProducts,
    productsError,
    categories,
    categoryCounts,
    topRatedProducts,
    newArrivalProducts,
    users,
    currentUser,
    isAuthenticated,
    cartItems,
    cartCount,
    cartTotal,
    isCartOpen,
    registerUser,
    loginUser,
    logoutUser,
    getProductById,
    getRelatedProducts,
    isInCart,
    addToCart,
    incrementCartItem,
    decrementCartItem,
    removeCartItem,
    clearCart,
    toggleFavorite,
    isFavorite,
    openCart,
    closeCart,
    toggleCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return context;
}
