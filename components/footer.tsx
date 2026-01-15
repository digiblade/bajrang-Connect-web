import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 bg-orange-50 border-t border-orange-200">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-gray-700">
        <p className="font-medium">
          © {new Date().getFullYear()} Bajrang Parivaar 🚩
        </p>

        <div className="mt-2 flex justify-center gap-4">
          <Link href="/privacy-policy" className="hover:text-orange-600">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-orange-600">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}
