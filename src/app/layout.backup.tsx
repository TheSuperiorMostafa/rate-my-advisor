import { Providers } from "./providers";
import { AuthButton } from "@/components/auth/AuthButton";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata = {
  title: "Rate My Advisor - Find the Best Academic Advisors",
  description: "Read and write reviews of academic advisors. Find the best advisors for your academic journey.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <header className="border-b bg-white">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <a href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
                Rate My Advisor
              </a>
              <AuthButton />
            </div>
          </header>
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

