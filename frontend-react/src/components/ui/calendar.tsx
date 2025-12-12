"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "./utils";

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-white rounded-xl shadow-sm border border-gray-100", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-6",
        month: "space-y-4",
        caption: "flex justify-center pt-2 relative items-center mb-3",
        caption_label: "text-base font-semibold text-gray-900",
        nav: "flex items-center gap-2 absolute right-4",
        button_previous: cn(
          "h-8 w-8 bg-white p-0 transition-all duration-200",
          "inline-flex items-center justify-center rounded-lg text-sm font-medium",
          "border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
          "text-gray-600 hover:text-gray-900",
          "shadow-sm hover:shadow"
        ),
        button_next: cn(
          "h-8 w-8 bg-white p-0 transition-all duration-200",
          "inline-flex items-center justify-center rounded-lg text-sm font-medium",
          "border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
          "text-gray-600 hover:text-gray-900",
          "shadow-sm hover:shadow"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex gap-1 mb-2",
        weekday: "text-gray-500 rounded-md w-10 font-medium text-xs uppercase tracking-wider",
        week: "flex w-full gap-1 mt-1",
        day_button: cn(
          "h-10 w-10 p-0 font-normal rounded-lg transition-all duration-200",
          "inline-flex items-center justify-center text-sm",
          "hover:bg-blue-50 hover:text-blue-600 hover:scale-105",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-40"
        ),
        day: "p-0 relative",
        range_start: "day-range-start rounded-l-lg bg-blue-500 text-white hover:bg-blue-600",
        range_end: "day-range-end rounded-r-lg bg-blue-500 text-white hover:bg-blue-600",
        selected: "bg-blue-500 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white font-semibold shadow-sm",
        today: "bg-blue-100 text-blue-900 font-bold ring-2 ring-blue-500 ring-offset-1",
        outside: "text-gray-400 opacity-60 hover:opacity-100",
        disabled: "text-gray-300 opacity-50 line-through",
        range_middle: "aria-selected:bg-blue-100 aria-selected:text-blue-700 rounded-none hover:bg-blue-200",
        hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}