import React from 'react';
import { buildStats } from 'lib/build-stats';
import Table from 'components/table';

const StatsDiff = ({ date, value, type, currStat }) => {
  const { stats, oldStats, players } = buildStats(date);
  const statTypes = Object.keys(stats);

  return (
    <Table
      type={type}
      stats={stats}
      statTypes={statTypes}
      oldStats={oldStats}
      players={players}
      value={value}
      currStat={currStat}
    />
  );
};

export default StatsDiff;
