import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { StarIcon, StarFilledIcon, ArchiveIcon } from "@radix-ui/react-icons";
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
  displayApplicants: Applicant[];
  onUpdate: (applicant: Applicant) => Promise<void>;
};

export default function TableCard({ displayApplicants, onUpdate }: Props) {
  return (
    <Card className="p-1">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Position</TableHead>
            <TableHead className="pl-6">Resume</TableHead>
            <TableHead className="pl-6">Cover Letter</TableHead>
            <TableHead className="pl-5">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayApplicants.map((applicant) => (
            <TableRow key={applicant.id}>
              <TableCell>{applicant.name}</TableCell>
              <TableCell>{applicant.location}</TableCell>
              <TableCell>{applicant.position}</TableCell>
              <TableCell>
                <Button variant="link">
                  <a
                    href={applicant.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </a>
                </Button>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger>
                    <Button variant="link">View Cover Letter</Button>
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
                            "hover:text-violet-700",
                            applicant.favorite
                              ? "text-violet-700"
                              : "text-zinc-700"
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
                            "hover:text-violet-700",
                            applicant.archived
                              ? "text-violet-700"
                              : "text-zinc-700"
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
    </Card>
  );
}
