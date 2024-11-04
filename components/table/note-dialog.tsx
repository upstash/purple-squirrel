import { useState } from "react";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import type { Applicant } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  applicant: Applicant;
  onUpdate: (applicant: Applicant) => Promise<void>;
};

export default function NoteDialog({ applicant, onUpdate }: Props) {
  const [note, setNote] = useState(applicant.notes);

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            applicant.notes ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Pencil2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notes</DialogTitle>
        </DialogHeader>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              onClick={async () => {
                await onUpdate({
                  ...applicant,
                  notes: note,
                });
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
