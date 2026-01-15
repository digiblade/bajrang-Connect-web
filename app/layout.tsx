import Navbar from "@/components/navbar";
import "./globals.css";
import Footer from "@/components/footer";

export const metadata = {
  title: "Bajrang Parivaar",
  description: "A digital platform for united Bajrangi community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />

        {children}
        <Footer />
      </body>
    </html>
  );
}
