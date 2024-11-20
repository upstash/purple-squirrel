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
    <div className="flex min-h-screen flex-col items-center justify-between p-10">
      <main className="row-start-2 flex w-[860px] flex-col items-center gap-6 pt-16 sm:items-start">
        <div className="text-3xl font-bold text-primary">Purple Squirrel</div>
        <div className="text-muted-foreground">
          It may take ~2 minutes for applicants to show up after you set the
          digest.
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
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
          <div className="flex flex-row items-center gap-2">
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
            {loading ? "Setting..." : "Run and Set"}
          </Button>
        </div>
      </main>
      <footer className="flex flex-wrap items-center justify-center gap-6">
        <a
          className="flex items-center gap-2 text-muted-foreground hover:underline hover:underline-offset-4"
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
