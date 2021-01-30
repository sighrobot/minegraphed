import Link from "next/link";
import Sessions from "../components/sessions";
import { useRouter } from "next/router";

const Container = ({ children, isPadded = true }) => {
  const router = useRouter();
  return (
    <main>
      <header>
        <Link href="/">
          <a className={router.pathname === "/" ? "active" : ""}>Home</a>
        </Link>{" "}
        |{" "}
        <Link href="/stats">
          <a className={router.pathname === "/stats" ? "active" : ""}>
            All-time
          </a>
        </Link>{" "}
        | <Sessions />
      </header>

      <section style={{ padding: isPadded ? "0 20px" : "" }}>
        {children}
      </section>
    </main>
  );
};

export default Container;
