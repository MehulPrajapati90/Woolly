import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateCalendar } from "@/hooks/query/calendar"
import { useState } from "react"
import { toast } from "sonner"

export function CreateCalendarModal({ children }: { children: React.ReactNode }) {
    const { mutateAsync: createCalendarMutate, isPending: isCreateCalendarPending } = useCreateCalendar();
    const [calendarName, setCalendarName] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleCreateCalendar = async () => {
        // Calendar creation logic goes here
        const newCalendar = { name: calendarName, coverImageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(calendarName)}&background=random` };

        const response = await createCalendarMutate({ ...newCalendar });

        if (response.success) {
            toast.success("Calendar created successfully!");
            setCalendarName("");
            setIsOpen(false);
        } else {
            toast.error(response.message || "Failed to create calendar.");
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
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
    )
};