import React from 'react';
import Container from 'components/container';
import NewStats from 'components/new-stats';
import { SESSIONS } from 'lib/constants';
import Link from 'next/link';

const Adventure = () => {
  return (
    <Container isPadded={false}>
      <h1 style={{ padding: '0 10px' }}>Adventure Log</h1>

      {SESSIONS.slice(0, SESSIONS.length - 1).map((date) => {
        const dateString = new Date(`${date}T12:00:00-05:00`).toDateString();

        return (
          <article key={date} className="log-entry">
            <h3>{dateString}</h3>

            <Link href={`/stats?date=${date}`}>
              <a>Stats</a>
            </Link>

            {date && <NewStats date={date} />}
          </article>
        );
      })}
    </Container>
  );
};

export default Adventure;
