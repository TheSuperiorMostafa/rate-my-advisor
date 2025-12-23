// Example root layout - replace your existing layout.tsx with this structure

import { Providers } from "./providers";
import { AuthButton } from "@/components/auth/AuthButton";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-xl font-bold">Rate My Advisor</h1>
              <AuthButton />
            </div>
          </header>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}


