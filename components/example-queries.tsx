import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React from "react";

type Props = {
  setQuery: (query: string) => void;
  onSearch: (query: string) => Promise<void>;
};

export default function ExampleQueries({ setQuery, onSearch }: Props) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-muted-foreground">Example Queries</div>

      <ul className="mt-2">
        {exampleQueries.map((exampleQuery) => (
          <li key={exampleQuery}>
            <Button
              variant="link"
              onClick={async () => {
                setQuery(exampleQuery);
                return onSearch(exampleQuery);
              }}
            >
              {exampleQuery}
              <MagnifyingGlassIcon />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const exampleQueries = [
  "Applicants experienced in TypeScript, Next.js and React",
  "Bring me applicants with open source contributions",
  "3+ years of experience in Kubernetes",
];
