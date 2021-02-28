const SOUNDCLOUD = {
  music_disc_11:
    'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/140308101',
  music_disc_13:
    'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/140308102',
  music_disc_blocks:
    'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/140308103',
  music_disc_cat:
    'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/140308104',
  music_disc_chirp:
    'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/140308105',
  music_disc_far:
    'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/140308109',
  music_disc_mall:
    'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/140308114',
  music_disc_mellohi:
    'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/140308115',
  music_disc_stal:
    'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/140308119',
  music_disc_strad:
    'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/140308120',
  music_disc_ward:
    'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/140308123',
  music_disc_wait:
    'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/140308125',
}

export const Disc = ({ stat = '' }) => {
  const url = SOUNDCLOUD[stat]

  if (!url) return null

  return (
    <div
      style={{
        display: 'inline-block',
        position: 'relative',
        height: '16px',
        margin: '0 8px 0 3px',
        width: '16px',
        borderRadius: '100%',
        // border: '1px solid red',
        boxSizing: 'content-box',
        overflow: 'hidden',
        lineHeight: '36px',
        top: '2px',
      }}
    >
      <iframe
        style={{
          position: 'absolute',
          transform: 'scale(.42)',
          left: '-34px',
          top: '-34px',
        }}
        width="100"
        height="100"
        scrolling="no"
        frameborder="no"
        allow="autoplay"
        src={`${url}&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`}
      ></iframe>
    </div>
  )
}
