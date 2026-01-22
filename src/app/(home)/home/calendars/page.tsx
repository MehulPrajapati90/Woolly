"use client";

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useGetCalendarsByHostId } from '@/hooks/query/calendar';
import { Plus } from 'lucide-react';

const CalendarsPage = () => {
  const { data: calendars, isPending } = useGetCalendarsByHostId();

  if (isPending) {
    return <div className='flex-1 flex items-center justify-center w-full'>
      <Spinner />
    </div>
  }

  return (
    <div className='p-10'>
      <div className='w-full py-6 flex items-center gap-3'>
        <p className='text-4xl font-semibold font-sans tracking-tight'>Calendars</p>
        {/* <CalendarRange size={30} strokeWidth={1.5} /> */}
      </div>

      <div className='p-2 py-5 font-sans flex flex-col gap-6'>
        <div className='flex items-center justify-between'>
          <p className='text-lg font-medium'>Your Calendars</p>
          <Button className='flex items-center'>
            <p>Create Calender</p>
            <Plus size={16} />
          </Button>
        </div>

        <div className=''>
          {calendars?.calendars?.length === 0 ? (
            <div className='space-y-4 h-100 flex justify-center items-center'>
              <p className='text-sm text-muted-foreground'>No calendars found. Create one to get started!</p>
            </div>
          ) : (
            <div className='grid grid-cols-3 gap-4 mt-6 '>
              {calendars?.calendars?.map((calendar: any) => (
                <div key={calendar.id} className='border p-4 rounded-md hover:shadow-md transition-shadow cursor-pointer'>
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
};

export default CalendarsPage;