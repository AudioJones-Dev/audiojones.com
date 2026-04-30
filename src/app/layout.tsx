import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/Toast";

export const metadata = {
  title: "Audio Jones",
  description: "Applied Intelligence Systems for founder-led businesses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg-0 text-fg-1 font-body antialiased">
        <ToastProvider>
          <Header />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
