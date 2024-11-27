import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { cn } from "@/lib/utils";

import Nav, { NavLink } from "../../components/general/Nav";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Ecommerce MVP",
  description: "Minimum viable product for ecommerce site",
};

export default function CustomerFacingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const links: {
    text: string;
    href: string;
  }[] = [
    {
      text: "Home",
      href: "/",
    },
    {
      text: "Products",
      href: "/products",
    },
    {
      text: "My Orders",
      href: "/orders",
    },
  ];
  return (
    <html lang="en">
      <body className={cn("antialiased bg-background min-h-screen font-sans")}>
        <Nav>
          {links.map(({ text, href }) => (
            <NavLink key={text} href={href}>
              {text}
            </NavLink>
          ))}
        </Nav>
        <div className="container my-6 px-6">{children}</div>
      </body>
    </html>
  );
}
