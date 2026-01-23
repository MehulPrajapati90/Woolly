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
import { Textarea } from "../ui/textarea"
import { useCreateCalendarCategory } from "@/hooks/query/discover"
import { useState } from "react"
import { toast } from "sonner"

export function CreateCalendarCategoryDialog({ children }: { children: React.ReactNode }) {
    const [name, setName] = useState<string>("");
    const [desc, setDesc] = useState<string>("");

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { mutateAsync, isPending } = useCreateCalendarCategory();

    const handleClose = () => {
        setName("");
        setDesc("");
        setIsOpen(false);
    }

    const handleCreateCategory = async () => {
        const res = await mutateAsync({
            name: name,
            description: desc,
            imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        })

        if (res?.success) {
            toast.success(res.message);
        } else {
            toast.error(res?.message);
        }

        handleClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Create Calendar Category</DialogTitle>
                    <DialogDescription>
                        Make Calendar Category. Click save when you&apos;re
                        done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-3">
                    <div className="grid gap-3">
                        <Label htmlFor="name-1">Name</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} id="name-1" name="name" placeholder="Name of Category" />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="desc-1">Description</Label>
                        <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} id="desc-1" name="description" className="h-30" placeholder="Description of Category" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleCreateCategory} disabled={isPending || !name}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};