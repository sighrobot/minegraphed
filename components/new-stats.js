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

  return (
    <details open>
      <summary>
        <h3>What's new?</h3>
      </summary>

      <div className="new-stats">
        <ul>
          {Object.keys(byItem)
            .sort((a, b) => (a > b ? 1 : -1))
            .map((i) => {
              const prettyName = i.replace(/_/g, " ");
              const imgSrc = itemsByName[prettyName]?.icon;

              return (
                <li key={i}>
                  {imgSrc && <img src={`data:image/png;base64,${imgSrc}`} />}
                  <Link href={`/stat/${i}`}>
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
      </div>
    </details>
  );
};

export default NewStats;
