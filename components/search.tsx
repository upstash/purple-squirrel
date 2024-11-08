import { Input } from "@/components/ui/input";
import React from "react";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const exampleQueries = [
  "Applicants experienced in TypeScript, Next.js and React",
  "Bring me applicants with open source contributions",
  "3+ years of experience in Kubernetes",
];

type Props = {
  query: string;
  setQuery: (query: string) => void;
};

export default function Search({ query, setQuery }: Props) {
  const [focus, setFocus] = React.useState(false);

  return (
    <Popover open={focus && query.length === 0}>
      <PopoverAnchor asChild>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search applicants..."
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            className="pl-10"
          />
          {query && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setQuery("");
              }}
              className="absolute right-2 top-1/2 size-7 -translate-y-1/2"
            >
              <Cross2Icon />
            </Button>
          )}
        </div>
      </PopoverAnchor>

      <PopoverContent
        className="w-full px-10 py-6"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <h5 className="text-xs uppercase text-muted-foreground">
          Example Queries
        </h5>

        <ul className="mt-2">
          {exampleQueries.map((exampleQuery) => (
            <li key={exampleQuery}>
              <Button
                className={cn("p-0 text-muted-foreground hover:text-primary")}
                variant="link"
                onClick={() => {
                  setQuery(exampleQuery);
                }}
              >
                {exampleQuery}
              </Button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
