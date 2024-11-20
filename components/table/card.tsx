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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import NoteDialog from "./note-dialog";

import type { Applicant } from "@/types";
import Collapse from "@/components/collapse";

type Props = {
  applicants: Applicant[];
  onUpdate: (applicant: Applicant) => Promise<void>;
};

export default function TableCard({ applicants, onUpdate }: Props) {
  return (
    <div className="overflow-x-auto border-b">
      <Table className="min-w-[800px]">
        <TableHeader className="bg-zinc-50">
          <TableRow>
            <TableHead className="w-[60px]"></TableHead>
            <TableHead className="w-[50%]">Name</TableHead>
            <TableHead>Position / Location</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.map((applicant) => (
            <TableRow
              key={applicant.id}
              className={cn(applicant.favorite ? "!bg-primary/5" : "")}
            >
              <TableCell className="align-top">
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
              <TableCell className="align-top">
                <h4>
                  <b>{applicant.name}</b>
                </h4>
                {applicant.coverLetter ? (
                  <Collapse className="" placeholder="No cover letter">
                    {applicant.coverLetter}
                  </Collapse>
                ) : (
                  "No cover letter"
                )}
              </TableCell>
              <TableCell className="align-top">
                <p>
                  <b>{applicant.position}</b>
                </p>
                <p className="text-muted-foreground">{applicant.location}</p>
              </TableCell>
              <TableCell className="align-top">
                <a
                  href={applicant.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View
                </a>
              </TableCell>
              <TableCell className="align-top">
                <div className="flex items-center justify-end">
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
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
