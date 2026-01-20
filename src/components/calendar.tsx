"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EventCalendarProps {
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
}

// Generate time options with 30-minute intervals
const generateTimeOptions = () => {
  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, '0');
      const minute = m.toString().padStart(2, '0');
      times.push(`${hour}:${minute}:00`);
    }
  }
  return times;
};

const formatTimeDisplay = (time: string) => {
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour.toString().padStart(2, '0')}:${m} ${ampm}`;
};

export function EventCalendar({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime
}: EventCalendarProps) {
  const [startOpen, setStartOpen] = React.useState(false);
  const [endOpen, setEndOpen] = React.useState(false);

  const timeOptions = generateTimeOptions();

  // Get available end times based on start date/time
  const getAvailableEndTimes = () => {
    if (!startDate || !endDate) return timeOptions;

    // If same day, filter times to be after start time
    if (startDate.toDateString() === endDate.toDateString()) {
      return timeOptions.filter(time => time > startTime);
    }

    return timeOptions;
  };

  // Validate and adjust end time when start time changes
  React.useEffect(() => {
    if (startDate && endDate && startDate.toDateString() === endDate.toDateString()) {
      if (endTime <= startTime) {
        // Find next available time slot
        const nextTime = timeOptions.find(time => time > startTime);
        if (nextTime) {
          setEndTime(nextTime);
        }
      }
    }
  }, [startTime, startDate, endDate]);

  // Validate and adjust end date/time when start date changes
  React.useEffect(() => {
    if (startDate && endDate && endDate < startDate) {
      setEndDate(startDate);
    }
  }, [startDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        <div className="flex flex-col gap-3 flex-1">
          <Label htmlFor="start-date" className="px-1">
            Start Date
          </Label>
          <Popover open={startOpen} onOpenChange={setStartOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="start-date"
                className="w-full justify-between font-normal"
              >
                {startDate ? startDate.toLocaleDateString() : "Select date"}
                <ChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                captionLayout="dropdown"
                disabled={(date) => date < today}
                onSelect={(date) => {
                  setStartDate(date);
                  setStartOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-3 flex-1">
          <Label htmlFor="start-time" className="px-1">
            Start Time
          </Label>
          <Select value={startTime} onValueChange={setStartTime}>
            <SelectTrigger id="start-time" className="w-full">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className="h-100">
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {formatTimeDisplay(time)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-3 flex-1">
          <Label htmlFor="end-date" className="px-1">
            End Date
          </Label>
          <Popover open={endOpen} onOpenChange={setEndOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="end-date"
                className="w-full justify-between font-normal"
              >
                {endDate ? endDate.toLocaleDateString() : "Select date"}
                <ChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                captionLayout="dropdown"
                disabled={(date) => {
                  if (date < today) return true;
                  if (startDate && date < startDate) return true;
                  return false;
                }}
                onSelect={(date) => {
                  setEndDate(date);
                  setEndOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-3 flex-1">
          <Label htmlFor="end-time" className="px-1">
            End Time
          </Label>
          <Select value={endTime} onValueChange={setEndTime}>
            <SelectTrigger id="end-time" className="w-full">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className="h-100">
              {getAvailableEndTimes().map((time) => (
                <SelectItem key={time} value={time}>
                  {formatTimeDisplay(time)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}