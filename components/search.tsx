import { Input, InputProps } from "@/components/ui/input";
import React from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
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

export default function Search({
  setQuery,
  onSearch,
  ...props
}: InputProps & {
  setQuery: (query: string) => void;
  onSearch: (query: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open}>
      <PopoverAnchor asChild>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search applicants..."
            onChange={(e) => setQuery(e.target.value)}
            onKeyUp={async (e) => {
              if (e.key === "Enter") {
                return onSearch(e.currentTarget.value);
              }
            }}
            {...props}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            className={cn("pl-10", props.className)}
          />
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
                onClick={async () => {
                  setQuery(exampleQuery);
                  return onSearch(exampleQuery);
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
