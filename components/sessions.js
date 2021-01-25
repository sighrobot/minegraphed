import React from "react";
import SessionLink from "../components/session-link";

const { SESSIONS } = require("../lib/constants");

const Sessions = () => {
  const reversed = SESSIONS.slice().reverse();

  return (
    <menu className="sessions">
      {reversed.slice(1).map((d, idx) => (
        <SessionLink key={d} date={d} latest={idx === SESSIONS.length - 1} />
      ))}
    </menu>
  );
};

export default Sessions;
