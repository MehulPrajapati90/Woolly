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
import { UploadDropzone } from "@uploadthing/react"
import { OurFileRouter } from "@/lib/uploadThings"
import Image from "next/image"
import { Plus, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import Hint from "../ui/hint"
import { EventCalendar } from "../calendar"
import { Textarea } from "../ui/textarea"
import { useCreateEvent } from "@/hooks/query/event";
import { toast } from "sonner";
import { useCreateCalendar, useGetCalendarsByHostId } from "@/hooks/query/calendar";
import { Spinner } from "../ui/spinner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CalendarType {
  name: string;
  id: string;
  description: string | null;
  coverImageUrl: string | null;
  coverBannerUrl: string | null;
  locationUTC: string | null;
  timezone: string | null;
}

const UpdateEventModal = ({ children }: { children: React.ReactNode }) => {
  const [eventMedia, setEventMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("10:00:00");
  const [endTime, setEndTime] = useState<string>("10:30:00");

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [createCalendar, setCreateCalendar] = useState<boolean>(false);

  const [calendarId, setCalendarId] = useState<string>("");
  const [calendarName, setCalendarName] = useState<string>("");

  const { mutateAsync, isPending } = useCreateEvent();
  const { data: calendars, isPending: isCalendarsPending } = useGetCalendarsByHostId();
  const { mutateAsync: createCalendarMutate, isPending: isCreateCalendarPending } = useCreateCalendar();

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
        calendarId: calendarId!,
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
        setCalendarId("");

        toast.success("Event created successfully!");
      } else {
        toast.error(response.message || "Failed to create event.");
      }

      setOpenDialog(false);
    }
  };

  const handleCreateCalendar = async () => {
    // Calendar creation logic goes here
    const newCalendar = { name: calendarName, coverImageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(calendarName)}&background=random` };

    const response = await createCalendarMutate({ ...newCalendar });

    if (response.success) {
      toast.success("Calendar created successfully!");
      setCreateCalendar(false);
      setCalendarName("");

      setCalendarId(response?.calendar?.id || "");
    } else {
      toast.error(response.message || "Failed to create calendar.");
    }
  };

  if (isCalendarsPending) {
    return (
      <div className="w-full h-40 flex items-center justify-center">
        <Spinner />
      </div>
    );
  };

  return (
    <Dialog open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)} >
      <DialogTrigger asChild className="w-full">
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]">
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
                  <Textarea id="description" placeholder="Add Event Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-25" />
                </div>
                <div className="w-full h-auto flex flex-row items-center gap-4 mb-4">
                  <div className="w-full h-auto flex flex-col items-start gap-2 mb-4">
                    <Label htmlFor="name">Select Calendar</Label>
                    <Select value={calendarId} onValueChange={(value) => setCalendarId(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Calendar" />
                      </SelectTrigger>
                      <SelectContent>
                        {calendars?.calendars?.map((calendar: CalendarType) => (
                          <SelectItem key={calendar?.id} value={calendar?.id}>
                            {calendar?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full h-auto flex flex-col items-start gap-2 mb-4">
                    <Label htmlFor="name">Select Calendar</Label>
                    <Button className="w-full text-left" asChild variant="outline" onClick={() => setCreateCalendar(true)}>
                      <div>
                        <p>New Calendar</p>
                        <Plus size={18} />
                      </div>
                    </Button>
                  </div>
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


      {createCalendar && (
        <Dialog open={createCalendar} onOpenChange={() => setCreateCalendar(!createCalendar)} >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Calendar</DialogTitle>
              <DialogDescription>
                Create New Calendar from here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            {/* Calendar creation form goes here */}
            <div className="w-full h-auto flex flex-col items-start gap-2 my-4">
              <Label htmlFor="name">Calendar Name</Label>
              <Input id="name" placeholder="Add Calendar Name" value={calendarName} onChange={(e) => setCalendarName(e.target.value)} className="w-full" />
            </div>

            <DialogFooter>
              <Button type="button" onClick={handleCreateCalendar} disabled={isCreateCalendarPending || !calendarName}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Dialog >
  )
}

export default UpdateEventModal;