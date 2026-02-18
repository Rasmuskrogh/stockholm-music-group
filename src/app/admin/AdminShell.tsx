"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import g from "./AdminGlobal.module.css";
import layoutStyles from "./AdminLayout.module.css";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <div className={g.adminLayout}>{children}</div>;
  }

  return (
    <div className={g.adminLayout}>
      <div className={layoutStyles.wrapper}>
        <aside className={layoutStyles.aside}>
          <h2 className={layoutStyles.asideTitle}>Admin</h2>
          <p className={layoutStyles.asideEmail}>{session?.user?.email}</p>
          <nav className={layoutStyles.nav}>
            <Link href="/admin" className={layoutStyles.navLink}>Översikt</Link>
            <Link href="/admin/hero" className={layoutStyles.navLink}>Hero & bakgrund</Link>
            <Link href="/admin/content" className={layoutStyles.navLink}>Texter</Link>
            <Link href="/admin/wedding" className={layoutStyles.navLink}>Innehållssektion</Link>
            <Link href="/admin/media" className={layoutStyles.navLink}>Media (videor)</Link>
            <Link href="/admin/gallery" className={layoutStyles.navLink}>Galleri</Link>
          </nav>
          <Link href="/" className={layoutStyles.siteLink}>Till sidan →</Link>
          <button type="button" onClick={() => signOut({ callbackUrl: "/admin/login" })} className={layoutStyles.signOut}>
            Logga ut
          </button>
        </aside>
        <main className={layoutStyles.main}>{children}</main>
      </div>
    </div>
  );
}
