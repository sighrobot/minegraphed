import React from 'react'
import Container from 'components/container'
import Link from 'next/link'
import Head from 'next/head'

const Home = () => {
  return (
    <Container hideHeader isPadded={false}>
      <Head>
        <title>Adventure Log - JCA-MC</title>
      </Head>

      <h1 style={{ padding: '0 10px' }}>Adventure Log</h1>

      <ul>
        <li>
          <Link href="/s1">
            <a>Season 1</a>
          </Link>
        </li>
        <li>
          <Link href="/s2">
            <a>Season 2</a>
          </Link>
        </li>
      </ul>
    </Container>
  )
}

export default Home
