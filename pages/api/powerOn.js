const ocean = require('digitalocean')

const downsize = 's-1vcpu-1gb'
const upsize = 'm-2vcpu-16gb'
const minecraftId = 277589884

const client = ocean.client(process.env.DO)

export default async (req, res) => {
  const action = await client.droplets.powerOn(minecraftId)

  res.json({ id: action.id, status: action.status })
  //   res.json({ id: 4567, status: "super" });
}
