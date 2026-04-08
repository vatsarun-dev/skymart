export function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-[#111] border border-white/8 rounded-3xl p-6 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="font-heading font-bold text-2xl text-white">{value}</p>
        <p className="text-white/50 text-sm font-body">{label}</p>
        {sub ? <p className="text-white/25 text-xs font-body mt-0.5">{sub}</p> : null}
      </div>
    </div>
  );
}
