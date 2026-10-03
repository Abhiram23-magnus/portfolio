import { profile } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="relative border-t border-[color:var(--border)] bg-[rgba(5,8,12,0.8)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-[color:var(--muted)] sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p className="font-mono text-xs">Built with Next.js, React Three Fiber and Tailwind CSS</p>
      </div>
    </footer>
  );
}
