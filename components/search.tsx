import { Input, InputProps } from "@/components/ui/input";
import React from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export default function Search(props: InputProps) {
  return (
    <div className="relative">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search applicants..."
        {...props}
        className={cn("pl-10", props.className)}
      />
    </div>
  );
}
