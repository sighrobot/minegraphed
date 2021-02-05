import React from 'react';
import { pretty } from '../lib/format';

const Seg = ({ type, onChange, statTypes, stats }) => {
  return (
    <div className="seg">
      <button
        name="all"
        className={type === 'all' ? 'active' : ''}
        onClick={onChange}
      >
        all
      </button>

      {statTypes
        .sort((a, b) => (a > b ? 1 : -1))
        .map((t) => {
          // const num = Object.keys(stats[t]).length;
          return (
            <button
              key={t}
              className={type === t ? 'active' : ''}
              name={t}
              onClick={onChange}
            >
              {pretty(t)}
              {/* <sup>{num}</sup> */}
            </button>
          );
        })}
    </div>
  );
};

export default Seg;
