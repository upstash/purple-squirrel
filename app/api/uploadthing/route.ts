import { createRouteHandler } from "uploadthing/next";

import { resumeFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: resumeFileRouter,
});
