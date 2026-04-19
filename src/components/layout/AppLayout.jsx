import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}