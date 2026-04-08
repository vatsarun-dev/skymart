import { useEffect } from "react";

export function AboutPage() {
  useEffect(() => {
    document.title = "SkyTrust | About";
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="font-heading font-bold text-4xl sm:text-5xl mb-4">
          About <span className="text-volt">SkyTrust</span>
        </h1>
        <p className="text-white/40 font-body text-base max-w-2xl mx-auto leading-relaxed">
          Small demo store built with React + Vite. Products come from DummyJSON.
        </p>
      </div>

      <div className="bg-[#111] border border-white/8 rounded-3xl p-8 sm:p-10">
        <h2 className="font-heading font-bold text-2xl mb-4">Notes</h2>
        <ul className="list-disc pl-5 space-y-2 text-white/50 font-body text-sm leading-relaxed">
          <li>Login/register/cart/favorites are stored in localStorage.</li>
          <li>Routing: React Router.</li>
          <li>Forms: react-hook-form.</li>
        </ul>
      </div>
    </div>
  );
}
