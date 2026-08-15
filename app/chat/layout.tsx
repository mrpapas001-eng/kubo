import Link from "next/link";
import ChatSidebar from "@/components/ChatSidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.10),_transparent_35%),linear-gradient(135deg,#fffaf0,#f8fafc,#eef2ff)] p-4 md:p-6">
      <div className="mx-auto flex h-[calc(100vh-48px)] max-w-[1180px] overflow-hidden rounded-[40px] bg-white shadow-[0_40px_120px_rgba(15,23,42,0.18)]">
        <ChatSidebar />

        <main className="relative min-w-0 flex-1">
          <div className="absolute right-4 top-4 z-50">
            <Link
              href="/"
              className="inline-flex items-center rounded-full bg-white/95 px-4 py-2 text-sm font-black text-slate-800 shadow-md ring-1 ring-slate-200 hover:bg-slate-50"
            >
              ← Volver
            </Link>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}