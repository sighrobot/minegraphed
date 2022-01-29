const ocean = require('digitalocean')

const minecraftId = 277589884

const client = ocean.client(process.env.DO)

export default async (req, res) => {
  const { size } = req.query
  const action = await client.droplets.resize(minecraftId, size)

  res.json({ id: action.id, status: action.status })
  // res.json({ id: 1234, status: "great" });
}
