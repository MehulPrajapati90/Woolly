"use client";

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
import { EventCalendar } from "../calendar"
import { Textarea } from "../ui/textarea"
import { useCreateEvent } from "@/hooks/query/event";
import { toast } from "sonner";

const CreateEventModal = () => {
  const [eventMedia, setEventMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("10:00:00");
  const [endTime, setEndTime] = useState<string>("10:30:00");

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const { mutateAsync, isPending } = useCreateEvent();

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

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build complete start and end dates with times
    if (startDate && endDate) {
      const [sh, sm, ss] = startTime.split(':').map(Number);
      const [eh, em, es] = endTime.split(':').map(Number);

      const completeStartDate = new Date(startDate);
      completeStartDate.setHours(sh, sm, ss);

      const completeEndDate = new Date(endDate);
      completeEndDate.setHours(eh, em, es);

      console.log('Start:', completeStartDate);
      console.log('End:', completeEndDate);

      // Your API call here with completeStartDate and completeEndDate

      const response = await mutateAsync({
        name,
        description,
        startDate: completeStartDate,
        endDate: completeEndDate,
        visibility: "PUBLIC",
        coverMediaType: mediaType! as "IMAGE" | "VIDEO",
        coverMediaUrl: eventMedia!,
      });

      if (response.success) {
        // Reset form
        setName("");
        setDescription("");
        setStartDate(undefined);
        setEndDate(undefined);
        setStartTime("10:00:00");
        setEndTime("10:30:00");
        setEventMedia(null);
        setMediaType(null);

        toast.success("Event created successfully!");
      } else {
        toast.error(response.message || "Failed to create event.");
      }

      setOpenDialog(false);
    }
  }

  return (
    <Dialog open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)} >
      <DialogTrigger asChild className="w-full">
        <SidebarMenuButton
          tooltip="Quick Create"
          className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear mx-1 w-full px-15"
        >
          <IconCirclePlusFilled className="mt-0.5" />
          <span>Create Event</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[870px]">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>
            Create New Event from here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full p-2 flex items-start gap-5 justify-between">
          <div className="w-[40%] h-full flex flex-col items-start gap-5">
            <div className="w-full h-75 flex flex-col items-start gap-2">
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
              <div>
                <div className="w-full h-auto flex flex-col items-start gap-2 mb-4">
                  <Label htmlFor="name">Event Name</Label>
                  <Input id="name" placeholder="Add Event Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full" />
                </div>
                <div className="w-full h-auto flex flex-col items-start gap-2 mb-4">
                  <Label htmlFor="description">Event Description</Label>
                  <Textarea id="description" placeholder="Add Event Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-30" />
                </div>
              </div>

              <EventCalendar
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleCreateEvent} type="submit" disabled={isPending || !name || !description || !startDate || !endDate || !startTime || !endTime || !eventMedia || !mediaType}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}

export default CreateEventModal;