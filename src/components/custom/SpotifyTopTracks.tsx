import { auth } from "@/auth";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { AlbumArtwork } from "./artwork";
import Image from "next/image";

// Authorization token that must have been created previously. See: https://developer.spotify.com/documentation/web-api/concepts/authorization

interface Track {
  name: string;
  album: {
    images: { url: string }[];
  };
  artists: { name: string }[];
}

// async function getTopTracks() {
//   const session = await auth();

//   if (!session) {
//     return;
//   }

//   const res = await fetch(
//     "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5",
//     {
//       headers: {
//         Authorization: `Bearer ${session.accessToken}`,
//       },
//     }
//   );

//   if (!res.ok) {
//     console.error("Failed to fetch top tracks:", res.statusText);
//     return;
//   }

//   const { items } = await res.json();
//   console.log("Inside the useeffect", items);
//   return items.map((track: any) => ({
//     name: track.name,
//     artists: track.artists,
//   }));
// }

export const getSpecificTrack = async (trackId: string) => {
  const session = await auth();
  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch specific track:", response.statusText);
    return;
  }

  const data = await response.json();

  console.log("Inside the getSpecificTrack", data);

  return data as Track;
};

export const getRecommendation = async (tracks: string) => {
  console.log("Inside the getRecommendation", tracks);
  const session = await auth();
  const usp = new URLSearchParams({
    limit: "20",
    market: "ES",
    seed_tracks: tracks,
  });
  console.log(usp);

  const response = await fetch(
    `https://api.spotify.com/v1/recommendations?${usp}`,
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );

  if (!response.ok) {
    console.error(
      "Failed to fetch recommendations:",
      response.statusText,
      response.status
    );
    return;
  }

  const data = await response.json();

  console.log("Inside the getRecommendation the actual songs", data);

  return data.tracks as Track[];
};

export const spotifySongIds = [
  "5cQX9BexkPIEESTZijJhXg",
  "14kyXBpg91RVq8bNRDS1q2",
  "7gaA3wERFkFkgivjwbSvkG",
  "142PiXzA84lmEw2RstFHFa",
  "51ZQ1vr10ffzbwIjDCwqm4",
];

export default async function SpotifyTopTracks() {
  // const topTracks = (await getTopTracks()) as Track[];
  const recommendations = (await getRecommendation(
    spotifySongIds.join(",")
  )) as Track[];

  // if (!topTracks) {
  //   return <p>Failed to fetch top tracks</p>;
  // }

  if (!recommendations) {
    return <p>Failed to fetch recommendations</p>;
  }

  console.log("images", recommendations[0].album.images[1].url);

  {
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
  }

  return (
    <div>
      {/* {topTracks.length > 0 ? (
        <ul>
          {topTracks.map((track, index) => (
            <li key={index}>
              {track.name} by <pre>{JSON.stringify(track)}</pre>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )} */}
      {recommendations.length > 0 && (
        <ul>
          {recommendations.map((track, index) => (
            <li key={index}>
              <AlbumArtwork
                width={250}
                height={250}
                album={{
                  name: track.name,
                  artist: track.artists.map((artist) => artist.name).join(", "),
                  cover: track.album.images[0].url,
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
