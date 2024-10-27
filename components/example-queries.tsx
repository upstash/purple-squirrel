import { Button } from "@/components/ui/button";

type Props = {
  setQuery: (query: string) => void;
  onSearch: (query: string) => Promise<void>;
};

export default function ExampleQueries({ setQuery, onSearch }: Props) {
  return (
    <div className="flex flex-col items-center pt-2">
      <div className="text-zinc-500">Example Queries</div>
      {exampleQueries.map((exampleQuery) => (
        <Button
          key={exampleQuery}
          className="text-zinc-700"
          variant="link"
          onClick={async () => {
            setQuery(exampleQuery);
            await onSearch(exampleQuery);
          }}
        >
          {exampleQuery} →
        </Button>
      ))}
    </div>
  );
}

const exampleQueries = [
  "Applicants experienced in TypeScript, Next.js and React",
  "Bring me applicants with open source contributions",
  "3+ years of experience in Kubernetes",
];
