import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StickyNote } from "lucide-react";

interface NotesPopoverProps {
  notes: string;
}

export function NotesPopover({ notes }: NotesPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Ver anotações"
      >
        <StickyNote className="h-3.5 w-3.5" />
      </PopoverTrigger>
      <PopoverContent className="max-w-xs text-sm" side="right">
        <p className="font-semibold mb-1 text-xs uppercase tracking-wide text-muted-foreground">
          Anotações
        </p>
        <p className="whitespace-pre-wrap">{notes}</p>
      </PopoverContent>
    </Popover>
  );
}
