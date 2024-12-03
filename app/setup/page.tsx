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
    <main className="mx-auto max-w-screen-sm py-20">
      <header>
        <h1 className="text-3xl font-bold text-primary">Purple Squirrel</h1>
        <h2 className="text-muted-foreground">
          It may take ~2 minutes for applicants to show up after you set the
          digest.
        </h2>
      </header>

      <table className="mt-8">
        <tr>
          <th className="py-2 text-left font-normal">Period:</th>
          <td className="py-2 pl-2">
            <div className="flex items-center gap-2">
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
          </td>
        </tr>
        <tr>
          <th className="py-2 text-left font-normal">Folder:</th>
          <td className="py-2 pl-2">
            <Input
              placeholder="INBOX"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-[120px]"
            />
          </td>
        </tr>
        <tr>
          <th className="py-2"></th>
          <td className="py-2 pl-2">
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
          </td>
        </tr>
      </table>
    </main>
  );
}
