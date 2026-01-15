import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-600 to-orange-500 shadow-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-white">
        <Link href="/" className="text-xl font-bold tracking-wide">
          🚩 Bajrang Parivaar
        </Link>

        <div className="flex gap-6 text-sm font-medium">
          <Link
            href="/privacy-policy"
            className="hover:underline underline-offset-4"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="hover:underline underline-offset-4"
          >
            Terms
          </Link>
        </div>
      </nav>
    </header>
  );
}
