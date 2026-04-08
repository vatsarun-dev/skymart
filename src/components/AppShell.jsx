import { Outlet } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { Header } from "./Header";

export function AppShell() {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <CartDrawer />
      <Header />
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-white/8 py-8 text-center mt-20">
        <p className="font-heading text-volt text-xl mb-1">SkyMart</p>
        <p className="text-white/30 text-xs">
          © 2025 SkyMart • Built with React + Context API
        </p>
      </footer>
    </div>
  );
}
