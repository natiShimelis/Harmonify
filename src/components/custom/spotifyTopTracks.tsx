import { auth } from "@/auth";
import { AlbumArtwork } from "./artwork";
import { Track } from "@/lib/types";

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

  return data as Track;
};

export const getRecommendation = async (tracks: string) => {
  const session = await auth();
  const usp = new URLSearchParams({
    limit: "20",
    market: "ES",
    seed_tracks: tracks,
  });

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
      { response }
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
  const recommendations = (await getRecommendation(
    spotifySongIds.join(",")
  )) as Track[];

  if (!recommendations) {
    return <p>Failed to fetch recommendations</p>;
  }

  console.log("images", recommendations[0].album.images[1].url);


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
