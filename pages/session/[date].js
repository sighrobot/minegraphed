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
    return (
      <Container isPadded={false}>
        <Stats date={date} />
      </Container>
    );
  }

  return null;
};

export default Session;
