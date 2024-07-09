import type { Track } from "@/lib/types";
import { AlbumArtwork } from "./artwork";

export default function TrackList({ tracks, isSeed, setSeedRecommendations }: { tracks: Track[], isSeed?: boolean, setSeedRecommendations?: (tracks: Track[]) => void }) {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {tracks.map((track) => (
        <AlbumArtwork
          key={track.id}
          setSeedRecommendations={setSeedRecommendations}
          isSeed={isSeed}
          tracks={isSeed ? tracks : undefined}
          album={
            { name: track.name, artist: track.artists.map((artist) => artist.name).join(", "), cover: track.album.images[0].url }
          }
          aspectRatio="square"
          width={150}
          height={150}
        />
      )
      )}
    </div>
  );
}
