import { Inter } from "next/font/google";
import "./globals.css";
import MacDesktopProvider from "./components/MacDesktopProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Aero-Controllers: Cinematic",
  description: "Next.js cinematic 3D drone experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased mac-mode`} suppressHydrationWarning>
        <MacDesktopProvider>{children}</MacDesktopProvider>
      </body>
    </html>
  );
}
