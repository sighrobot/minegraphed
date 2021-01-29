import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

const SessionLink = ({ date, latest }) => {
  const router = useRouter();
  const dateString = new Date(`${date}T12:00:00-05:00`)
    .toLocaleDateString()
    .split("/")
    .slice(0, 2)
    .join("/");

  return (
    <Link href={`/session/${date}`}>
      <a className={router.pathname.indexOf(date) !== -1 ? "active" : ""}>
        {dateString}
      </a>
    </Link>
  );
};

export default SessionLink;
