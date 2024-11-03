"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { digest } from "@/app/actions/digest";

export default function Page() {
  const router = useRouter();
  const [folder, setFolder] = useState("INBOX");
  const [quantity, setQuantity] = useState<number>(2);
  const [interval, setInterval] = useState<"minutes" | "hours">("hours");
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-10">
      <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start w-[860px] pt-16">
        <div className="text-violet-600 font-bold text-3xl">
          Purple Squirrel
        </div>
        <div className="text-zinc-500">
          It may take ~2 minutes for applicants to show up after you set the
          digest.
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            Period:
            <Input
              placeholder="2"
              value={quantity}
              type="number"
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-[80px]"
            />
            <Select
              value={interval}
              onValueChange={(value) =>
                setInterval(value as "minutes" | "hours")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row gap-2 items-center">
            Folder:
            <Input
              placeholder="INBOX"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-[120px]"
            />
          </div>
          <Button
            className="w-min"
            onClick={async () => {
              setLoading(true);
              await digest({ folder, quantity, interval });
              setLoading(false);
              router.push("/");
            }}
            disabled={loading}
          >
            {loading ? "Setting..." : "Set"}
          </Button>
        </div>
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-zinc-700"
          href="https://upstash.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created with Upstash →
        </a>
      </footer>
    </div>
  );
}
