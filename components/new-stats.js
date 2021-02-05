import Link from 'next/link';
import { pretty } from 'lib/format';
import { getNewStats } from 'lib/getNewStats';
import { getImgSrc } from 'lib/items';

const NewStats = ({ date }) => {
  const newStats = React.useMemo(() => getNewStats(date), [date]);

  const byItem = {};

  newStats.forEach((s) => {
    const split = s.split('.');
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
          const prettyName = pretty(i);
          const imgSrc = getImgSrc(prettyName);

          return imgSrc && <img key={i} src={imgSrc} />;
        })}
      </p>

      <details>
        <summary>Details</summary>
        <ul>
          {sortedByItem.map((i) => {
            const prettyName = pretty(i);
            const imgSrc = getImgSrc(prettyName);

            return (
              <li key={i}>
                {imgSrc && <img src={imgSrc} />}
                <Link href={`/stats?stat=${i}&date=${date}`}>
                  <a>{prettyName}</a>
                </Link>{' '}
                {byItem[i]
                  .sort((a, b) => (a > b ? 1 : -1))
                  .map(pretty)
                  .join(', ')}
              </li>
            );
          })}
        </ul>
      </details>
    </div>
  );
};

export default NewStats;
