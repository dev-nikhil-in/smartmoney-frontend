import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({ title, subtitle, children }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0f172a" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}