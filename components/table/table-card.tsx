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
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Cover Letter</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.map((applicant) => (
            <TableRow key={applicant.id}>
              <TableCell>{applicant.name}</TableCell>
              <TableCell>{applicant.location}</TableCell>
              <TableCell>{applicant.position}</TableCell>
              <TableCell>
                <Button variant="link" asChild>
                  <a
                    href={applicant.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                </Button>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger>
                    <Button
                      variant="link"
                      className={cn(
                        applicant.coverLetter
                          ? "text-violet-700"
                          : "text-zinc-700",
                      )}
                    >
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cover Letter</DialogTitle>
                    </DialogHeader>
                    {applicant.coverLetter || "No cover letter found."}
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-row flex-nowrap">
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
                            applicant.favorite ? "text-violet-700" : "",
                          )}
                          onClick={async () => {
                            await onUpdate({
                              ...applicant,
                              favorite: !applicant.favorite,
                            });
                          }}
                        >
                          {applicant.favorite ? (
                            <StarFilledIcon />
                          ) : (
                            <StarIcon />
                          )}
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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            applicant.archived
                              ? "text-violet-700"
                              : "text-zinc-700",
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
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
