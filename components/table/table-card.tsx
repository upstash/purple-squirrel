import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArchiveIcon, StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import NoteDialog from "./note-dialog";

import type { Applicant } from "@/types";

type Props = {
  applicants: Applicant[];
  onUpdate: (applicant: Applicant) => Promise<void>;
};

export default function TableCard({ applicants, onUpdate }: Props) {
  return (
    <div className="rounded-lg border px-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead className="w-[25%]">Name</TableHead>
            <TableHead className="w-[25%]">Position</TableHead>
            <TableHead className="w-[20%]">Location</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Cover</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.map((applicant) => (
            <TableRow key={applicant.id}>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          applicant.favorite
                            ? "text-primary"
                            : "text-muted-foreground",
                        )}
                        onClick={async () => {
                          await onUpdate({
                            ...applicant,
                            favorite: !applicant.favorite,
                          });
                        }}
                      >
                        {applicant.favorite ? <StarFilledIcon /> : <StarIcon />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {applicant.favorite
                          ? "Remove from favorites"
                          : "Add to favorites"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                <b>{applicant.name}</b>
              </TableCell>
              <TableCell>{applicant.position}</TableCell>
              <TableCell className="text-muted-foreground">
                {applicant.location}
              </TableCell>
              <TableCell>
                <a
                  href={applicant.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View
                </a>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger>
                    <a
                      className={cn(
                        applicant.coverLetter
                          ? "text-primary hover:underline"
                          : "text-muted-foreground",
                      )}
                    >
                      View
                    </a>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cover Letter</DialogTitle>
                    </DialogHeader>
                    {applicant.coverLetter || "No cover letter found."}
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell className="flex items-center justify-end gap-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <NoteDialog applicant={applicant} onUpdate={onUpdate} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add or edit notes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          applicant.archived
                            ? "text-primary"
                            : "text-muted-foreground",
                        )}
                        onClick={async () => {
                          await onUpdate({
                            ...applicant,
                            archived: !applicant.archived,
                          });
                        }}
                      >
                        <ArchiveIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{applicant.archived ? "Unarchive" : "Archive"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
