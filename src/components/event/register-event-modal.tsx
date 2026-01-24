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
import { useRegisterEvents } from "@/hooks/query/event";
import { useState } from "react";
import { toast } from "sonner";

export function RegisterEventModal({ children, eventName, HostName, eventId, eventVisibility }: { children: React.ReactNode, eventName: string, HostName: string, eventId: string, eventVisibility: "PUBLIC" | "PRIVATE" | "UNLISTED" }) {
    const { mutateAsync: registerEvent, isPending: isRegisteringEvent } = useRegisterEvents();
    const [isOpen, setIsOpen] = useState(false);

    const handleRegisterEvent = async () => {
        const response = await registerEvent({ eventId: eventId, eventVisibility: eventVisibility });
        if (response.success) {
            toast.success("Event registered successfully!");
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Register for Event</DialogTitle>
                    <DialogDescription>
                        Register for the event by filling out the form below.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 px-1">
                    <div className="flex flex-col items-start w-full bg-neutral-800 px-2 rounded-[5px] py-2">
                        <p className="text-sm text-neutral-400 font-mono text-[13px]">
                            You are registering for the event: <span className="font-medium text-neutral-100">{eventName}</span>
                            <br />
                            <span className="text-neutral-400 font-mono text-[13px]">
                                Hosted by: <span className="font-medium text-neutral-100">{HostName}</span>
                            </span>
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleRegisterEvent} disabled={isRegisteringEvent}>
                        {isRegisteringEvent ? "Registering..." : "Register"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
