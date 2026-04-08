import { createBrowserRouter, redirect } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { HomePage } from "../pages/HomePage";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductDetailsPage } from "../pages/ProductDetailsPage";
import { AboutPage } from "../pages/AboutPage";

const AUTH_STORAGE_KEY = "skytrust_auth_user";

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const requireAuthLoader = () => {
  if (!readStoredUser()) {
    return redirect("/login");
  }
  return null;
};

const publicOnlyLoader = () => {
  if (readStoredUser()) {
    return redirect("/home");
  }
  return null;
};

const fallbackLoader = () => {
  return redirect(readStoredUser() ? "/home" : "/login");
};

export const appRouter = createBrowserRouter([
  {
    path: "/login",
    loader: publicOnlyLoader,
    element: <LoginPage />,
  },
  {
    path: "/register",
    loader: publicOnlyLoader,
    element: <RegisterPage />,
  },
  {
    path: "/",
    loader: requireAuthLoader,
    element: <AppShell />,
    children: [
      {
        index: true,
        loader: () => redirect("/home"),
      },
      { path: "home", element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "products/:id", element: <ProductDetailsPage /> },
      { path: "about", element: <AboutPage /> },
    ],
  },
  {
    path: "*",
    loader: fallbackLoader,
  },
]);
