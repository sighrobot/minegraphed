import React from "react";
import { useRouter } from "next/router";
import Container from "../../components/container";
import NewStats from "../../components/new-stats";

const Session = () => {
  const {
    query: { name },
  } = useRouter();

  if (name) {
    return (
      <Container>
        <h2>{name.replace(/_/g, " ")}</h2>
      </Container>
    );
  }

  return null;
};

export default Session;
