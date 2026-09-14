import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Save The Beach SL | Hands in the sand, hope in the future",
  description: "A Sierra Leonean community protecting the coast, one cleanup at a time.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
