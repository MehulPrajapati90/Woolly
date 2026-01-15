import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconCirclePlusFilled } from "@tabler/icons-react"
import { SidebarMenuButton } from "../ui/sidebar"
import { UploadDropzone } from "@uploadthing/react"
import { OurFileRouter } from "@/lib/uploadThings"
import Image from "next/image"
import { Trash } from "lucide-react"
import { useEffect, useState } from "react"
import Hint from "../ui/hint"
import { Calendar } from "../ui/calendar"

const EventMediaType = [
  { label: "Video", value: "VIDEO" },
  { label: "Image", value: "IMAGE" }
]

const CreateEventModal = () => {
  const [eventMedia, setEventMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);

  const handleRemove = () => {
    setEventMedia(null);
    setMediaType(null);
  }

  useEffect(() => {
    if (!eventMedia) {
      setMediaType(null);
    }

    if (mediaType && eventMedia) {
      if (mediaType.startsWith('image') || mediaType.startsWith('IMAGE')) {
        setMediaType("IMAGE");
      } else {
        setMediaType("VIDEO")
      }
    };

  }, [mediaType, eventMedia]);

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild className="w-full">
          <SidebarMenuButton
            tooltip="Quick Create"
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear mx-1 w-full px-15"
          >
            <IconCirclePlusFilled className="mt-0.5" />
            <span>Create Event</span>
          </SidebarMenuButton>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[825px]">
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
            <DialogDescription>
              Create New Event from here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <div className="w-full p-2 flex items-start gap-1 justify-between">
            <div className="w-[40%] h-full flex flex-col items-start gap-5">
              <div className="w-full h-70 flex flex-col items-start gap-2">
                <Label htmlFor="name">Event Cover</Label>
                {eventMedia ? (
                  <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black/40 w-full h-full">
                    <div className="absolute top-2 right-2 z-10">
                      <Hint asChild side="left" label="Remove thumbnail">
                        <Button type="button" onClick={handleRemove} className="h-auto w-auto p-1.5 bg-white/10 hover:bg-white/20">
                          <Trash className="h-4 w-4 text-black" />
                        </Button>
                      </Hint>
                    </div>
                    <Image
                      fill
                      unoptimized
                      alt="Container Cover Image"
                      src={eventMedia ?? ""}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-video w-full rounded-xl bg-white/5 border-2 border-dashed border-black/20
                flex items-center justify-center overflow-hidden
                hover:border-black/40 transition-colors h-full">

                    <UploadDropzone<OurFileRouter, "EventCoverImgUpload">
                      endpoint="EventCoverImgUpload"
                      appearance={{
                        container: {
                          width: "100%",
                          height: "100%",
                        },
                        label: {
                          color: `dark:#000`,
                          fontSize: "14px",
                          fontWeight: "500",
                        },
                        allowedContent: {
                          color: "#9ca3af",
                          fontSize: "12px",
                        },
                        button: {
                          backgroundColor: "#4e7bff",
                          padding: "8px 14px",
                          borderRadius: "8px",
                        },
                      }}
                      onClientUploadComplete={(res) => {
                        setEventMedia(res?.[0].url);
                        setMediaType(res?.[0].type);
                      }}
                      onUploadError={console?.error}
                    />
                  </div>
                )}
              </div>

              <div className="w-full h-auto flex flex-col items-start gap-2">
                <Label htmlFor="name">Event Media Type</Label>
                <Input placeholder="Auto generated when upload happens" value={mediaType ?? ""} onChange={(e) => e.target.value} className="w-full" />

              </div>

            </div>

            <div className="w-[60%]">
              <div className="w-full">
              <Calendar onDayClick={(v) => console.log(v)} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default CreateEventModal;