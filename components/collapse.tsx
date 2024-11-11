import { cn } from "@/lib/utils";
import React from "react";

export default function Collapse({
  className,
  children,
  placeholder = "No cover letter",
  ...props
}: React.ComponentProps<"p"> & { children: string; placeholder?: string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <p {...props} className={cn(className, children ? "" : "text-zinc-400")}>
      {open ? children : children.slice(0, 120) || placeholder}{" "}
      <span
        className="cursor-pointer text-primary"
        onClick={() => setOpen(!open)}
      >
        {open ? "...less" : "...more"}
      </span>
    </p>
  );
}
