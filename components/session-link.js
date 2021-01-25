import Link from "next/link";
import React from "react";

const SessionLink = ({ date, latest }) => {
  const dateString = new Date(`${date}T12:00:00-05:00`)
    .toLocaleDateString()
    .split("/")
    .slice(0, 2)
    .join("/");

  return (
    <Link href={`/session/${date}`}>
      <a className={latest ? "latest" : ""}>{dateString}</a>
    </Link>
  );
};

export default SessionLink;
