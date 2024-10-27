import { useState } from "react";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import type { Applicant } from "@/types";

type Props = {
  applicant: Applicant;
  onUpdate: (applicant: Applicant) => Promise<void>;
};

export default function NoteDialog({ applicant, onUpdate }: Props) {
  const [note, setNote] = useState(applicant.notes);
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost" size="icon" className="hover:text-violet-700">
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
