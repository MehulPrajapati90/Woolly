

interface HostCalendarProps {
    params: Promise<{
        calendarId: string;
    }>
}

const HostCalendar = async ({ params }: HostCalendarProps) => {
    const { calendarId } = await params;
    return (
        <div className='p-4'>{calendarId}</div>
    )
}

export default HostCalendar;