import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Album, Track } from "@/lib/types";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  album: Album;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
  isSeed?: boolean;
  setSeedRecommendations?: (tracks: Track[]) => void;
  tracks?: Track[];
}

export function AlbumArtwork({
  setSeedRecommendations,
  tracks,
  isSeed = false,
  album,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: AlbumArtworkProps) {

  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="overflow-hidden rounded-md">
        <Image
          src={album.cover}
          alt={album.name}
          width={width}
          height={height}
          className={cn(
            "h-auto w-auto object-cover transition-all hover:scale-105",
            aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
          )}
        />
      </div>
      <div className="flex justify-between">
        <div className="space-y-1 text-sm">
          <h3 className="font-medium leading-none">{album.name}</h3>
          <p className="text-xs text-muted-foreground">{album.artist}</p>
        </div>
        {isSeed && (
          <Button variant="outline" size="icon"
            onClick={() => {
              setSeedRecommendations?.(tracks?.filter((track) => track.name !== album.name) || []);
            }}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
