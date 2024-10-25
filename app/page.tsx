import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pencil2Icon,
  StarIcon,
  ArchiveIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { mockData } from "./mockData";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-10">
      <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start min-w-[804px] pt-16">
        <div className="text-violet-600 font-bold text-3xl">
          Purple Squirrel
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-2 w-full">
            <Input placeholder="Search applicants..." className="w-full" />
            <Button>
              <MagnifyingGlassIcon /> Search
            </Button>
          </div>
          <div className="flex flex-row w-full justify-center">
            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
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
                {mockData.map((applicant) => (
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
                            <DialogDescription>
                              {applicant.coverLetter}
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-violet-700"
                      >
                        <Pencil2Icon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-violet-700"
                      >
                        <StarIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-violet-700"
                      >
                        <ArchiveIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-zinc-700"
          href="https://upstash.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created with Upstash →
        </a>
      </footer>
    </div>
  );
}
