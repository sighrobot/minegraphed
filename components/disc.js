export const Disc = () => {
  return (
    <div
      style={{
        display: 'inline-block',
        position: 'relative',
        height: '16px',
        width: '16px',
        borderRadius: '100%',
        // border: '1px solid red',
        boxSizing: 'content-box',
        overflow: 'hidden',
        lineHeight: '36px',
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
        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/140308103&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false"
      ></iframe>
    </div>
  )
}
