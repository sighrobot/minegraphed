module.exports = {
  PLAYER_IDS: {
    CalebCoolest: '0fa87154-f7ad-4810-a4e3-85eda879d4ef',
    idovingx: '1e84adf7-b91a-4000-a5dd-fd847d910265',
    sighrobot: '036a0489-aad6-4c44-9a5e-31b7ba41d490',
  },

  PLAYER_COLORS: ['red', 'cornflowerblue', 'yellow'],

  SESSIONS: {
    s1: [
      '2023-04-21',
      '2022-02-26',
      '2022-01-29',
      '2021-05-30',
      '2021-05-15',
      '2021-05-03',
      '2021-05-02',
      '2021-04-25',
      '2021-04-24',
      '2021-04-04',
      '2021-03-27',
      '2021-02-27',
      '2021-02-06',
      '2021-01-30',
      '2021-01-23',
      '2021-01-16',
      '2021-01-09',
      '2021-01-02',
      '2020-12-25',
    ],
    s2: [
      '2024-01-20',
      '2024-01-01',
      '2023-11-13',
      '2023-10-21',
      '2023-10-08',
      '2023-10-01',
      '2023-09-30', // fake date to make diffing work
    ],
  },

  // a tick is 1/20 of a second
  TICK_STATS: [
    'sneak_time',
    'time_since_death',
    'time_since_rest',
    'play_time',
    'total_world_time',
  ],
}
