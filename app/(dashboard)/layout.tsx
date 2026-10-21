export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full min-h-dvh min-w-dvw overflow-hidden">{children}</div>
  );
}
