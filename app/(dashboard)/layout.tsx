export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full min-h-dvh min-w-dvw overflow-hidden">
      <nav className="w-full flex h-16 shadow-lg mx-auto max-w-txl mb-6 overflow-hidden bg-slate-900 rounded-md"></nav>
      {children}
    </div>
  );
}
