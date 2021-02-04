import Link from "next/link";
import { getNewStats } from "../lib/getNewStats";

const itemsByName = require("../lib/itemsByName.json");

const NewStats = ({ date }) => {
  const newStats = React.useMemo(() => getNewStats(date), [date]);

  const byItem = {};

  newStats.forEach((s) => {
    const split = s.split(".");
    const type = split[0];
    const item = split[1];

    if (byItem[item]) {
      byItem[item].push(type);
    } else {
      byItem[item] = [type];
    }
  });

  const sortedByItem = Object.keys(byItem).sort((a, b) => (a > b ? 1 : -1));

  return (
    <div className="new-stats">
      <p>
        {sortedByItem.map((i) => {
          const prettyName = i.replace(/_/g, " ");
          const imgSrc = itemsByName[prettyName]?.icon;

          return (
            imgSrc && <img key={i} src={`data:image/png;base64,${imgSrc}`} />
          );
        })}
      </p>

      <details>
        <summary>Details</summary>
        <ul>
          {sortedByItem.map((i) => {
            const prettyName = i.replace(/_/g, " ");
            const imgSrc = itemsByName[prettyName]?.icon;

            return (
              <li key={i}>
                {imgSrc && <img src={`data:image/png;base64,${imgSrc}`} />}
                <Link href={`/stats?stat=${i}&date=${date}`}>
                  <a>{prettyName}</a>
                </Link>{" "}
                {byItem[i]
                  .sort((a, b) => (a > b ? 1 : -1))
                  .map((s) => s.replace(/[._]/g, " "))
                  .join(", ")}
              </li>
            );
          })}
        </ul>
      </details>
    </div>
  );
};

export default NewStats;
