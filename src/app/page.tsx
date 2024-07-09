"use client"

import SearchForm from "@/components/custom/searchform";
import TrackList from "@/components/custom/trackList";
import { Track } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession();

  const [seedRecommendations, setSeedRecommendations] = useState<Track[]>([])
  const [spotifyRecommendations, setSpotifyRecommendations] = useState<Track[]>([])

  const { refetch } = useQuery({
    enabled: !!session && seedRecommendations.length == 5,
    queryKey: ["recommendations"],
    refetchOnReconnect: true,
    queryFn: async () => {
      const usp = new URLSearchParams({
        limit: "20",
        market: "ES",
        seed_tracks: seedRecommendations.map((track) => track.id).join(",")
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

      setSpotifyRecommendations(data.tracks as Track[])

      return data.tracks as Track[];
    },
  });

  useEffect(() => {
    if (seedRecommendations.length === 5) {
      refetch()
    } else {
      setSpotifyRecommendations([])
    }
  }, [seedRecommendations])

  return (
    <div className="flex flex-col justify-between py-6 px-8 gap-8">
      <SearchForm seedRecommendations={seedRecommendations} setSeedRecommendations={setSeedRecommendations} />
      <TrackList isSeed tracks={seedRecommendations} setSeedRecommendations={setSeedRecommendations} />
      <TrackList isSeed={false} tracks={spotifyRecommendations} />
    </div>
  );
}
