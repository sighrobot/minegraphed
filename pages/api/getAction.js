const ocean = require("digitalocean");

const client = ocean.client(process.env.DO);

export default async (req, res) => {
  const { id } = req.query;
  const action = await client.droplets.getAction(198055287, id);

  res.json({ status: action.status, id });
};
