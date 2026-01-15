import { currentUser } from "@/utils/auth-utils";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {

    EventCoverImgUpload: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1
        },
        video: {
            maxFileSize: "64MB",
            maxFileCount: 1
        }
    })
        .middleware(async () => {
            const user = await currentUser();
            if (!user) throw new UploadThingError("Unauthorized");
            return { user: user }
        })
        .onUploadComplete(async ({ file }) => {
            return { fileUrl: file.url, fileType: file.type }
        }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;