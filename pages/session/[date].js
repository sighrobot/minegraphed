import React from "react";
import { useRouter } from "next/router";
import Container from "../../components/container";
import NewStats from "../../components/new-stats";
import Stats from "../../components/statsdiff";

Stats;
const Session = () => {
  const {
    query: { date },
  } = useRouter();

  if (date) {
    const dateString = new Date(`${date}T12:00:00-05:00`).toDateString();
    return (
      <Container>
        <h2>{dateString}</h2>
        {date && <NewStats date={date} />}

        <Stats date={date} />
      </Container>
    );
  }

  return null;
};

export default Session;
