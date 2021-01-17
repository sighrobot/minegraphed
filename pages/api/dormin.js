import nacl from "tweetnacl";
import AsciiTable from "ascii-table";

// Your public key can be found on your application in the Developer Portal
const PUBLIC_KEY = process.env.DORMIN;

const { PLAYER_IDS, LATEST } = require("../../lib/constants");

const latest = {};

latest.caleb = require(`../../stats/${LATEST}/${PLAYER_IDS.caleb}.json`);
latest.jesse = require(`../../stats/${LATEST}/${PLAYER_IDS.jesse}.json`);
latest.abe = require(`../../stats/${LATEST}/${PLAYER_IDS.abe}.json`);

const clean = (player, stats) => {
  const cleaned = {};

  const typeKeys = Object.keys(stats);

  typeKeys.forEach((typeKey) => {
    const type = typeKey.replace("minecraft:", "");
    const statsForType = stats[typeKey];
    const statKeys = Object.keys(statsForType);

    statKeys.forEach((statKey) => {
      const stat = statKey.replace("minecraft:", "");
      const key = `${player}.${type}.${stat}`;
      const value = statsForType[statKey];

      cleaned[key] = value;
    });
  });

  return cleaned;
};

let cleaned = {};

Object.keys(latest).forEach((p) => {
  cleaned = { ...cleaned, ...clean(p, latest[p].stats) };
});

export default async (req, res, next) => {
  const signature = req.headers["x-signature-ed25519"] || "";
  const timestamp = req.headers["x-signature-timestamp"] || "";
  const body = JSON.stringify(req.body); // rawBody is expected to be a string, not raw bytes

  if (req.headers.host !== "localhost:3000") {
    let isVerified = false;

    try {
      isVerified = nacl.sign.detached.verify(
        Buffer.from(timestamp + body),
        Buffer.from(signature, "hex"),
        Buffer.from(PUBLIC_KEY, "hex")
      );
    } catch {
      return res.status(401).end("invalid request signature");
    }

    if (!isVerified) {
      return res.status(401).end("invalid request signature");
    }
  }

  if (req.body.type === 1) {
    res.status(200).json({ type: 1 });
  } else if (req.body.type === 2) {
    const data = req.body.data;
    const query = data.options[0].value;

    const matches = Object.keys(cleaned).filter((k) => k.includes(query));
    const matchesByStat = {};

    matches.forEach((match) => {
      const split = match.split(".");
      const p = split[0];
      const t = split[1];
      const s = split[2];

      if (matchesByStat[s]) {
        if (matchesByStat[s][t]) {
          matchesByStat[s][t].push({ p, value: cleaned[match] });
        } else {
          matchesByStat[s][t] = [{ p, value: cleaned[match] }];
        }
      } else {
        matchesByStat[s] = { [t]: [{ p, value: cleaned[match] }] };
      }
    });

    console.log(matchesByStat);

    const matchKeys = Object.keys(matchesByStat);

    const noun = matchKeys.length === 1 ? "stat" : "stats";

    const description =
      matchKeys.length > 25
        ? `I found ${matchKeys.length} ${noun} matching \`${query}\` but can only display the first 25. Try narrowing your search!`
        : `I found ${matchKeys.length.toLocaleString()} ${noun} matching \`${query}\`.`;

    res.json({
      type: 4,
      data: {
        embeds: [
          {
            description,
            fields: matchKeys
              .slice(0, 25)
              .sort((a, b) => (a > b ? 1 : -1))
              .map((k) => {
                const table = new AsciiTable();
                table.removeBorder();
                table.setHeading("", "C", "J", "A");
                table.setAlign(1, AsciiTable.RIGHT);
                table.setAlign(2, AsciiTable.RIGHT);
                table.setAlign(3, AsciiTable.RIGHT);
                table.setHeadingAlign(AsciiTable.RIGHT);
                // table.setHeadingAlign(2, AsciiTable.RIGHT)
                // table.setHeadingAlign(3, AsciiTable.RIGHT)

                Object.keys(matchesByStat[k])
                  .sort((a, b) => (a > b ? 1 : -1))
                  .map((d) => {
                    table.addRow(
                      d,

                      (
                        matchesByStat[k][d].filter(
                          (f) => f.p === "caleb"
                        )[0] || {
                          value: "-",
                        }
                      ).value.toLocaleString(),
                      (
                        matchesByStat[k][d].filter(
                          (f) => f.p === "jesse"
                        )[0] || {
                          value: "-",
                        }
                      ).value.toLocaleString(),
                      (
                        matchesByStat[k][d].filter((f) => f.p === "abe")[0] || {
                          value: "-",
                        }
                      ).value.toLocaleString()
                    );
                  });

                console.log(table.toString());

                // const max = Math.max(...matchesByStat[k].map(d => d.value));

                const playerString = (d) =>
                  max === d.value ? `**${d.p}**` : d.p;
                const valueString = (d) =>
                  max === d.value
                    ? `**\`${d.value.toLocaleString()}\`**`
                    : `\`${d.value.toLocaleString()}\``;

                const embedFieldValue = `\`\`\`${table.toString()}\n \`\`\``;

                return { name: k, value: embedFieldValue };
              }),
          },
        ],
      },
    });
  } else {
    res.json({});
  }
};
