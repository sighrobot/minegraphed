const ocean = require('digitalocean')

const client = ocean.client(process.env.DO)

export default async (req, res) => {
  const droplets = await client.droplets.list()
  const drop = droplets.filter((d) => d.id === 277589884)[0]

  res.json({ status: drop.status, size: drop.size })
}
