import React from 'react';
import { useRouter } from 'next/router';
import Container from '../../components/container';
import { pretty } from '../../lib/format';

const itemsByName = require('../../lib/itemsByName.json');

const Session = () => {
  const {
    query: { name },
  } = useRouter();

  if (name) {
    const prettyName = pretty(name);
    const imgSrc = itemsByName[prettyName]?.icon;

    const icon = imgSrc ? (
      <img src={`data:image/png;base64,${imgSrc}`} />
    ) : null;

    return (
      <Container>
        <div className="stat">
          <h2>
            {icon} {prettyName}
          </h2>
        </div>
      </Container>
    );
  }

  return null;
};

export default Session;
