import React from "react";
import Container from "../components/container";
import Seg from "../components/seg";
import DateFilter from "../components/date-filter";

import Table from "../components/table";
import StatsDiff from "../components/statsdiff";
import { buildStats } from "../lib/build-stats";
const { SESSIONS } = require("../lib/constants");

const Stats = () => {
  const { stats, players } = buildStats(SESSIONS[0]);
  const [value, setValue] = React.useState("");
  const statTypes = Object.keys(stats);
  const handleChange = (e) => setValue(e.target.value);
  const [type, setType] = React.useState("all");
  const handleSelectStatType = (e) => setType(e.target.name);
  const [date, setDate] = React.useState("all");

  return (
    <Container isPadded={false}>
      <div className="sticky">
        <div className="inputs">
          <DateFilter date={date} onChange={setDate} />

          <input
            type="search"
            value={value}
            placeholder="Search stats"
            onChange={handleChange}
          />
        </div>
        <Seg
          stats={stats}
          type={type}
          statTypes={statTypes}
          onChange={handleSelectStatType}
        />
      </div>

      {date === "all" ? (
        <Table
          type={type}
          players={players}
          statTypes={statTypes}
          stats={stats}
          value={value}
        />
      ) : (
        <StatsDiff value={value} date={date} type={type} />
      )}
    </Container>
  );
};

export default Stats;
