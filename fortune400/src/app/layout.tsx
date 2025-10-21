// layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/app/components/NavBar";
import Footer from "./components/footer";
import Header from "./components/header";
import { UserProvider } from "./context/UserContext";
import { Analytics } from "@vercel/analytics/next"


export const metadata: Metadata = {
  title: "fortune 400",
  description: "A modern banking web application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
        <body className="min-h-screen">
          <UserProvider>
          <Header />
          <NavBar />
          <main className="flex-grow">{children}</main>
          <Footer />
          </UserProvider>
          <Analytics />
        </body>

    </html>
  );
}
