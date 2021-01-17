import { Rcon } from "rcon-client";

export default async (req, res) => {
  const rcon = await Rcon.connect({
    host: "165.227.114.67",
    port: 25575,
    password: "foobar",
  });

  const r = {};

  r.list = await rcon.send("list");
  r.help = await rcon.send("help");
  r.whitelist_list = await rcon.send("whitelist list");

  // let responses = await Promise.all([
  //     rcon.send("help"),
  //     rcon.send("whitelist list")
  // ])

  // for (let response of responses) {
  //     console.log(response)
  // }

  rcon.end();
  res.json(r);
};
