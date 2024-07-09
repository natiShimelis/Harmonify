import { Input } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRef } from "react";
import { SearchIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Track } from "@/lib/types";

const searchSchema = z.object({
  query: z.string(),
});

export default function SearchForm(
  { seedRecommendations, setSeedRecommendations }: {
    seedRecommendations: Track[],
    setSeedRecommendations: (tracks: Track[]) => void
  }) {
  const session = useSession();

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: "",
    },
  });

  const submitSearch = useMutation({
    mutationKey: ["search"],
    mutationFn: async ({ query }: { query: string }) => {
      const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`, {
        headers: {
          Authorization: `Bearer ${session.data?.accessToken}`,
        }
      })

      if (!res.ok) {
        console.error("Failed to fetch search results:", { res });
        return;
      }

      const data = await res.json();

      console.log("Inside the search form the actual songs", data);

      return data.tracks.items[0] as Track;
    },
    onSuccess: (data) => {
      if (!data) return;
      setSeedRecommendations([...seedRecommendations, data])
    }
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <>
      <Form {...form}>
        <form
          className="max-w-5xl w-full px-2 mx-auto z-50"
          onSubmit={form.handleSubmit((data) =>
            submitSearch.mutate({ ...data }),
          )}
          ref={formRef}
        >
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={submitSearch.isPending || !session.data || seedRecommendations.length >= 5}
                      className="pl-8 ring-1 ring-muted-foreground/20"
                      id="query"
                      type="search"
                      placeholder="Search for music tracks..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          formRef.current?.requestSubmit();
                        }
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </>
  );
}
