"use client";

import { SquirrelIcon } from "@primer/octicons-react";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return searchParams &&
    searchParams.hasOwnProperty("externalLink") &&
    searchParams["externalLink"] &&
    typeof searchParams["externalLink"] === "string" ? (
    <div className="flex items-center justify-center pt-8">
      <div className="flex flex-col items-center justify-center gap-2 py-8 px-16 bg-default-50 rounded-medium">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="text-secondary">
            <SquirrelIcon size={48} className="scale-x-[-1]" />
          </div>
          <h1 className="text-2xl">You are leaving Purple Squirrel</h1>
        </div>
        <div className="mt-5">
          If you trust this link, click it to continue.
        </div>
        <Link
          href={searchParams["externalLink"]}
          rel="noopener noreferrer"
          underline="always"
        >
          {searchParams["externalLink"]}
        </Link>
        <Button
          size="md"
          radius="full"
          variant="bordered"
          color="primary"
          className="mt-4"
          startContent={<KeyboardBackspaceOutlinedIcon />}
          onPress={() => {
            window.close();
          }}
        >
          Go back
        </Button>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center pt-8">
      <div className="flex flex-col items-center justify-center gap-2 py-8 px-16 bg-default-50 rounded-medium">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="text-secondary">
            <SquirrelIcon size={48} className="scale-x-[-1]" />
          </div>
          <h1 className="text-2xl">No valid link provided.</h1>
        </div>
        <Button
          size="md"
          radius="full"
          variant="bordered"
          color="primary"
          className="mt-4"
          startContent={<KeyboardBackspaceOutlinedIcon />}
          onPress={() => {
            window.close();
          }}
        >
          Go back
        </Button>
      </div>
    </div>
  );
}
