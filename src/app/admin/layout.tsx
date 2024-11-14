import Nav, { NavLink } from "../components/Nav";

export const dynamic = "force-dynamic"; // force NextJS to avoid caching every admin page

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const links: {
    text: string;
    href: string;
  }[] = [
    {
      text: "Dashboard",
      href: "/admin",
    },
    {
      text: "Products",
      href: "/admin/products",
    },
    {
      text: "Customers",
      href: "/admin/users",
    },
    {
      text: "Sales",
      href: "/admin/orders",
    },
  ];
  return (
    <>
      <Nav>
        {links.map(({ text, href }) => (
          <NavLink key={text} href={href}>
            {text}
          </NavLink>
        ))}
      </Nav>
      <div className="container my-6 px-6">{children}</div>
    </>
  );
}
