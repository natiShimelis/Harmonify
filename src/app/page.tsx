"use client"; // Specifies that this file is a client-side component

import SearchForm from "@/components/custom/searchform"; // Import the SearchForm component
import TrackList from "@/components/custom/trackList"; // Import the TrackList component
import { Track } from "@/lib/types"; // Import the Track type definition
import { useQuery } from "@tanstack/react-query"; // Import useQuery hook from react-query
import { useSession } from "next-auth/react"; // Import useSession hook from next-auth
import { useEffect, useState } from "react"; // Import useEffect and useState hooks from React

export default function Home() {
  // Home component definition
  const { data: session } = useSession(); // Get session data from next-auth

  // State to store seed recommendations (initially empty array)
  const [seedRecommendations, setSeedRecommendations] = useState<Track[]>([]);
  // State to store Spotify recommendations (initially empty array)
  const [spotifyRecommendations, setSpotifyRecommendations] = useState<Track[]>(
    []
  );

  // React-query to fetch recommendations based on seed tracks
  const { refetch } = useQuery({
    enabled: !!session && seedRecommendations.length == 5, // Enable query only if session exists and there are 5 seed recommendations
    queryKey: ["recommendations"], // Query key for caching
    refetchOnReconnect: true, // Refetch data when reconnecting
    queryFn: async () => {
      // Query function to fetch recommendations from Spotify API
      const usp = new URLSearchParams({
        limit: "20", // Limit results to 20 tracks
        market: "ES", // Market set to Spain (ES)
        seed_tracks: seedRecommendations.map((track) => track.id).join(","), // Join seed track IDs with comma
      });

      const response = await fetch(
        `https://api.spotify.com/v1/recommendations?${usp}`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`, // Use session's access token for authorization
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch recommendations:", { response }); // Log error if fetch fails
        return;
      }

      const data = await response.json(); // Parse response JSON

      setSpotifyRecommendations(data.tracks as Track[]); // Update state with fetched tracks

      return data.tracks as Track[]; // Return fetched tracks
    },
  });

  // Effect to refetch recommendations when seed recommendations change
  useEffect(() => {
    if (seedRecommendations.length === 5) {
      refetch(); // Refetch recommendations if there are 5 seed tracks
    } else {
      setSpotifyRecommendations([]); // Clear recommendations if less than 5 seed tracks
    }
  }, [seedRecommendations, refetch]);

  return (
    <div className="flex flex-col justify-between py-6 px-8 gap-8">
      <SearchForm
        seedRecommendations={seedRecommendations} // Pass seed recommendations state
        setSeedRecommendations={setSeedRecommendations} // Pass setter for seed recommendations
      />
      <TrackList
        isSeed
        tracks={seedRecommendations} // Pass seed recommendations to TrackList
        setSeedRecommendations={setSeedRecommendations} // Pass setter for seed recommendations
      />
      <TrackList isSeed={false} tracks={spotifyRecommendations} />
    </div> // Pass Spotify recommendations to TrackList
  );
}
