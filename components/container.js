import Link from "next/link";
import Sessions from "../components/sessions";

const Container = ({ children }) => {
  return (
    <main>
      <header>
        <Link href="/">
          <a>Home</a>
        </Link>{" "}
        | <Sessions />
      </header>

      {children}
    </main>
  );
};

export default Container;
