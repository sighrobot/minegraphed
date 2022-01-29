import React from 'react'
import request from 'superagent'

const downsize = 's-1vcpu-1gb'
const upsize = 'g-8vcpu-32gb'

const ms = 5000

async function poll(fn, fnCondition, appendMsg = () => {}) {
  let result = await fn()
  while (!fnCondition(result)) {
    await wait(appendMsg)
    result = await fn()
  }
  return result
}

function wait(appendMsg) {
  return new Promise((resolve) => {
    appendMsg('\n.')
    setTimeout(resolve, ms)
  })
}

export default () => {
  const [text, setText] = React.useState('')
  const [currentSize, setCurrentSize] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    ;(async () => {
      const { body: droplet } = await request('/api/getDrop')

      setCurrentSize(droplet.size.slug)
    })()
  }, [])

  const handleResize = async (size) => {
    setLoading(true)
    const { body: droplet } = await request('/api/getDrop')

    setText(
      (t) =>
        (t += `\nDroplet ${droplet.status} with size ${droplet.size.slug}`),
    )

    const { body: action } = await request(`/api/resize?size=${size}`)

    setText((t) => (t += `\n\nResizing ${action.status}...`))

    const pollResize = () => request(`/api/getAction?id=${action.id}`)
    const pollResizeCondx = ({ body: a }) => a.status === 'completed'

    const { body: resizeAction } = await poll(
      pollResize,
      pollResizeCondx,
      (dot) => setText((t) => (t += dot)),
    )

    setText((t) => (t += `\n\nResize ${resizeAction.status}.`))

    setText((t) => (t += `\n\nPowering back on...`))

    await request(`/api/powerOn`)

    const pollPower = () => request('/api/getDrop')
    const pollPowerCondx = ({ body: d }) => d.status === 'active'

    const { body: power } = await poll(pollPower, pollPowerCondx, (dot) =>
      setText((t) => (t += dot)),
    )

    setText(
      (t) =>
        (t += `\n\nDroplet ${power.status} with size ${power.size.slug}.\n\n`),
    )

    setCurrentSize(power.size.slug)
    setLoading(false)
  }

  return (
    <div>
      <aside>
        {!currentSize
          ? 'Loading...'
          : loading
          ? 'Scaling in progress...'
          : currentSize === upsize
          ? "Ready to play! Don't forget to scale down when you're done."
          : 'Want to play MC? Scale up before you join the server!'}
      </aside>
      <menu>
        <button
          onClick={(e) => {
            e.preventDefault()
            handleResize(upsize)
          }}
          disabled={loading || currentSize !== downsize}
        >
          {'▶'} Scale up
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            handleResize(downsize)
          }}
          disabled={loading || currentSize !== upsize}
        >
          {'■'} Scale down
        </button>
      </menu>
      <textarea spellCheck={false} readOnly value={text} />
      <style>{`
        * { box-sizing: border-box; }

        html, body { margin: 0;}

        body { background: #16161d; padding: 10px; height: 100vh; }

        aside {
          color: yellow;
          font-family: monospace;
          font-size: 16px;
          padding: 10px 0 20px 0;
          margin: 0;
        }

        div {
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        menu {
            margin: 0;
            padding: 0;
            margin-bottom: 10px;
        }

        button {
          cursor: pointer;
            background:limegreen;
            border: none;
            font-family: monospace;
            font-size: 14px;
            padding: 10px;
            margin-right: 10px;
            color: #16161d;
        }

        button + button {
            background: royalblue;
        }

        button[disabled] {
            cursor: not-allowed;
            color: #16161d;
            opacity: 0.25;
        }

        textarea {
            border-radius: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            border: 1px solid white;
            padding: 10px;
            resize: none;
            font-size: 14px;
            font-family: monospace;
            color: white;
        }
    `}</style>
    </div>
  )
}
