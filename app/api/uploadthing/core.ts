import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const resumeFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "1MB", maxFileCount: 1 } })
    .middleware(async ({}) => {
      return {};
    })
    .onUploadComplete(async ({}) => {
      return {};
    }),
} satisfies FileRouter;

export type ResumeFileRouter = typeof resumeFileRouter;
