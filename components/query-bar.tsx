import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

type Props = {
  query: string;
  setQuery: (query: string) => void;
  onSearch: (query: string) => Promise<void>;
};

export default function QueryBar({ query, setQuery, onSearch }: Props) {
  return (
    <div className="flex w-full flex-row gap-2">
      <Input
        placeholder="Search applicants..."
        className="w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyUp={async (e) => {
          if (e.key === "Enter") {
            await onSearch(query);
          }
        }}
      />
      <Button onClick={async () => await onSearch(query)}>
        <MagnifyingGlassIcon /> Search
      </Button>
    </div>
  );
}
