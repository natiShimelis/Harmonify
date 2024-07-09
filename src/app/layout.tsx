import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/custom/header";
import Providers from "@/components/custom/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Harmonify | The best way to interact with your music.",
  description: "Harmonify integrates with spotify to provide you with the best music experience. Get recommendations based on your current listening songs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen")}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
