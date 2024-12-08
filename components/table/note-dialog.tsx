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
import { Label } from "@/components/ui/label";

import type { Applicant } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  applicant: Applicant;
  onUpdate: (applicant: Applicant) => Promise<void>;
};

export default function NoteDialog({ applicant, onUpdate }: Props) {
  const [note, setNote] = useState(applicant.notes);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = async () => {
    await onUpdate({
      ...applicant,
      notes: note,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "rounded-full hover:bg-primary/20",
            applicant.notes
              ? "bg-primary/10 text-primary hover:text-primary"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          <Pencil2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notes for {applicant.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Add your notes about this candidate</Label>
            <Textarea
              placeholder="Enter your notes here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-40"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>
            Save Notes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
