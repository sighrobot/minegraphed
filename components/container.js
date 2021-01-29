import Link from "next/link";
import Sessions from "../components/sessions";

const Container = ({ children }) => {
  return (
    <main>
      <header>
        <Link href="/">
          <a className={window.location.pathname === "/" ? "active" : ""}>
            Home
          </a>
        </Link>{" "}
        |{" "}
        <Link href="/stats">
          <a className={window.location.pathname === "/stats" ? "active" : ""}>
            All-time
          </a>
        </Link>{" "}
        | <Sessions />
      </header>

      {children}
    </main>
  );
};

export default Container;
