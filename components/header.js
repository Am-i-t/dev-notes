import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/actions/authAction";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header id="main-header">
      <Link href="/">
        <Image
          src={logo}
          alt="A notes image"
          width={100}
          height={100}
          priority
        />
      </Link>
      <nav>
        <ul>
          <li>
            <Link href="/notes">Notes</Link>
          </li>
          <li>
            <Link className="cta-link" href="/new-notes">
              New Notes
            </Link>
          </li>
          <li>
            {user ? (
              <form action={logout}>
                <button type="submit" className="delete-btn">
                  Logout
                </button>
              </form>
            ) : (
              <Link className="cta-link" href="/auth?mode=login">
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
