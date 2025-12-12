import React from "react";
import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "../../ui/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

interface Props {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export const PublicationsDateFilter: React.FC<Props> = ({ dateRange, onDateRangeChange }) => {
  const [open, setOpen] = React.useState(false);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateRangeChange(undefined);
  };

  const formatDateRange = () => {
    if (!dateRange?.from) return "Filtrar por fecha";
    
    if (dateRange.to) {
      return `${format(dateRange.from, "dd MMM", { locale: es })} - ${format(dateRange.to, "dd MMM", { locale: es })}`;
    }
    
    return format(dateRange.from, "dd MMM yyyy", { locale: es });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !dateRange?.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange()}
          {dateRange?.from && (
            <X
              className="ml-auto h-4 w-4 hover:text-destructive"
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={onDateRangeChange}
          numberOfMonths={1}
          locale={es}
        />
        {dateRange?.from && (
          <div className="border-t p-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                onDateRangeChange(undefined);
                setOpen(false);
              }}
            >
              Limpiar filtro
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
