export interface Track {
  name: string;
  album: {
    images: { url: string }[];
  };
  artists: { name: string }[];
  id: string;
  external_urls: { spotify: string };
}

export interface Album {
  name: string;
  artist: string;
  cover: string;
}

// The Spotify API returns a lot of data, but we only need a few fields. This is why we define a Track type that only includes the fields we need. This way, we can keep our code clean and easy to read.
/*
    {
    album: {
      album_type: 'ALBUM',
      artists: [Array],
      external_urls: [Object],
      href: 'https://api.spotify.com/v1/albums/1nAQbHeOWTfQzbOoFrvndW',
      id: '1nAQbHeOWTfQzbOoFrvndW',
      images: [Array],
      is_playable: true,
      name: 'Planet Her',
      release_date: '2021-06-25',
      release_date_precision: 'day',
      total_tracks: 14,
      type: 'album',
      uri: 'spotify:album:1nAQbHeOWTfQzbOoFrvndW'
    },
    artists: [ [Object], [Object] ],
    disc_number: 1,
    duration_ms: 188893,
    explicit: true,
    external_ids: { isrc: 'USRC12101536' },
    external_urls: {
      spotify: 'https://open.spotify.com/track/0FFsgUoFibYISzMxuGS61W'
    },
    href: 'https://api.spotify.com/v1/tracks/0FFsgUoFibYISzMxuGS61W',
    id: '0FFsgUoFibYISzMxuGS61W',
    is_local: false,
    is_playable: true,
    name: "I Don't Do Drugs (feat. Ariana Grande)",
    popularity: 63,
    preview_url: 'https://p.scdn.co/mp3-preview/0d54656b8b393e233cf52d897e1d76475b30a98e?cid=9c603cc80e6749bbb8889aae26e4b12b',
    track_number: 6,
    type: 'track',
    uri: 'spotify:track:0FFsgUoFibYISzMxuGS61W'
  }
  */
