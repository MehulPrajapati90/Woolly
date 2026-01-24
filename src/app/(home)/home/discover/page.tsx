"use client";

import { useDiscoverData } from "@/hooks/query/discover";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CreateCalendarModal } from "@/components/event/create-calendar.modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateCalendarCategoryDialog } from "@/components/event/create-calendar-category";

const DiscoverPage = () => {
    const { data: discover, isPending } = useDiscoverData();

    const router = useRouter();

    const handleCalendarRedirect = (calendarId: string) => {
        router.push(`/home/discover/calendars/${calendarId}`);
    }

    const handleCategoryRedirect = (categoryId: string) => {
        router.push(`/home/discover/category/${categoryId}`);
    }

    if (isPending) {
        return <div className='p-4'>Loading...</div>;
    }

    return (
        <div className='p-10'>
            <div className='w-full py-3 flex items-start gap-3 flex-col'>
                <p className='text-4xl font-semibold font-sans tracking-tight'>Discover Events</p>
                <div className='flex items-center justify-between'>
                    <p className='text-[15px] font-normal font-sans'>Explore popular events near you, browse by category, or check out some of the great community calendars.</p>


                </div>
            </div>

            {/* Browse by Category */}
            <div className="flex flex-col ">
                <div className='w-full pt-10 pb-3 flex items-start gap-3 justify-between'>
                    <p className='text-xl font-semibold font-sans tracking-tight'>Browse by Category</p>
                    {discover?.userRole === "ADMIN" && (
                        <CreateCalendarCategoryDialog>
                            <Button className='flex items-center'>
                                <p>Create Category</p>
                                <Plus size={16} />
                            </Button>
                        </CreateCalendarCategoryDialog>
                    )}
                </div>

                <div className="w-full px-6">
                    {discover?.discovery.calendarCategories?.length === 0 ? (
                        <div className='space-y-4 h-50 flex justify-center items-center'>
                            <p className='text-sm text-muted-foreground'>No Event found. Create one to get started!</p>
                        </div>
                    ) : (
                        <div className='grid grid-cols-5 gap-4 py-4'>
                            {discover?.discovery.calendarCategories?.map((category) => (
                                <div key={category?.id} onClick={() => handleCategoryRedirect(category?.id)} className='border p-4 rounded-md hover:shadow-md cursor-pointer bg-neutral-950 hover:bg-neutral-900 duration-200 transition-all ease-in-out'>
                                    <Image unoptimized src={category?.coverImageUrl! || ""} alt='Calendar Image' width={100} height={100} className='w-full h-25 object-cover rounded-md mb-4' />
                                    <p className='font-medium text-lg'>{category.name}</p>
                                    <p className='text-sm text-muted-foreground mt-1'>{category.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-center w-full">
                <div className="w-200 flex items-center justify-center">
                    <Separator className="my-10" />
                </div>
            </div>

            {/* Featured Calendars */}
            <div className="flex flex-col ">
                <div className='w-full pt-10 pb-3 flex items-start gap-3 justify-between'>
                    <p className='text-xl font-semibold font-sans tracking-tight'>Featured Calendars</p>
                    {discover?.userRole === "ADMIN" && (
                        <CreateCalendarModal>
                            <Button className='flex items-center'>
                                <p>Create Calender</p>
                                <Plus size={16} />
                            </Button>
                        </CreateCalendarModal>
                    )}
                </div>

                <div className="w-full px-6">
                    {discover?.discovery.calendars?.length === 0 ? (
                        <div className='space-y-4 h-50 flex justify-center items-center'>
                            <p className='text-sm text-muted-foreground'>No Event found. Create one to get started!</p>
                        </div>
                    ) : (
                        <div className='grid grid-cols-5 gap-4 py-4'>
                            {discover?.discovery.calendars?.map((calendar) => (
                                <div key={calendar?.id} onClick={() => handleCalendarRedirect(calendar?.id)} className='border p-4 rounded-md hover:shadow-md cursor-pointer bg-neutral-950 hover:bg-neutral-900 duration-200 transition-all ease-in-out'>
                                    <Image unoptimized src={calendar?.coverImageUrl! || ""} alt='Calendar Image' width={100} height={100} className='w-full h-25 object-cover rounded-md mb-4' />
                                    <p className='font-medium text-lg'>{calendar.name}</p>
                                    <p className='text-sm text-muted-foreground mt-1'>{calendar.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DiscoverPage;