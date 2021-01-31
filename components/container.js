import Link from "next/link";
import { useRouter } from "next/router";

const Container = ({ children, isPadded = true }) => {
  const router = useRouter();
  return (
    <main>
      <header>
        <Link href="/">
          <a className={router.pathname === "/" ? "active" : ""}>
            Adventure Log
          </a>
        </Link>{" "}
        |{" "}
        <Link href="/stats">
          <a className={router.pathname === "/stats" ? "active" : ""}>
            Game Stats
          </a>
        </Link>
      </header>

      <section style={{ padding: isPadded ? "0 10px" : "0" }}>
        {children}
      </section>
    </main>
  );
};

export default Container;
