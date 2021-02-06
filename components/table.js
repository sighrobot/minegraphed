import Link from 'next/link'
import React from 'react'

import { getImgSrc } from 'lib/items'
import { pretty, formatValue, formatValueDiff } from 'lib/format'
import { PLAYER_IDS } from 'lib/constants'

const Style = () => {
  return (
    <style>{`
            table {
              font-size: 14px;
                width: 100%;
                border-collapse: collapse;
            }

            tbody tr:not(.heading):nth-child(2n+1) {
                background: rgba(0, 0, 0, 0.025);
            }

            th, td {
                padding: 10px;
            }

            td:first-child {
              padding: 0;
              padding-left: 5px;
            }

            td + th {
              padding-left: 5px;
            }

            td:first-child img {
              height: 20px;
              width: 20px;
            }

            td {
                text-align: right;
            }

            .heading th:nth-child(3),
            .heading th:nth-child(4),
            .heading th:nth-child(5) {
                text-align: right;
            }

            tr:not(.heading):hover {
                background: rgba(255, 255, 0, 0.1) !important;
            }

            th {
                text-align: left;
            }

            th button {
              background: none;
              border: none;
              font-family: inherit;
              text-decoration: underline;
              outline: 0;
              cursor: pointer;
              position: relative;
              width: 100%;
            }

            th button.asc:after {
              position: absolute;
              content: '\\25B2';
              z-index:1;
            }

            th button.desc:after {
              position: absolute;
              content: '\\25BC';
              z-index:1;
            }

            td {
                width: 1px;
                white-space: nowrap;
                padding: 5px 10px;
            }

            .heading {
                background: lightgray;
                padding: 10px 5px;
            }

            .subheading {
                background: rgba(0, 0, 0, 0.2);
            }

            .max {
                background: rgba(0, 255, 0, 0.1);
            }

        `}</style>
  )
}

const PlayerName = ({ children, handleSort, sort, sortDir }) => {
  const onSort = (e) =>
    handleSort(
      sort !== children || sortDir === 'desc' ? e.target.name : '',
      sort !== children ? 'desc' : 'asc',
    )

  const className = sort === children ? sortDir : undefined

  return (
    <th style={{ maxWidth: 0, width: '16.7%' }}>
      <button onClick={onSort} name={children} className={className}>
        <div
          style={{
            textAlign: 'center',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {children}
        </div>
      </button>
    </th>
  )
}

const statsFunc = (stat, playerNames, stats, type, isDiff) => {
  const normal = playerNames.map((p) => stats[type][stat][p] ?? 0)
  const max = Math.max(...normal)

  const prettyName = pretty(stat)
  const imgSrc = getImgSrc(prettyName)
  const icon = imgSrc && <img src={imgSrc} />

  return (
    <tr key={stat}>
      <td>{icon}</td>
      <th>
        <Link href={`/stats?stat=${stat}`}>
          <a>{prettyName}</a>
        </Link>
      </th>

      {playerNames.map((p) => {
        return (
          <td className={stats[type][stat][p] === max ? 'max' : ''} key={p}>
            {(isDiff ? formatValueDiff : formatValue)(
              stat,
              stats[type][stat][p],
            )}
          </td>
        )
      })}
    </tr>
  )
}

export const Table = ({
  type: typeFilter,
  stats,
  statTypes,
  value,
  currStat,
  isDiff = false,
  sort,
  handleSort,
  sortDir,
}) => {
  const playerKeys = Object.keys(PLAYER_IDS)
  const playerNames = playerKeys.map((p) => {
    return (
      <PlayerName key={p} handleSort={handleSort} sort={sort} sortDir={sortDir}>
        {p}
      </PlayerName>
    )
  })

  const filteredStatTypes = statTypes
    .sort((a, b) => (a > b ? 1 : -1))
    .filter(
      (t) =>
        typeFilter === t ||
        (typeFilter === 'all' && (!currStat || stats[t][currStat])),
    )

  const table = (
    <table className="table">
      <tbody>
        {filteredStatTypes.map((type) => {
          const statTypeKeys = Object.keys(stats[type])
          const filteredStatTypeKeys = statTypeKeys
            .sort((a, b) => (a > b ? 1 : -1))
            .sort((a, b) =>
              !sort ||
              (sortDir === 'desc'
                ? (stats[type][a][sort] ?? 0) < (stats[type][b][sort] ?? 0)
                : (stats[type][a][sort] ?? 0) > (stats[type][b][sort] ?? 0))
                ? 1
                : -1,
            )
            .filter(
              (stat) =>
                stat.indexOf(value.toLowerCase()) !== -1 ||
                pretty(stat).indexOf(value.toLowerCase()) !== -1,
            )
            .filter((stat) => !currStat || currStat === stat)

          return (
            <>
              {filteredStatTypeKeys.length > 0 ? (
                <tr className="heading">
                  <th colSpan={2}>
                    {typeFilter === 'all' ? pretty(type) : ''}
                  </th>

                  {playerNames}
                </tr>
              ) : null}
              {filteredStatTypeKeys.map((stat) =>
                statsFunc(stat, playerKeys, stats, type, isDiff),
              )}
            </>
          )
        })}
      </tbody>
    </table>
  )

  return (
    <>
      <Style />

      {table}
    </>
  )
}

export default Table
