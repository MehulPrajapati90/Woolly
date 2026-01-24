

interface CalendarProps {
    params: Promise<{
        calendarId: string;
    }>
}

const Calendar = async ({ params }: CalendarProps) => {
    const { calendarId } = await params;
    return (
        <div className='p-4'>{calendarId}</div>
    )
}

export default Calendar;