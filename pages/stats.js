import React from 'react';
import Container from '../components/container';
import Seg from '../components/seg';
import DateFilter from '../components/date-filter';
import { useRouter } from 'next/router';

import Table from '../components/table';
import StatsDiff from '../components/statsdiff';
import { buildStats } from '../lib/build-stats';
import { getImgSrc } from '../lib/items';
const { SESSIONS } = require('../lib/constants');

const Stats = () => {
  const router = useRouter();
  const { stats, players } = buildStats(SESSIONS[0]);
  const [value, setValue] = React.useState('');
  const statTypes = Object.keys(stats);
  const handleChange = (e) => setValue(e.target.value);
  const [type, setType] = React.useState('all');
  const handleSelectStatType = (e) => setType(e.target.name);
  const [date, setDate] = React.useState(router.query.date ?? 'all');
  const [stat, setStat] = React.useState(router.query.stat ?? '');

  React.useEffect(() => {
    let path = '/stats?';

    if (date !== 'all') {
      path += `&date=${date}`;
    }

    if (stat) {
      path += `&stat=${stat}`;
    }

    router.replace(path);
  }, [date, stat]);

  React.useEffect(() => {
    if (router.query.date) {
      setDate(router.query.date);
    }

    if (router.query.stat) {
      setStat(router.query.stat);
    }
  }, [router.query.date, router.query.stat]);

  const prettyStat = stat.replace(/_/g, ' ');

  const handleRemoveStat = () => {
    setStat('');
  };

  const imgSrc = getImgSrc(prettyStat);

  return (
    <Container isPadded={false}>
      <div className="sticky">
        <input
          type="search"
          value={value}
          placeholder="Search stats"
          onChange={handleChange}
        />

        <div className="inputs">
          <DateFilter date={date} onChange={setDate} />

          {stat && (
            <button className="stat-token" onClick={handleRemoveStat}>
              <div>
                {imgSrc && <img src={imgSrc} />}
                {prettyStat}
              </div>
            </button>
          )}
        </div>

        <Seg
          stats={stats}
          type={type}
          statTypes={statTypes}
          onChange={handleSelectStatType}
        />
      </div>

      {date === 'all' ? (
        <Table
          type={type}
          players={players}
          statTypes={statTypes}
          stats={stats}
          value={value}
          currStat={stat}
        />
      ) : (
        <StatsDiff value={value} date={date} type={type} currStat={stat} />
      )}
    </Container>
  );
};

export default Stats;
